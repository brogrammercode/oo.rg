import React from 'react';

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex-1 justify-center min-w-[100px] cursor-pointer ${className}`}
    >
        {icon}
        <span className="text-sm">{label}</span>
    </button>
);

export default SocialButton;
