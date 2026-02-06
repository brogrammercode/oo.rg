import React from 'react';

interface AvatarProps {
    initials?: string;
    name?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    bgColor?: string;
    textColor?: string;
    src?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    initials,
    name,
    className = '',
    size = 'md',
    bgColor = 'bg-purple-100',
    textColor = 'text-purple-600',
    src
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    if (src) {
        return (
            <img
                src={src}
                alt={name || initials || 'Avatar'}
                className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            />
        );
    }

    const content = initials || (name ? name.charAt(0).toUpperCase() : '');

    return (
        <div className={`${sizeClasses[size]} ${bgColor} ${textColor} rounded-full flex items-center justify-center font-semibold ${className}`}>
            {content}
        </div>
    );
};

export default Avatar;