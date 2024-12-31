import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, fullWidth, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`
        ${fullWidth ? 'w-full' : ''}
        bg-gradient-to-r from-indigo-600 to-violet-600
        text-white py-3 px-6 rounded-lg
        hover:from-indigo-700 hover:to-violet-700
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 transform hover:scale-[1.02]
        font-medium shadow-lg hover:shadow-xl
        ${className}
      `}
    >
      {children}
    </button>
  );
};