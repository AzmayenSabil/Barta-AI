import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children, className }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => (
  <div className={`mb-4 border-b pb-2 ${className || ''}`}>{children}</div>
);

export const DialogTitle: React.FC<DialogHeaderProps> = ({ children, className }) => (
  <h2 className={`text-lg font-semibold ${className || ''}`}>{children}</h2>
);

export const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => (
  <div className={`space-y-4 ${className || ''}`}>{children}</div>
);

export default Dialog;