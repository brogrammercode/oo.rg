import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
