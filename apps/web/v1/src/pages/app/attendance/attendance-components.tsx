import { Loader2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/modal';
import { AttendanceStatus } from '../../../constants/attendance';
import type { Attendance } from '../../../types/attendance';

interface AttendanceFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        date: string;
        status: string;
        checkIn: string;
        checkOut: string;
    }) => Promise<void>;
    title: string;
    submitLabel: string;
    initialData?: {
        date: string;
        status: string;
        checkIn: string;
        checkOut: string;
    };
}

export function AttendanceFormModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    submitLabel,
    initialData
}: AttendanceFormProps) {
    const [formData, setFormData] = useState({
        date: initialData?.date || new Date().toISOString().split('T')[0],
        status: initialData?.status || AttendanceStatus.PRESENT,
        checkIn: initialData?.checkIn || '',
        checkOut: initialData?.checkOut || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return formData.date && formData.status;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Date</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                        value={formData.date}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                    <select
                        className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                        <option value="HOLIDAY">Holiday</option>
                        <option value="LEAVE">Leave</option>
                        <option value="OVERTIME">Overtime</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Check In</label>
                    <input
                        type="datetime-local"
                        className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Check Out</label>
                    <input
                        type="datetime-local"
                        className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading || !isFormValid()} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {submitLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

interface ClockButtonProps {
    todayAttendance: Attendance | null;
    onClockIn: () => Promise<void>;
    onClockOut: () => Promise<void>;
}

export function ClockButton({ todayAttendance, onClockIn, onClockOut }: ClockButtonProps) {
    const [loading, setLoading] = useState(false);
    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    useEffect(() => {
        if (!todayAttendance?.checkIn || todayAttendance?.checkOut) return;

        const interval = setInterval(() => {
            const checkIn = new Date(todayAttendance.checkIn!);
            const now = new Date();
            const diff = now.getTime() - checkIn.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setElapsedTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [todayAttendance]);

    const handleClick = async () => {
        setLoading(true);
        try {
            if (!todayAttendance?.checkIn) {
                await onClockIn();
            } else if (!todayAttendance?.checkOut) {
                await onClockOut();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isClockedIn = todayAttendance?.checkIn && (!todayAttendance?.checkOut || todayAttendance?.checkOut == todayAttendance?.checkIn);

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-70 ${isClockedIn
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Clock size={16} />
            )}
            {isClockedIn ? (
                <div className="flex items-center gap-2">
                    <span>Clock Out</span>
                    <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded">{elapsedTime}</span>
                </div>
            ) : (
                <span>Clock In</span>
            )}
        </button>
    );
}

interface StatusBadgeProps {
    status: string;
}

export function AttendanceStatusBadge({ status }: StatusBadgeProps) {
    let styles = "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400";
    if (status === 'PRESENT') {
        styles = "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    } else if (status === 'ABSENT') {
        styles = "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    } else if (status === 'LATE') {
        styles = "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    } else if (status === 'HOLIDAY') {
        styles = "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    } else if (status === 'LEAVE') {
        styles = "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    } else if (status === 'OVERTIME') {
        styles = "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
    }
    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border border-transparent ${styles}`}>
            {status}
        </span>
    );
}

export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}
