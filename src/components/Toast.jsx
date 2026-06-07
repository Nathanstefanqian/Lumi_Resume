import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ 
  show, 
  message, 
  type = 'success', // 'success', 'error', 'info'
  onClose,
  duration = 3000 
}) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'error': return <AlertCircle className="text-red-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white/90 backdrop-blur-xl border border-zinc-100 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[200px]">
        <div className={`p-1.5 rounded-lg ${type === 'success' ? 'bg-emerald-50' : type === 'error' ? 'bg-red-50' : 'bg-blue-50'}`}>
          {getIcon()}
        </div>
        
        <p className="text-zinc-800 text-sm font-bold flex-1 whitespace-nowrap">
          {message}
        </p>

        <button 
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
