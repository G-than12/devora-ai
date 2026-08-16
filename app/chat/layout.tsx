'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';
import { Button } from '@/components/ui/button';
import { BrainCircuit, MessageSquare, Plus, Settings, LogOut, PanelLeftClose, PanelLeftOpen, Trash2, Pencil, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { SettingsModal } from '@/components/settings-modal';
import { Conversation } from '@/lib/types';

function ConversationItem({ 
  conv, 
  isActive, 
  onDelete, 
  onRename,
  onClick
}: { 
  conv: Conversation; 
  isActive: boolean; 
  onDelete: (id: string) => void; 
  onRename: (id: string, title: string) => void; 
  onClick?: () => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(conv.title);

  const handleRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(conv.title);
  };

  const handleSave = (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editTitle.trim()) {
      onRename(conv.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(conv.id);
  };

  if (isEditing) {
    return (
      <div className={clsx(
        "flex items-center gap-2 px-2 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-2",
        isActive ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]" : "text-slate-600 border-black bg-white"
      )}>
        <form onSubmit={handleSave} className="flex-1 flex items-center gap-2 overflow-hidden">
          <input 
            type="text" 
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 bg-transparent border-b-2 border-current outline-none min-w-0 px-1"
            autoFocus
          />
          <button type="submit" className="shrink-0 hover:text-indigo-500"><Check className="h-4 w-4" /></button>
          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); }} className="shrink-0 hover:text-red-500"><X className="h-4 w-4" /></button>
        </form>
      </div>
    );
  }

  return (
    <Link
      href={`/chat/${conv.id}`}
      onClick={onClick}
      className={clsx(
        "group flex items-center justify-between gap-3 px-3 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-2",
        isActive ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]" : "text-slate-600 border-transparent hover:border-black hover:bg-white"
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <MessageSquare className="h-4 w-4 shrink-0" />
        <span className="truncate">{conv.title}</span>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button 
          onClick={handleRename}
          className="hover:text-indigo-400 transition-colors"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button 
          onClick={handleDelete}
          className="hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </Link>
  );
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { conversations, createConversation, setActiveConversation, deleteConversation, renameConversation } = useChatStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const handleNewChat = () => {
    const newId = createConversation();
    router.push(`/chat/${newId}`);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    if (pathname === `/chat/${id}`) {
      router.push('/chat');
    }
  };

  const handleRenameConversation = (id: string, title: string) => {
    renameConversation(id, title);
  };

  const handleConversationClick = () => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const sortedConversations = Object.values(conversations).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden border-4 md:border-[12px] border-black p-0 m-0 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden absolute inset-0 bg-black/20 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
          "bg-slate-50 border-r-2 border-black flex flex-col transition-all duration-300 ease-in-out absolute md:relative z-50 h-full",
          isSidebarOpen 
            ? "w-72 translate-x-0" 
            : "w-72 -translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden md:border-r-0"
        )}
      >
        <div className="h-14 md:h-20 flex items-center gap-2 border-b-2 border-black shrink-0 px-4 md:px-6 bg-white">
          <div className="h-6 w-6 bg-indigo-600"></div>
          <span className="font-black uppercase tracking-tighter text-xl truncate">Devora.</span>
        </div>
        
        <div className="p-6 shrink-0 border-b-2 border-black">
          <Button onClick={handleNewChat} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-2">
          {sortedConversations.length === 0 ? (
            <div className="text-[10px] uppercase font-bold text-slate-400 text-center mt-4 tracking-widest">No conversations yet</div>
          ) : (
             sortedConversations.map((conv) => {
               const isActive = pathname === `/chat/${conv.id}`;
               return (
                 <ConversationItem 
                   key={conv.id} 
                   conv={conv} 
                   isActive={isActive} 
                   onDelete={handleDeleteConversation}
                   onRename={handleRenameConversation}
                   onClick={handleConversationClick}
                 />
               )
             })
          )}
        </div>

        <div className="p-4 border-t-2 border-black shrink-0 space-y-2 bg-white">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-[10px]"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-[10px]">
              <LogOut className="h-4 w-4 mr-2" />
              Exit to Home
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100 relative">
        <header className="h-14 md:h-20 border-b-2 border-black flex items-center px-4 md:px-6 shrink-0 bg-white z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4 hover:bg-slate-100"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
          <div className="font-medium text-sm truncate">
             {/* We can show active chat title here or leave it empty */}
          </div>
        </header>
        
        <div className="flex-1 min-h-0 relative flex flex-col">
          {children}
        </div>
      </main>

      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
