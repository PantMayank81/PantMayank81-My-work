import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

// Use React.forwardRef to allow passing a ref to the input element
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, icon, ...props }, ref) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="relative">
         {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          ref={ref} // Attach the forwarded ref here
          className={`block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
});

Input.displayName = 'Input'; // Add display name for better debugging

export default Input;