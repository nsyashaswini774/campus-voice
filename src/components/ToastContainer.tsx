import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-[#83C9F4] shrink-0" />;
        let borderClass = 'border-[#E8E8F2]';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-[#176B47] shrink-0" />;
          borderClass = 'border-[#A8E6CF]';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-[#C93B2F] shrink-0" />;
          borderClass = 'border-[#FF8177]/40';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-[#B88700] shrink-0" />;
          borderClass = 'border-[#FFD66B]/60';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border ${borderClass} bg-white text-[#202544] shadow-lg backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-3`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold text-[#202544]">{toast.title}</h5>
              {toast.description && (
                <p className="text-xs text-[#5D6385] mt-0.5 leading-relaxed font-medium">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="btn-pill text-[#8A90B2] hover:text-[#202544] p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
