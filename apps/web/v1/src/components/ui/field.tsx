import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    rightElement?: React.ReactNode;
    containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, rightElement, className = '', containerClassName = '', ...props }) => {
    return (
        <div className={`relative group ${containerClassName}`}>
            {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
            <input
                className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all ${className}`}
                {...props}
            />
            {rightElement && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {rightElement}
                </div>
            )}
        </div>
    );
};

export default Input;
