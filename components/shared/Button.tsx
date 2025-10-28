
import React from 'react';
import { addRippleEffect } from '../../utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, ...props }) => {
  const baseClasses = 'btn-ripple font-semibold rounded-full px-6 py-3 text-sm flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-4';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary/50 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary/50 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary/30',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={(e) => {
        addRippleEffect(e);
        if(props.onClick) props.onClick(e);
      }}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
