import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={20} color="#10b981" />;
      case 'error':
        return <AlertCircle size={20} color="#ef4444" />;
      default:
        return <Info size={20} color="#4f46e5" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type || 'info'}`}>
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
        <button onClick={onClose} style={{ color: '#94a3b8' }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
