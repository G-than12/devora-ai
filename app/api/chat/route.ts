import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from '@google/genai';
import { NextResponse } from 'next/server';
import { buildSystemPrompt } from '@/lib/prompt';
import { v4 as uuidv4 } from 'uuid';

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const npmPackageLookup: FunctionDeclaration = {
  name: "npm_package_lookup",
  description: "Retrieve current metadata for an npm package.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      package: {
        type: Type.STRING,
        description: "The name of the npm package (e.g., 'axios', 'react')."
      }
    },
    required: ["package"]
  }
};

const githubRepositoryLookup: FunctionDeclaration = {
  name: "github_repository_lookup",
  description: "Retrieve current public metadata about a GitHub repository.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      owner: {
        type: Type.STRING,
        description: "The owner of the repository."
      },
      repository: {
        type: Type.STRING,
        description: "The name of the repository."
      }
    },
    required: ["owner", "repository"]
  }
};

const tools = [{
  functionDeclarations: [npmPackageLookup, githubRepositoryLookup]
}];

export async function POST(req: Request) {
  try {
    const { message, history, preferences, conversationId, messageId } = await req.json();

    const systemInstruction = buildSystemPrompt(preferences);

    const contents: any[] = history.map((msg: any) => {
      // Filter out tool logs for the API request context, or keep them if needed.
      return {
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }]
      };
    });

    contents.push({ role: 'user', parts: [{ text: message }] });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: any) => {
          controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
        };

        try {
          sendEvent({ type: 'meta', conversation_id: conversationId, assistant_message_id: messageId });

          let responseStream = await ai.models.generateContentStream({
            model: 'gemini-3.5-flash',
            contents,
            config: {
              systemInstruction,
              temperature: preferences.temperature,
              tools
            }
          });

          let functionCalls: any[] = [];
          let accumulatedContent: any = null;

          for await (const chunk of responseStream) {
            const c = chunk as GenerateContentResponse;
            if (c.functionCalls && c.functionCalls.length > 0) {
               functionCalls = c.functionCalls;
               accumulatedContent = c.candidates?.[0]?.content;
               break; // Model wants to call a tool, stop reading this stream
            } else if (c.text) {
               sendEvent({ type: 'delta', text: c.text });
            }
          }

          if (functionCalls.length > 0) {
            const functionResponses: any[] = [];
            
            for (const call of functionCalls) {
              sendEvent({ type: 'tool_start', tool: call.name, label: `Running ${call.name}...` });
              
              let result;
              let status = 'success';
              try {
                if (call.name === 'npm_package_lookup') {
                  const pkg = (call.args as any).package;
                  const res = await fetch(`https://registry.npmjs.org/${pkg}`);
                  const data = await res.json();
                  result = {
                    name: data.name,
                    description: data.description,
                    version: data['dist-tags']?.latest,
                    license: data.license,
                    homepage: data.homepage
                  };
                } else if (call.name === 'github_repository_lookup') {
                  const { owner, repository } = call.args as any;
                  const res = await fetch(`https://api.github.com/repos/${owner}/${repository}`);
                  const data = await res.json();
                  result = {
                    name: data.name,
                    full_name: data.full_name,
                    description: data.description,
                    stargazers_count: data.stargazers_count,
                    forks_count: data.forks_count,
                    open_issues_count: data.open_issues_count,
                    language: data.language
                  };
                }
              } catch (err: any) {
                result = { error: err.message };
                status = 'error';
              }
              
              sendEvent({ type: 'tool_end', tool: call.name, status, result });
              functionResponses.push({ name: call.name, response: result });
            }

            if (accumulatedContent) {
              contents.push(accumulatedContent);
            }
            
            contents.push({
              role: 'user',
              parts: functionResponses.map(fr => ({
                functionResponse: {
                  name: fr.name,
                  response: fr.response
                }
              }))
            });

            // Second pass after tool calls
            const secondStream = await ai.models.generateContentStream({
              model: 'gemini-3.5-flash',
              contents,
              config: {
                systemInstruction,
                temperature: preferences.temperature,
              }
            });

            for await (const chunk of secondStream) {
               const c = chunk as GenerateContentResponse;
               if (c.text) {
                 sendEvent({ type: 'delta', text: c.text });
               }
            }
          }

          sendEvent({ type: 'done', message_id: messageId, status: 'completed' });
          controller.close();
        } catch (error: any) {
          let parsedMessage = error.message || 'An error occurred';
          try {
             const errorStr = parsedMessage.toString();
             if (errorStr.includes('{')) {
                const jsonStr = errorStr.substring(errorStr.indexOf('{'));
                const parsed = JSON.parse(jsonStr);
                if (parsed.error && parsed.error.message) {
                   const innerParsed = typeof parsed.error.message === 'string' && parsed.error.message.startsWith('{') ? JSON.parse(parsed.error.message) : parsed.error;
                   parsedMessage = innerParsed.error?.message || innerParsed.message || parsed.error.message;
                }
             }
          } catch (e) {
             // Fallback to original message
          }
          console.warn("Stream API Warning:", parsedMessage);
          sendEvent({ type: 'error', code: 'AI_PROVIDER_ERROR', message: parsedMessage });
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no'
      }
    });

  } catch (error: any) {
    console.warn("Chat API Warning:", error.message || error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
