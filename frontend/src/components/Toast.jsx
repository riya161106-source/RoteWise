import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
    error: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
    info: 'bg-navy-900/95 border-navy-600 text-slate-200'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all animate-bounce-in ${styles[type] || styles.info}`}>
      {icons[type] || icons.info}
      <div className="flex-1 text-xs leading-relaxed font-medium">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
