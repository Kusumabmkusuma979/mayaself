import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';

export default function ClearChatDialog({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm rounded-2xl glass-panel p-6 border border-purple-500/30 shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Clear Conversation</h3>
            <p className="text-xs text-slate-400">Reset your chat history with Maya</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Are you sure you want to clear this conversation? Your saved messages will be removed and Maya will return to her welcoming greeting.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30"
          >
            Yes, Clear History
          </button>
        </div>
      </div>
    </div>
  );
}
