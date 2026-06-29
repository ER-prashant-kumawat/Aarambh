import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Floating Container */}
      <div className="fixed bottom-5 right-5 z-55 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-slide-in pointer-events-auto ${
              t.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/30 text-emerald-400'
                : t.type === 'error'
                ? 'bg-slate-900/95 border-red-500/30 text-red-400'
                : 'bg-slate-900/95 border-blue-500/30 text-blue-400'
            }`}
            style={{ backdropFilter: 'blur(16px)' }}
          >
            {t.type === 'success' && <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info size={18} className="flex-shrink-0 mt-0.5" />}
            
            <div className="flex-grow text-xs font-semibold text-slate-200 leading-normal">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
