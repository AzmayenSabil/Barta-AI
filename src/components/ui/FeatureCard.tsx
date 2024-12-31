import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'light' | 'dark';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  variant = 'dark' 
}) => {
  const baseStyles = "p-6 rounded-xl transition-all duration-300 hover:scale-105";
  const variantStyles = variant === 'light' 
    ? "bg-white/10 backdrop-blur-sm" 
    : "bg-white shadow-lg hover:shadow-xl";
  const textStyles = variant === 'light'
    ? "text-white text-white/80"
    : "text-slate-900 text-slate-600";

  return (
    <div className={`${baseStyles} ${variantStyles}`}>
      <div className="mb-4">{icon}</div>
      <h3 className={`text-lg font-semibold mb-2 ${variant === 'light' ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h3>
      <p className={variant === 'light' ? 'text-white/80' : 'text-slate-600'}>
        {description}
      </p>
    </div>
  );
};