import { X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: 'small' | 'medium' | 'large';
}

export function Modal({ isOpen, onClose, children, title, size = 'medium' }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
        small: 'max-w-sm',
        medium: 'max-w-md',
        large: 'max-w-5xl'
    };

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose();
        }

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className={`bg-white dark:bg-[#191919] w-full ${sizeClasses[size]} rounded-xl shadow-2xl border border-neutral-100 dark:border-zinc-800 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#2F2F2F]">
                    <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-white leading-none">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
            {/* Overlay click handler needs to be on the container, but since the container centers the modal, 
                we can add a separate overlay div or just handle clicks on the parent. 
                Handling separate overlay is cleaner. */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>,
        document.body
    );
}
