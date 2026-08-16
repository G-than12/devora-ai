'use client';

import { v4 as uuidv4 } from 'uuid';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Search, Zap, Blocks, Send, Terminal } from 'lucide-react';
import clsx from 'clsx';

export default function NewChatPage() {
  const [input, setInput] = React.useState('');
  const router = useRouter();
  const { createConversation, addMessage } = useChatStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // Create new conversation
    const newId = createConversation();
    
    // Add the user message immediately (it will route and trigger the API on the new page)
    // Actually, it's easier to just pass it via URL state or let the [id] page handle it,
    // but the best way is to save it in store and then route.
    addMessage(newId, {
      id: uuidv4(),
      role: 'user',
      content: input,
      status: 'completed',
      createdAt: Date.now()
    });

    // We can use a session storage flag or query param to tell the next page to auto-trigger the API
    sessionStorage.setItem(`trigger-api-${newId}`, 'true');

    router.push(`/chat/${newId}`);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-100 overflow-y-auto p-6 md:p-12">
      <div className="w-full max-w-3xl my-auto flex flex-col items-center shrink-0">
        <div className="bg-white border-2 border-black p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)] flex items-center justify-center">
          <div className="w-8 h-8 bg-indigo-600"></div>
        </div>
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter text-slate-900 text-center">How can I help you build today?</h1>
        <p className="text-slate-600 mb-10 text-center max-w-md font-medium">
          Ask me about coding, paste your error logs, or explore NPM packages and GitHub repositories.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
          <button 
            onClick={() => handleSuggestion('Explain how React hooks work under the hood')}
            className="text-left p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-indigo-50 hover:shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] transition-all group flex items-start gap-4"
          >
            <Blocks className="h-6 w-6 text-slate-900 mt-1 shrink-0 group-hover:text-indigo-600 transition-colors" />
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">Explain Concepts</div>
              <div className="text-sm text-slate-600 font-medium">Explain how React hooks work...</div>
            </div>
          </button>
          <button 
            onClick={() => handleSuggestion('Debug this code: TypeError: Cannot read properties of undefined')}
            className="text-left p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-indigo-50 hover:shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] transition-all group flex items-start gap-4"
          >
            <Zap className="h-6 w-6 text-slate-900 mt-1 shrink-0 group-hover:text-indigo-600 transition-colors" />
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">Smart Debugging</div>
              <div className="text-sm text-slate-600 font-medium">Debug this code: TypeError...</div>
            </div>
          </button>
          <button 
            onClick={() => handleSuggestion('Check NPM package: zustand')}
            className="text-left p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-indigo-50 hover:shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] transition-all group flex items-start gap-4"
          >
            <Search className="h-6 w-6 text-slate-900 mt-1 shrink-0 group-hover:text-indigo-600 transition-colors" />
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">NPM Lookup</div>
              <div className="text-sm text-slate-600 font-medium">Check NPM package: zustand</div>
            </div>
          </button>
          <button 
            onClick={() => handleSuggestion('Analyze GitHub repo: facebook/react')}
            className="text-left p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-indigo-50 hover:shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] transition-all group flex items-start gap-4"
          >
            <Terminal className="h-6 w-6 text-slate-900 mt-1 shrink-0 group-hover:text-indigo-600 transition-colors" />
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">GitHub Analysis</div>
              <div className="text-sm text-slate-600 font-medium">Analyze GitHub repo: facebook/react</div>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
          <div className="relative flex items-center w-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] focus-within:border-indigo-600 transition-all p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="ASK DEVORA AI ANYTHING ABOUT DEVELOPMENT..."
              className="w-full max-h-32 min-h-[56px] py-4 pl-4 pr-16 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px] resize-none outline-none overflow-y-auto"
              rows={1}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isSubmitting}
              className="absolute right-4 bottom-4 p-3 bg-black hover:bg-indigo-600 text-white disabled:opacity-50 disabled:pointer-events-none transition-colors border-2 border-transparent"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mt-6">
            Press Enter to send, Shift + Enter for new line. Devora AI can make mistakes.
          </div>
        </form>
      </div>
    </div>
  );
}
