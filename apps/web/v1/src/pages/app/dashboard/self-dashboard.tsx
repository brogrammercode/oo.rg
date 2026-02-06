import { useEffect, useState } from 'react';
import {
    Clock,
    Timer,
    TimerOff,
    Trophy,
    AlertTriangle,
    DollarSign,
    Scale,
    Play,
    CalendarDays,
    Plus
} from 'lucide-react';
import { StatCard, InfoCard, ActionButton, InfoItem } from './dashboard-components';
import Avatar from '../../../components/ui/avatar';
import { useOrgStore } from '../../../stores/org';
import attendanceService from '../../../services/attendance/attendance.service';
import leaveService from '../../../services/leave/leave.service';
import { AttendanceStatus } from '../../../constants/attendance';
import { getLocalDateString, getLocalDateTimeString, toLocalDateString, toLocalDateTimeString } from '../../../utils/date';
import { isPositiveStatus, LeaveFormModal } from '../leave/leave-components';
import { LeaveStatus } from '../../../constants/leave';
import type { Attendance } from '../../../types/attendance';
import type { Leave, LeaveType } from '../../../types/leave';

export default function SelfDashboard() {
    const { org, employee } = useOrgStore();
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [_, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [leaveFormOpen, setLeaveFormOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchData();
    }, [org, employee]);

    const fetchData = async () => {
        if (!org || !employee) return;
        try {
            const [attendanceRes, leavesRes, leaveTypesRes] = await Promise.all([
                attendanceService.getAttendance(employee._id),
                leaveService.getMyLeaves(employee._id),
                leaveService.getAllLeaveType(org._id)
            ]);

            const attendanceData = attendanceRes.data.data.attendance;
            setAttendance(Array.isArray(attendanceData) ? attendanceData : [attendanceData]);

            const leaveData = leavesRes.data.data.leave;
            setLeaves(Array.isArray(leaveData) ? leaveData : [leaveData]);

            setLeaveTypes(leaveTypesRes.data.data.leaveTypes || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleClockIn = async () => {
        if (!org || !employee) return;
        try {
            await attendanceService.createAttendance(org._id, employee._id, {
                date: getLocalDateString(),
                status: AttendanceStatus.PRESENT,
                checkIn: getLocalDateTimeString(),
                checkOut: ''
            });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleClockOut = async () => {
        if (!employee) return;
        try {
            const today = getLocalDateString();
            const todayAtt = attendance.find(att => {
                const attDate = att.date ? toLocalDateString(att.date) : '';
                return attDate === today;
            });

            if (todayAtt) {
                await attendanceService.updateAttendance(todayAtt._id, {
                    date: todayAtt.date ? toLocalDateString(todayAtt.date) : '',
                    status: todayAtt.status || AttendanceStatus.PRESENT,
                    checkIn: todayAtt.checkIn ? toLocalDateTimeString(todayAtt.checkIn) : '',
                    checkOut: getLocalDateTimeString()
                });
                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getTodayAttendance = (): Attendance | null => {
        const today = getLocalDateString();
        return attendance.find(att => {
            const attDate = att.date ? toLocalDateString(att.date) : '';
            return attDate === today;
        }) || null;
    };

    const getAttendanceStats = () => {
        const present = attendance.filter(att =>
            att.status === AttendanceStatus.PRESENT ||
            att.status === AttendanceStatus.LATE ||
            att.status === AttendanceStatus.OVERTIME
        ).length;
        const late = attendance.filter(att => att.status === AttendanceStatus.LATE).length;
        const halfDay = attendance.filter(att => att.status === AttendanceStatus.LATE).length;

        return {
            total: attendance.length,
            present,
            leaves: leaves.filter(l => isPositiveStatus(l.status)).length,
            halfDay,
            late,
            overtime: 0
        };
    };

    const getLeaveStats = () => {
        const approved = leaves.filter(l => isPositiveStatus(l.status)).length;
        const rejected = leaves.filter(l => l.status === LeaveStatus.REJECTED).length;
        const pending = leaves.filter(l => l.status === LeaveStatus.PENDING).length;
        const paid = leaves.filter(l => l.type?.isPaid && isPositiveStatus(l.status)).length;
        const unpaid = leaves.filter(l => !l.type?.isPaid && isPositiveStatus(l.status)).length;

        return {
            total: leaves.length,
            approved,
            rejected,
            pending,
            paid,
            unpaid
        };
    };

    const attendanceStats = getAttendanceStats();
    const leaveStats = getLeaveStats();
    const todayAtt = getTodayAttendance();

    return (
        <div className="w-full mx-auto py-2 px-2 sm:px-6">
            <header className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">My Dashboard</h1>
                        <p className="mt-2 text-sm sm:text-base text-neutral-500">
                            Your personal overview and statistics.
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <InfoCard title="Profile">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-[#E5E7EB] dark:border-[#2F2F2F]">
                            <Avatar name={employee?.user?.name || 'Employee'} size="lg" />
                            <div>
                                <h2 className="font-semibold text-[#1a1a1a] dark:text-white">{employee?.user?.name || 'Employee'}</h2>
                                <p className="text-xs text-neutral-500">{employee?.post?.name || 'No Post'}</p>
                            </div>
                        </div>
                        <InfoItem label="Phone Number" value={employee?.user?.phone || '-'} />
                        <InfoItem label="Email" value={employee?.user?.email || '-'} />
                        <InfoItem label="Address" value={employee?.user?.address || '-'} />
                        <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#2F2F2F]">
                            <InfoItem
                                label="Joining Date"
                                value={employee?.createdAt ? new Date(employee.createdAt).toLocaleDateString() : '-'}
                            />
                        </div>
                    </div>
                </InfoCard>

                <InfoCard title="Attendance Summary">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoItem label="Total" value={attendanceStats.total} colorClass="text-purple-600 dark:text-purple-400" />
                        <InfoItem label="Present" value={attendanceStats.present} colorClass="text-emerald-600 dark:text-emerald-400" />
                        <InfoItem label="Leaves" value={attendanceStats.leaves} colorClass="text-red-600 dark:text-red-400" />
                        <InfoItem label="Half Day" value={attendanceStats.halfDay} colorClass="text-blue-600 dark:text-blue-400" />
                        <InfoItem label="Late" value={attendanceStats.late} colorClass="text-orange-600 dark:text-orange-400" />
                        <InfoItem label="Overtime" value={attendanceStats.overtime} colorClass="text-indigo-600 dark:text-indigo-400" />
                    </div>
                </InfoCard>

                <InfoCard title="Leave Summary">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoItem label="Total Leaves" value={leaveStats.total} />
                        <InfoItem label="Approved" value={leaveStats.approved} colorClass="text-emerald-600 dark:text-emerald-400" />
                        <InfoItem label="Rejected" value={leaveStats.rejected} colorClass="text-red-600 dark:text-red-400" />
                        <InfoItem label="Pending" value={leaveStats.pending} colorClass="text-orange-600 dark:text-orange-400" />
                        <InfoItem label="Paid Leaves" value={leaveStats.paid} />
                        <InfoItem label="Unpaid Leaves" value={leaveStats.unpaid} />
                    </div>
                    <ActionButton icon={Plus} onClick={() => setLeaveFormOpen(true)} className="w-full mt-4">
                        Apply New Leave
                    </ActionButton>
                </InfoCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <InfoCard title="Today's Attendance">
                    <div className="flex flex-col items-center py-4">
                        <p className="text-xs text-neutral-500 mb-2">
                            {currentTime.toLocaleTimeString()}, {currentTime.toLocaleDateString()}
                        </p>
                        <div className="relative w-24 h-24 mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-[#E5E7EB] dark:border-[#2F2F2F]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-neutral-400">
                                    {todayAtt?.status === AttendanceStatus.PRESENT ? '✓' : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-neutral-500 mb-4 flex items-center gap-1">
                            <Clock size={14} />
                            Clock In: {todayAtt?.checkIn ? new Date(todayAtt.checkIn).toLocaleTimeString() : 'N/A'}
                        </div>
                        <div className="flex w-full gap-3">
                            <ActionButton icon={Timer} onClick={handleClockIn} className="flex-1" disabled={!!todayAtt}>
                                Clock In
                            </ActionButton>
                            <ActionButton icon={TimerOff} onClick={handleClockOut} className="flex-1" disabled={!todayAtt || !!todayAtt.checkOut}>
                                Clock Out
                            </ActionButton>
                        </div>
                    </div>
                </InfoCard>

                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard
                        icon={Trophy}
                        value="0"
                        label="Appreciations"
                        colorClass="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        value="0"
                        label="Warnings"
                        colorClass="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    />
                    <StatCard
                        icon={DollarSign}
                        value="0"
                        label="Expenses"
                        colorClass="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    />
                    <StatCard
                        icon={Scale}
                        value="0"
                        label="Complaints"
                        colorClass="bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                    />

                    <div className="col-span-2 sm:col-span-4">
                        <InfoCard
                            title="Working Hour Details"
                            headerAction={
                                <button className="text-xs border border-[#E5E7EB] dark:border-[#2F2F2F] rounded px-2 py-1 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-[#252525] text-neutral-500">
                                    <CalendarDays size={14} /> Today
                                </button>
                            }
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#1a1a1a] dark:bg-white"></span>
                                        <span className="text-xs text-neutral-500">Total office time</span>
                                    </div>
                                    <p className="text-xl font-bold text-[#1a1a1a] dark:text-white ml-4">-</p>
                                    <div className="h-1.5 w-full bg-[#E5E7EB] dark:bg-[#2F2F2F] rounded-full ml-4">
                                        <div className="h-full bg-[#1a1a1a] dark:bg-white w-0 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        <span className="text-xs text-neutral-500">Total worked time</span>
                                    </div>
                                    <p className="text-xl font-bold text-[#1a1a1a] dark:text-white ml-4">-</p>
                                    <div className="h-1.5 w-full bg-[#E5E7EB] dark:bg-[#2F2F2F] rounded-full ml-4">
                                        <div className="h-full bg-emerald-500 w-0 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        <span className="text-xs text-neutral-500">Total late time</span>
                                    </div>
                                    <p className="text-xl font-bold text-[#1a1a1a] dark:text-white ml-4">-</p>
                                    <div className="h-1.5 w-full bg-[#E5E7EB] dark:bg-[#2F2F2F] rounded-full ml-4">
                                        <div className="h-full bg-red-500 w-0 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InfoCard title="Assigned Survey">
                    <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer">
                        <div>
                            <p className="text-sm font-medium text-[#1a1a1a] dark:text-white mb-1">Employee Preferences for Remote Work</p>
                            <p className="text-xs text-neutral-500">{currentTime.toLocaleDateString()}</p>
                        </div>
                        <button className="h-8 w-8 flex items-center justify-center rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                            <Play size={16} fill="currentColor" />
                        </button>
                    </div>
                </InfoCard>

                <InfoCard
                    title="Increment/Promotion"
                    headerAction={
                        <button className="text-xs border border-[#E5E7EB] dark:border-[#2F2F2F] rounded px-2 py-1 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-[#252525] text-neutral-500">
                            Select Year... <CalendarDays size={12} />
                        </button>
                    }
                >
                    <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full border border-emerald-500 bg-white dark:bg-[#191919]"></div>
                            <span className="text-xs font-medium text-[#1a1a1a] dark:text-white">
                                {employee?.createdAt ? new Date(employee.createdAt).toLocaleDateString() : '-'} Joined
                            </span>
                        </div>
                        <div className="pl-4 border-l border-[#E5E7EB] dark:border-[#2F2F2F] ml-1">
                            <h4 className="text-sm font-semibold text-[#1a1a1a] dark:text-white">{employee?.post?.name || 'No Post'}</h4>
                            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                                <span>Current Position</span>
                            </div>
                        </div>
                    </div>
                </InfoCard>
            </div>

            <LeaveFormModal
                isOpen={leaveFormOpen}
                onClose={() => setLeaveFormOpen(false)}
                onSubmit={async (formData) => {
                    if (!org || !employee) return;
                    await leaveService.createLeave(org._id, {
                        employee: employee._id,
                        type: formData.type,
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        reason: formData.reason,
                        status: formData.status || LeaveStatus.PENDING
                    });
                    fetchData();
                }}
                leaveTypes={leaveTypes}
                leaves={leaves}
                currentEmployeeId={employee?._id}
                title="Apply for Leave"
                submitLabel="Submit Leave Request"
            />
        </div>
    );
}