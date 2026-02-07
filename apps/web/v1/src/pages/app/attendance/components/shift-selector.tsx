import type { ShiftType } from '../../../../types/attendance';

interface ShiftSelectorProps {
    value: string;
    onChange: (value: string) => void;
    shiftTypes: ShiftType[];
    disabled?: boolean;
    label?: string;
    placeholder?: string;
}

export function ShiftSelector({ value, onChange, shiftTypes, disabled, label, placeholder }: ShiftSelectorProps) {
    const formatTimeRange = (shift: ShiftType) => {
        if (!shift.start || !shift.end) return '';
        const start = new Date(shift.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const end = new Date(shift.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        return `${start} - ${end}`;
    };

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {label}
                </label>
            )}
            <select
                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            >
                <option value="">{placeholder || 'Select shift type'}</option>
                {shiftTypes.map((shift) => (
                    <option key={shift._id} value={shift._id}>
                        {shift.name} {formatTimeRange(shift) && `(${formatTimeRange(shift)})`}
                    </option>
                ))}
            </select>
        </div>
    );
}
