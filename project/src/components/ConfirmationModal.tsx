import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar' }: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 border border-transparent rounded-full text-white font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
