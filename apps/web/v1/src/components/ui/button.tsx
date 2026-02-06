import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    className?: string;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    variant = 'primary',
    className = '',
    children,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
        primary: "bg-[#FFD482] hover:bg-[#ffc966] text-slate-900 shadow-sm focus:ring-[#FFD482]",
        secondary: "bg-black text-white hover:bg-slate-800 focus:ring-slate-800",
        ghost: "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-black/5",
        outline: "bg-transparent border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
