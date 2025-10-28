
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    return (
        <div className={`${sizeClasses[size]} border-4 border-t-primary border-gray-200 dark:border-gray-600 rounded-full animate-spin`}></div>
    );
};

export default Spinner;
