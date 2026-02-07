import type { Break } from '../../../../types/attendance';
import { Coffee } from 'lucide-react';

interface BreaksSummaryProps {
    breaks: Break[];
    compact?: boolean;
}

export function BreaksSummary({ breaks, compact = false }: BreaksSummaryProps) {
    const formatTime = (date?: Date) => {
        if (!date) return '-';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0m';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const totalDuration = breaks.reduce((sum, brk) => sum + (brk.duration || 0), 0);

    if (compact) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <Coffee size={14} className="text-orange-600 dark:text-orange-400" />
                <span className="text-neutral-600 dark:text-neutral-400">
                    {breaks.length} break{breaks.length !== 1 ? 's' : ''}
                </span>
                {totalDuration > 0 && (
                    <>
                        <span className="text-neutral-500">·</span>
                        <span className="font-medium text-neutral-900 dark:text-white">
                            {formatDuration(totalDuration)}
                        </span>
                    </>
                )}
            </div>
        );
    }

    if (breaks.length === 0) {
        return (
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                No breaks taken
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {breaks.length} Break{breaks.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs font-medium text-neutral-900 dark:text-white">
                    Total: {formatDuration(totalDuration)}
                </span>
            </div>
            <div className="space-y-2">
                {breaks.map((brk, index) => (
                    <div key={brk._id || index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                {brk.type?.name || 'Break'}
                            </span>
                            <span className="text-xs text-neutral-500">
                                {formatTime(brk.start)} - {formatTime(brk.end)}
                            </span>
                        </div>
                        {brk.duration && brk.duration > 0 && (
                            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                {formatDuration(brk.duration)}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
