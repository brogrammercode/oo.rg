import { Coffee, Clock } from 'lucide-react';

interface BreakProgressProps {
    breakType: string;
    duration: number;
    onEnd: () => void;
}

export function BreakProgress({ breakType, duration, onEnd }: BreakProgressProps) {
    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="w-full bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-900/30 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <Coffee size={20} className="text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">Break in Progress</span>
                        <span className="text-xs text-orange-700 dark:text-orange-300">{breakType}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-lg">
                        <Clock size={14} className="text-orange-600 dark:text-orange-400" />
                        <span className="font-mono text-lg font-bold text-orange-900 dark:text-orange-100">
                            {formatDuration(duration)}
                        </span>
                    </div>
                    <button
                        onClick={onEnd}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap"
                    >
                        End Break
                    </button>
                </div>
            </div>
        </div>
    );
}
