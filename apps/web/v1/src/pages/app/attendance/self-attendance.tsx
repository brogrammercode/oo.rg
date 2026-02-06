import {
    Loader2,
    Calendar,
    Clock,
    CalendarDays
} from 'lucide-react';
import { useEffect, useState } from 'react';
import attendanceService from '../../../services/attendance/attendance.service';
import { useOrgStore } from '../../../stores/org';
import type { Attendance } from '../../../types/attendance';
import { AttendanceStatus } from '../../../constants/attendance';
import { ClockButton, AttendanceStatusBadge, formatDuration } from './attendance-components';
import { getLocalDateString, getLocalDateTimeString, toLocalDateString, toLocalDateTimeString } from '../../../utils/date';
import { CalendarView } from '../../../components/ui/calendar-view';

export default function SelfAttendance() {
    const { org, employee } = useOrgStore();
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarModalOpen, setCalendarModalOpen] = useState(false);

    const fetchMyAttendance = async () => {
        if (!employee) return;
        try {
            const res = await attendanceService.getAttendance(employee._id);
            const attendanceData = res.data.data.attendance;
            setAttendance(Array.isArray(attendanceData) ? attendanceData : [attendanceData]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyAttendance();
    }, [employee]);

    const getTodayAttendance = (): Attendance | null => {
        const today = getLocalDateString();
        return attendance.find(att => {
            const attDate = att.date ? toLocalDateString(att.date) : '';
            return attDate === today;
        }) || null;
    };

    const handleClockIn = async () => {
        if (!org || !employee) return;
        await attendanceService.createAttendance(org._id, employee._id, {
            date: getLocalDateString(),
            status: AttendanceStatus.PRESENT,
            checkIn: getLocalDateTimeString(),
            checkOut: ''
        });
        fetchMyAttendance();
    };

    const handleClockOut = async () => {
        const todayAtt = getTodayAttendance();
        if (!todayAtt) return;
        await attendanceService.updateAttendance(todayAtt._id, {
            date: todayAtt.date ? toLocalDateString(todayAtt.date) : '',
            status: todayAtt.status || AttendanceStatus.PRESENT,
            checkIn: todayAtt.checkIn ? toLocalDateTimeString(todayAtt.checkIn) : '',
            checkOut: getLocalDateTimeString()
        });
        fetchMyAttendance();
    };

    const getTotalHours = () => {
        const total = attendance.reduce((sum, att) => sum + (att.duration || 0), 0);
        return formatDuration(total);
    };

    const getAverageHours = () => {
        if (attendance.length === 0) return '0h 0m';
        const total = attendance.reduce((sum, att) => sum + (att.duration || 0), 0);
        return formatDuration(Math.floor(total / attendance.length));
    };

    const getPresentDays = () => {
        return attendance.filter(att => att.status === AttendanceStatus.PRESENT || att.status === AttendanceStatus.LATE || att.status === AttendanceStatus.OVERTIME).length;
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-2 px-2 sm:px-6">
            <header className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">My Attendance</h1>
                        <p className="mt-2 text-sm sm:text-base text-neutral-500">
                            Track your attendance records and work hours.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCalendarModalOpen(true)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] hover:bg-gray-50 dark:hover:bg-[#252525] text-[#1a1a1a] dark:text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <CalendarDays size={16} />
                            <span className="hidden sm:inline">Calendar</span>
                        </button>
                        <ClockButton
                            todayAttendance={getTodayAttendance()}
                            onClockIn={handleClockIn}
                            onClockOut={handleClockOut}
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-6 bg-white dark:bg-[#191919] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Present Days</p>
                            <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{getPresentDays()}</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-6 bg-white dark:bg-[#191919] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Total Hours</p>
                            <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{getTotalHours()}</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-6 bg-white dark:bg-[#191919] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Average Hours</p>
                            <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{getAverageHours()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg overflow-x-auto bg-white dark:bg-[#191919] shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-[#2F2F2F] bg-gray-50/50 dark:bg-zinc-800/20">
                            <th className="py-3 px-4 font-medium text-neutral-500">Date</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Status</th>
                            <th className="py-3 px-4 font-medium text-neutral-500 hidden sm:table-cell">Check In</th>
                            <th className="py-3 px-4 font-medium text-neutral-500 hidden sm:table-cell">Check Out</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2F2F2F]">
                        {attendance.map((att) => (
                            <tr key={att._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Calendar size={14} className="text-neutral-400" />
                                        <span className="font-medium text-xs sm:text-sm">{att.date ? new Date(att.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <AttendanceStatusBadge status={att.status || 'PRESENT'} />
                                </td>
                                <td className="py-3 px-4 hidden sm:table-cell">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Clock size={14} className="text-neutral-400" />
                                        <span>{att.checkIn ? new Date(att.checkIn).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 hidden sm:table-cell">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Clock size={14} className="text-neutral-400" />
                                        <span>{att.checkOut ? new Date(att.checkOut).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="font-medium text-[#1a1a1a] dark:text-white text-xs sm:text-sm">
                                        {att.duration ? formatDuration(att.duration) : '-'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {attendance.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-neutral-500 text-sm">
                                    No attendance records found. Click "Clock In" to start!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CalendarView
                isOpen={calendarModalOpen}
                onClose={() => setCalendarModalOpen(false)}
                title="My Attendance Calendar"
                data={attendance}
                dateField="date"
                renderDay={(day) => {
                    if (!day.data) return null;
                    return (
                        <div className="flex flex-col gap-1">
                            <AttendanceStatusBadge status={day.data.status || 'PRESENT'} />
                            {day.data.checkIn && (
                                <span className="text-[10px] text-neutral-500">
                                    {new Date(day.data.checkIn).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    {day.data.checkOut && ` - ${new Date(day.data.checkOut).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`}
                                </span>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
}
