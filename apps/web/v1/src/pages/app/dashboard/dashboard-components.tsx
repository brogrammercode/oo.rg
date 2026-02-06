import React from 'react';

interface StatCardProps {
    icon: React.ElementType;
    value: string | number;
    label: string;
    colorClass: string;
}

export function StatCard({ icon: Icon, value, label, colorClass }: StatCardProps) {
    return (
        <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-6 bg-white dark:bg-[#191919] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm text-neutral-500">{label}</p>
                    <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{value}</p>
                </div>
            </div>
        </div>
    );
}

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
}

export function InfoCard({ title, children, headerAction }: InfoCardProps) {
    return (
        <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg bg-white dark:bg-[#191919] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E5E7EB] dark:border-[#2F2F2F] flex justify-between items-center">
                <h3 className="font-medium text-[#1a1a1a] dark:text-white">{title}</h3>
                {headerAction}
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

interface ActionButtonProps {
    icon?: React.ElementType;
    onClick?: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    className?: string;
}

export function ActionButton({
    icon: Icon,
    onClick,
    children,
    variant = 'primary',
    disabled = false,
    className = ''
}: ActionButtonProps) {
    const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors";
    const variantClasses = variant === 'primary'
        ? "bg-[#1a1a1a] hover:bg-black text-white disabled:opacity-50"
        : "bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] hover:bg-gray-50 dark:hover:bg-[#252525] text-[#1a1a1a] dark:text-white";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses} ${className}`}
        >
            {Icon && <Icon size={16} />}
            {children}
        </button>
    );
}

interface InfoItemProps {
    label: string;
    value: string | number;
    colorClass?: string;
}

export function InfoItem({ label, value, colorClass }: InfoItemProps) {
    return (
        <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-sm font-medium ${colorClass || 'text-[#1a1a1a] dark:text-white'}`}>{value}</p>
        </div>
    );
}
