'use client';

import { v4 as uuidv4 } from 'uuid';
import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';
import { Button } from '@/components/ui/button';
import { Send, Square, AlertCircle, Loader2, Copy, Check, TerminalSquare, BrainCircuit, GitBranch, Package, Pencil } from 'lucide-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function ChatConversationPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const { conversations, addMessage, updateMessage, setActiveConversation, preferences } = useChatStore();
  const conversation = conversations[id];
  
  const [input, setInput] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const triggerApi = React.useCallback(async (messageContent: string) => {
    if (!conversation) return;
    
    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    const assistantMessageId = uuidv4();
    
    // Add placeholder assistant message
    addMessage(id, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      status: 'streaming',
      toolLogs: [],
      createdAt: Date.now()
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: id,
          messageId: assistantMessageId,
          message: messageContent,
          history: conversation.messages.filter(m => m.status === 'completed'),
          preferences
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
           const errData = await response.json();
           if (errData.error) errorMsg = typeof errData.error === 'string' ? errData.error : JSON.stringify(errData.error);
        } catch (e) {}
        throw new Error(errorMsg);
      }

      if (!response.body) {
         throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';
      let currentToolLogs: any[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            
            if (event.type === 'delta') {
              accumulatedText += event.text;
              updateMessage(id, assistantMessageId, { content: accumulatedText });
            } else if (event.type === 'tool_start') {
              currentToolLogs = [...currentToolLogs, {
                toolName: event.tool,
                input: {},
                status: 'running'
              }];
              updateMessage(id, assistantMessageId, { toolLogs: currentToolLogs });
            } else if (event.type === 'tool_end') {
               currentToolLogs = currentToolLogs.map(log => 
                 log.toolName === event.tool && log.status === 'running' 
                   ? { ...log, status: event.status, input: event.result } 
                   : log
               );
               updateMessage(id, assistantMessageId, { toolLogs: currentToolLogs });
            } else if (event.type === 'error') {
               let displayError = event.message || 'An error occurred during generation.';
               try {
                 const parsed = JSON.parse(displayError);
                 if (parsed.error && parsed.error.message) {
                   displayError = parsed.error.message;
                 }
               } catch (e) {
                 // Might have a prefix like "Error [ApiError]: {"
                 if (displayError.includes('{')) {
                    try {
                       const jsonStr = displayError.substring(displayError.indexOf('{'));
                       const parsed = JSON.parse(jsonStr);
                       if (parsed.error && parsed.error.message) {
                          const innerParsed = typeof parsed.error.message === 'string' && parsed.error.message.startsWith('{') ? JSON.parse(parsed.error.message) : parsed.error;
                          displayError = innerParsed.error?.message || innerParsed.message || parsed.error.message;
                       }
                    } catch (e2) {}
                 }
               }
               updateMessage(id, assistantMessageId, { status: 'error', errorMessage: displayError });
               setIsStreaming(false);
            } else if (event.type === 'done') {
               updateMessage(id, assistantMessageId, { status: 'completed' });
               setIsStreaming(false);
            }
          } catch (e) {
            console.error('Failed to parse NDJSON line', e, line);
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
         updateMessage(id, assistantMessageId, { status: 'stopped' });
      } else {
         updateMessage(id, assistantMessageId, { status: 'error', errorMessage: error.message || 'Network or unexpected error occurred.' });
      }
      setIsStreaming(false);
    }
  }, [addMessage, conversation, id, preferences, updateMessage]);

  React.useEffect(() => {
    setActiveConversation(id);
    if (!conversation) {
      router.push('/chat');
      return;
    }

    // Check if we need to auto-trigger the API (new chat flow)
    const shouldTrigger = sessionStorage.getItem(`trigger-api-${id}`);
    if (shouldTrigger && conversation.messages.length === 1 && conversation.messages[0].role === 'user') {
      sessionStorage.removeItem(`trigger-api-${id}`);
      setTimeout(() => triggerApi(conversation.messages[0].content), 0);
    }
  }, [id, conversation, router, setActiveConversation, triggerApi]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const content = input;
    setInput('');

    addMessage(id, {
      id: uuidv4(),
      role: 'user',
      content,
      status: 'completed',
      createdAt: Date.now()
    });

    triggerApi(content);
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!conversation) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-none p-4 sm:p-6 space-y-4 md:space-y-6 min-h-0"
      >
        {conversation.messages.map((msg) => (
          <div 
            key={msg.id} 
            className={clsx(
              "flex gap-3 md:gap-4 max-w-5xl mx-auto w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === 'assistant' && (
              <div className="hidden md:flex h-10 w-10 bg-indigo-600 items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
            )}
            
            <div className={clsx(
              "flex flex-col gap-2 min-w-0 flex-1 md:flex-initial",
              msg.role === 'user' ? "items-end max-w-[90%] md:max-w-[85%]" : "items-start w-full"
            )}>
              {/* Tool Logs Display */}
              {msg.toolLogs && msg.toolLogs.length > 0 && (
                <div className="flex flex-col gap-2 w-full mb-2">
                  {msg.toolLogs.map((log, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2 bg-slate-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-900 w-fit">
                      {log.status === 'running' ? (
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                      ) : log.status === 'success' ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      
                      <span className="font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        {log.toolName === 'npm_package_lookup' && <Package className="h-4 w-4" />}
                        {log.toolName === 'github_repository_lookup' && <GitBranch className="h-4 w-4" />}
                        {log.toolName.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Content */}
              <div className={clsx(
                "px-4 py-3 md:px-6 md:py-4 relative group border-2 border-black w-full overflow-hidden",
                msg.role === 'user' 
                  ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]" 
                  : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] prose prose-slate max-w-none prose-p:text-black prose-headings:text-black prose-strong:text-black prose-li:text-black prose-a:text-indigo-600 prose-pre:bg-slate-900 prose-pre:border-2 prose-pre:border-black prose-pre:rounded-none prose-p:font-medium prose-p:text-sm"
              )}>
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                ) : (
                  <>
                    {msg.content ? (
                      <div className="text-sm">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]} 
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            pre: ({ node, ...props }) => (
                              <div className="relative group/code mt-4 mb-4">
                                <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                  {/* We'd need to extract text content, but simple CSS handles this usually.
                                      For proper copy we might need a custom component, but this is a start */}
                                </div>
                                <pre {...props} className="p-4 overflow-x-auto text-sm bg-slate-900 text-slate-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scrollbar-none" />
                              </div>
                            ),
                            code: ({ node, inline, ...props }: any) => 
                              inline 
                                ? <code {...props} className="bg-slate-100 px-1 py-0.5 border border-slate-200 text-indigo-700 font-mono text-[0.85em] font-bold" /> 
                                : <code {...props} className="font-mono text-sm" />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.status === 'streaming' && (!msg.toolLogs || msg.toolLogs.every(l => l.status === 'success')) && (
                        <div className="flex items-center gap-1 h-5">
                          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )
                    )}

                    {msg.status === 'error' && (
                      <div className="flex flex-col gap-1 mt-3 bg-red-50 border-2 border-red-200 p-3">
                        <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-widest">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>Devora AI couldn&apos;t complete the response.</span>
                        </div>
                        {msg.errorMessage && (
                          <div className="text-red-500 text-xs mt-1 font-mono break-all whitespace-pre-wrap">
                            {msg.errorMessage}
                          </div>
                        )}
                      </div>
                    )}
                    {msg.status === 'stopped' && (
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-3">
                        Generation stopped by user.
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Message Actions */}
              {msg.role === 'assistant' && msg.content && msg.status === 'completed' && (
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => handleCopy(msg.content, msg.id)}
                    title="Salin respon"
                    className="p-1.5 px-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 hover:shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] transition-all flex items-center gap-2"
                  >
                    {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-900" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Salin</span>
                  </button>
                </div>
              )}
              {msg.role === 'user' && msg.content && (
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button 
                    onClick={() => { setInput(msg.content); textareaRef.current?.focus(); }}
                    title="Edit pesan"
                    className="p-1.5 px-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 hover:shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] transition-all flex items-center gap-2"
                  >
                    <Pencil className="h-3.5 w-3.5 text-slate-900" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Edit</span>
                  </button>
                  <button 
                    onClick={() => handleCopy(msg.content, msg.id)}
                    title="Salin pesan"
                    className="p-1.5 px-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 hover:shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] transition-all flex items-center gap-2"
                  >
                    {copiedId === msg.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-900" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Salin</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 md:p-6 bg-white border-t-2 border-black shrink-0">
        <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto relative">
          <div className={clsx(
            "relative flex items-center w-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all p-1",
            isStreaming ? "border-slate-400" : "focus-within:border-indigo-600 focus-within:shadow-[8px_8px_0px_0px_rgba(79,70,229,1)]"
          )}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="ASK DEVORA AI..."
              className="w-full max-h-32 min-h-[48px] py-3 pl-3 pr-14 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px] resize-none outline-none overflow-y-auto disabled:opacity-50 scrollbar-none [appearance:none] [&::-webkit-resizer]:hidden"
              rows={1}
              disabled={isStreaming}
            />
            {isStreaming ? (
              <button 
                type="button"
                onClick={handleStop}
                className="absolute right-1 bottom-1 h-[40px] w-[40px] p-2 bg-red-500 hover:bg-red-600 text-white transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                title="Stop generation"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button 
                type="submit"
                disabled={!input.trim()}
                className="absolute right-1 bottom-1 h-[40px] w-[40px] p-2 bg-black hover:bg-indigo-600 text-white disabled:opacity-50 disabled:pointer-events-none transition-colors border-2 border-transparent flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mt-3 md:mt-4">
            Press Enter to send, Shift + Enter for new line. Devora AI can make mistakes.
          </div>
        </form>
      </div>
    </div>
  );
}
