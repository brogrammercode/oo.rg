import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right';
    width?: string;
}

import { createPortal } from 'react-dom';

export function Dropdown({ trigger, children, align = 'left', width = 'w-48' }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        function handleScroll() {
            if (isOpen) setIsOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen]);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            let top = rect.bottom + window.scrollY + 4;
            let left = rect.left + window.scrollX;

            if (align === 'right') {
                left = rect.right + window.scrollX - 192;
            }

            if (left < 4) left = 4;
            if (left + 192 > window.innerWidth) left = window.innerWidth - 196;

            setPosition({ top, left });
        }
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div ref={triggerRef} onClick={toggle} className="cursor-pointer inline-block">
                {trigger}
            </div>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    style={{ top: position.top, left: position.left }}
                    className={`fixed z-50 ${width} rounded-md shadow-lg bg-white dark:bg-[#191919] ring-1 ring-gray-200 dark:ring-zinc-800 ring-opacity-50 focus:outline-none border border-[#E5E7EB] dark:border-[#2F2F2F] py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right`}
                >
                    {children}
                </div>,
                document.body
            )}
        </>
    );
}

interface DropdownItemProps {
    icon?: React.ElementType;
    label: string;
    onClick?: () => void;
    danger?: boolean;
    disabled?: boolean;
    shortcut?: string;
}

export function DropdownItem({ icon: Icon, label, onClick, danger, disabled, shortcut }: DropdownItemProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full text-left flex items-center px-3 py-1.5 text-sm transition-colors
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${danger
                    ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10'
                    : 'text-[#37352F] dark:text-[#D4D4D4] hover:bg-[#F7F7F5] dark:hover:bg-[#2F2F2F]'
                }
            `}
        >
            {Icon && <Icon size={16} className={`mr-2.5 ${danger ? 'text-red-500' : 'text-neutral-400'}`} />}
            <span className="flex-1">{label}</span>
            {shortcut && <span className="text-xs text-neutral-400">{shortcut}</span>}
        </button>
    );
}

export function DropdownDivider() {
    return <div className="h-px bg-[#E5E7EB] dark:bg-[#2F2F2F] my-1" />;
}

interface DropdownLabelProps {
    children: React.ReactNode;
}

export function DropdownLabel({ children }: DropdownLabelProps) {
    return <div className="px-3 py-1 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{children}</div>;
}
