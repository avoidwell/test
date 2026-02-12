import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  color: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, color, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Content */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 ${color} text-white flex justify-between items-center shrink-0`}>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;