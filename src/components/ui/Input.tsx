import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        id={id}
        className="w-full px-4 py-3 border border-slate-200 rounded-lg
          focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition-colors duration-200
          shadow-sm
          placeholder:text-slate-400"
      />
    </div>
  );
};