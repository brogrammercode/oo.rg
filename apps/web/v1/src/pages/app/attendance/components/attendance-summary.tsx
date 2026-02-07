import {
    Loader2,
    CheckCircle,
    XCircle,
    Clock,
    Umbrella,
    Coffee,
    Zap,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import attendanceService from '../../../../services/attendance/attendance.service';
import orgService from '../../../../services/org/org.service';
import { useOrgStore } from '../../../../stores/org';
import type { Attendance } from '../../../../types/attendance';
import type { Employee } from '../../../../types/org';
import Avatar from '../../../../components/ui/avatar';
import { AttendanceStatus } from '../../../../constants/attendance';

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case AttendanceStatus.PRESENT:
            return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
        case AttendanceStatus.ABSENT:
            return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
        case AttendanceStatus.LATE:
            return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
        case AttendanceStatus.HOLIDAY:
            return <Umbrella className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
        case AttendanceStatus.LEAVE:
            return <Coffee className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
        case AttendanceStatus.OVERTIME:
            return <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
        default:
            return <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />;
    }
};

export default function AttendanceSummary() {
    const { org } = useOrgStore();
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const fetchAttendance = async () => {
        if (!org) return;
        try {
            const res = await attendanceService.getAllAttendance(org._id);
            setAttendance(res.data.data.attendance);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEmployees = async () => {
        if (!org) return;
        try {
            const res = await orgService.getAllEmployees(org._id);
            setEmployees(res.data.data.employees);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
        fetchEmployees();
    }, [org]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getAttendanceForEmployeeOnDay = (employeeId: string, day: number) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        // const targetDate = new Date(year, month, day);

        return attendance.find(att => {
            if (att.employee?._id !== employeeId) return false;
            if (!att.date) return false;
            const attDate = new Date(att.date);
            return attDate.getDate() === day &&
                attDate.getMonth() === month &&
                attDate.getFullYear() === year;
        });
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const getEmployeeSummary = (employeeId: string) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const monthAttendance = attendance.filter(att => {
            if (att.employee?._id !== employeeId) return false;
            if (!att.date) return false;
            const attDate = new Date(att.date);
            return attDate.getMonth() === month && attDate.getFullYear() === year;
        });

        return {
            present: monthAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length,
            absent: monthAttendance.filter(a => a.status === AttendanceStatus.ABSENT).length,
            late: monthAttendance.filter(a => a.status === AttendanceStatus.LATE).length,
            leave: monthAttendance.filter(a => a.status === AttendanceStatus.LEAVE).length
        };
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
            </div>
        );
    }

    const daysInMonth = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    return (
        <div className="w-full mx-auto py-2 px-2 sm:px-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">Attendance Summary</h1>
                <p className="mt-2 text-neutral-500 max-w-2xl">
                    Monthly overview of employee attendance records.
                </p>
            </header>

            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} className="text-neutral-600 dark:text-neutral-400" />
                    </button>
                    <h2 className="text-xl font-semibold text-[#1a1a1a] dark:text-white">{monthName}</h2>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} className="text-neutral-600 dark:text-neutral-400" />
                    </button>
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="text-neutral-600 dark:text-neutral-400">Present</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                        <span className="text-neutral-600 dark:text-neutral-400">Absent</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-neutral-600 dark:text-neutral-400">Late</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Coffee className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span className="text-neutral-600 dark:text-neutral-400">Leave</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Umbrella className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-neutral-600 dark:text-neutral-400">Holiday</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                        <span className="text-neutral-600 dark:text-neutral-400">Overtime</span>
                    </div>
                </div>
            </div>

            <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg overflow-hidden bg-white dark:bg-[#191919] shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white dark:bg-[#191919] z-10">
                            <tr className="border-b border-[#E5E7EB] dark:border-[#2F2F2F] bg-gray-50/50 dark:bg-zinc-800/20">
                                <th className="py-3 px-4 font-medium text-neutral-500 sticky left-0 bg-gray-50/50 dark:bg-zinc-800/20 min-w-[200px]">Employee</th>
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                                    <th key={day} className="py-3 px-2 font-medium text-neutral-500 text-center min-w-[40px]">
                                        {day}
                                    </th>
                                ))}
                                <th className="py-3 px-4 font-medium text-neutral-500 text-center sticky right-0 bg-gray-50/50 dark:bg-zinc-800/20 min-w-[120px]">Summary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2F2F2F]">
                            {employees.map((employee) => {
                                const summary = getEmployeeSummary(employee._id);
                                return (
                                    <tr key={employee._id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="py-3 px-4 sticky left-0 bg-white dark:bg-[#191919] group-hover:bg-gray-50 dark:group-hover:bg-zinc-800/30">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    initials={employee.user?.name?.substring(0, 2).toUpperCase()}
                                                    className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 w-8 h-8"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-[#1a1a1a] dark:text-white">{employee.user?.name}</span>
                                                    <span className="text-xs text-neutral-400">{employee.post?.name || 'No Post'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                            const dayAttendance = getAttendanceForEmployeeOnDay(employee._id, day);
                                            return (
                                                <td key={day} className="py-3 px-2 text-center">
                                                    <div className="flex justify-center items-center">
                                                        {dayAttendance ? (
                                                            <StatusIcon status={dayAttendance.status || ''} />
                                                        ) : (
                                                            <div className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className="py-3 px-4 sticky right-0 bg-white dark:bg-[#191919] group-hover:bg-gray-50 dark:group-hover:bg-zinc-800/30">
                                            <div className="flex items-center gap-2 text-xs justify-center">
                                                <span className="text-green-600 dark:text-green-400 font-medium">{summary.present}P</span>
                                                <span className="text-red-600 dark:text-red-400 font-medium">{summary.absent}A</span>
                                                <span className="text-yellow-600 dark:text-yellow-400 font-medium">{summary.late}L</span>
                                                <span className="text-purple-600 dark:text-purple-400 font-medium">{summary.leave}L</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan={daysInMonth + 2} className="py-8 text-center text-neutral-500">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
