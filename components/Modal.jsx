import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg ${className}`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export const ModalHeader = ({ children, onClose }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {children}
      </h3>
      <button
        onClick={onClose}
        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <span className="sr-only">Cerrar</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export const ModalBody = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ children, className = '' }) => {
  return (
    <div
      className={`flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-6 py-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default Modal; 