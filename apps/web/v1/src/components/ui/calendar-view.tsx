import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Modal } from './modal';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    data?: any;
}

interface CalendarViewProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any[];
    dateField: string;
    renderDay: (day: CalendarDay) => React.ReactNode;
}

export function CalendarView({
    isOpen,
    onClose,
    title,
    data,
    dateField,
    renderDay
}: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date): CalendarDay[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: CalendarDay[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
            days.push({
                date: prevMonthDay,
                isCurrentMonth: false
            });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(year, month, day);
            const dayData = data.find(item => {
                const itemDate = new Date(item[dateField]);
                return itemDate.getFullYear() === year &&
                    itemDate.getMonth() === month &&
                    itemDate.getDate() === day;
            });

            days.push({
                date: currentDay,
                isCurrentMonth: true,
                data: dayData
            });
        }

        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const nextMonthDay = new Date(year, month + 1, i);
            days.push({
                date: nextMonthDay,
                isCurrentMonth: false
            });
        }

        return days;
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const days = getDaysInMonth(currentDate);
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="large">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-white">{monthYear}</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToToday}
                            className="px-3 py-1.5 text-sm font-medium text-[#1a1a1a] dark:text-white bg-gray-100 dark:bg-[#202020] hover:bg-gray-200 dark:hover:bg-[#252525] rounded-lg transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={goToPreviousMonth}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#202020] rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} className="text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <button
                            onClick={goToNextMonth}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#202020] rounded-lg transition-colors"
                        >
                            <ChevronRight size={20} className="text-neutral-600 dark:text-neutral-400" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`min-h-[80px] p-2 border rounded-lg ${day.isCurrentMonth
                                    ? 'bg-white dark:bg-[#191919] border-[#E5E7EB] dark:border-[#2F2F2F]'
                                    : 'bg-gray-50 dark:bg-[#0F0F0F] border-gray-200 dark:border-[#1F1F1F]'
                                }`}
                        >
                            <div className={`text-xs mb-1 ${day.isCurrentMonth
                                    ? 'text-[#1a1a1a] dark:text-white font-medium'
                                    : 'text-neutral-400'
                                }`}>
                                {day.date.getDate()}
                            </div>
                            {day.isCurrentMonth && renderDay(day)}
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}
