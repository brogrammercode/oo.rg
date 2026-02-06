import { useState, useRef, useEffect } from 'react';
import { Settings2, Info, Shield } from 'lucide-react';

interface MenuItemDropdownProps {
    onDetailsClick?: () => void;
    onPermissionsClick?: () => void;
}

export function MenuItemDropdown({ onDetailsClick, onPermissionsClick }: MenuItemDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (callback: (() => void) | undefined, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
        callback?.();
    };

    return (
        <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
            <button
                onClick={handleToggle}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                type="button"
            >
                <Settings2 size={12} className="text-neutral-500" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg shadow-lg z-50 py-1">
                    {onDetailsClick && (
                        <button
                            onClick={(e) => handleOptionClick(onDetailsClick, e)}
                            className="w-full px-3 py-2 text-left text-sm text-[#1a1a1a] dark:text-white hover:bg-gray-50 dark:hover:bg-[#252525] flex items-center gap-2 transition-colors"
                            type="button"
                        >
                            <Info size={14} />
                            Details
                        </button>
                    )}
                    {onPermissionsClick && (
                        <button
                            onClick={(e) => handleOptionClick(onPermissionsClick, e)}
                            className="w-full px-3 py-2 text-left text-sm text-[#1a1a1a] dark:text-white hover:bg-gray-50 dark:hover:bg-[#252525] flex items-center gap-2 transition-colors"
                            type="button"
                        >
                            <Shield size={14} />
                            Permissions
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
