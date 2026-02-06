import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost';
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'default' }) => {
    const variants = {
        default: 'bg-slate-100 text-slate-600',
        outline: 'border border-slate-200 text-slate-600',
        ghost: 'bg-transparent text-slate-400'
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
