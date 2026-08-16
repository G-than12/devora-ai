'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { Button } from '@/components/ui/button';
import { AiMode, ProgrammingLevel, ResponseStyle, Creativity, ResponseLength } from '@/lib/types';
import clsx from 'clsx';

export function SettingsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { preferences, updatePreferences } = useChatStore();

  const [localPrefs, setLocalPrefs] = React.useState(preferences);

  // Reset local state when modal opens
  React.useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalPrefs(preferences);
    }
  }, [open, preferences]);

  const handleSave = () => {
    updatePreferences(localPrefs);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-none">
          
          <div className="flex flex-col space-y-2 text-center sm:text-left mb-4">
            <DialogPrimitive.Title className="text-3xl font-black uppercase tracking-tighter text-slate-900">
              Configuration
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Customize how Devora AI responds to your prompts.
            </DialogPrimitive.Description>
          </div>

          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 block">AI Mode</label>
              <select 
                value={localPrefs.aiMode}
                onChange={(e) => setLocalPrefs({ ...localPrefs, aiMode: e.target.value as AiMode })}
                className="flex h-12 w-full items-center justify-between rounded-none border-2 border-black bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] transition-all"
              >
                <option value="explain">Explain (Educational)</option>
                <option value="debug">Debug (Fix Code)</option>
                <option value="build">Build (Implementation)</option>
                <option value="brainstorm">Brainstorm (Ideas)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 block">Programming Level</label>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as ProgrammingLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setLocalPrefs({ ...localPrefs, programmingLevel: level })}
                    className={clsx(
                      "flex-1 rounded-none px-3 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-2",
                      localPrefs.programmingLevel === level 
                        ? "bg-black border-black text-white shadow-[2px_2px_0px_0px_rgba(79,70,229,1)]" 
                        : "bg-white border-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 block">Response Style</label>
                <select 
                  value={localPrefs.responseStyle}
                  onChange={(e) => setLocalPrefs({ ...localPrefs, responseStyle: e.target.value as ResponseStyle })}
                  className="flex h-12 w-full items-center justify-between rounded-none border-2 border-black bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] transition-all"
                >
                  <option value="concise">Concise</option>
                  <option value="balanced">Balanced</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 block">Creativity</label>
                <select 
                  value={localPrefs.creativity}
                  onChange={(e) => setLocalPrefs({ ...localPrefs, creativity: e.target.value as Creativity })}
                  className="flex h-12 w-full items-center justify-between rounded-none border-2 border-black bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(79,70,229,1)] transition-all"
                >
                  <option value="precise">Precise</option>
                  <option value="balanced">Balanced</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Temperature</label>
                <span className="text-[10px] font-bold text-slate-500">{localPrefs.temperature}</span>
              </div>
              <input 
                type="range" 
                min="0" max="1" step="0.1"
                value={localPrefs.temperature}
                onChange={(e) => setLocalPrefs({ ...localPrefs, temperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
             <DialogPrimitive.Close asChild>
               <Button variant="ghost" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-100">Cancel</Button>
             </DialogPrimitive.Close>
             <Button onClick={handleSave} className="bg-black hover:bg-indigo-600 text-white border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]">Save Changes</Button>
          </div>

          <DialogPrimitive.Close className="absolute right-6 top-6 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
            <X className="h-5 w-5 text-slate-900 hover:text-indigo-600" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
