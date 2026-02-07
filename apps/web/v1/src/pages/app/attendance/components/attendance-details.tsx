import type { Attendance } from '../../../../types/attendance';
import { Clock } from 'lucide-react';

interface AttendanceDetailsProps {
    attendance: Attendance;
    compact?: boolean;
}

export function AttendanceDetails({ attendance, compact = false }: AttendanceDetailsProps) {
    const formatTime = (date?: Date) => {
        if (!date) return '-';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0h 0m';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    if (compact) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-neutral-500" />
                <span className="text-neutral-600 dark:text-neutral-400">
                    {formatTime(attendance.checkIn)} - {formatTime(attendance.checkOut)}
                </span>
                <span className="text-neutral-500 dark:text-neutral-500">·</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                    {formatDuration(attendance.duration)}
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Check In</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {formatTime(attendance.checkIn)}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Check Out</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {formatTime(attendance.checkOut)}
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Duration</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatDuration(attendance.duration)}
                </span>
            </div>
            {attendance.shiftType && (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Shift</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {attendance.shiftType.name}
                    </span>
                </div>
            )}
        </div>
    );
}
