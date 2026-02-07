import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    UserCheck,
    UserX,
    Building2,
    Calendar,
    Timer,
    TimerOff,
    Eye,
    Check,
    X,
    Cake,
    PartyPopper,
    BarChart3
} from 'lucide-react';
import { StatCard, InfoCard, ActionButton, InfoItem } from './dashboard-components';
import Avatar from '../../../components/ui/avatar';
import { Modal } from '../../../components/ui/modal';
import { useOrgStore } from '../../../stores/org';
import orgService from '../../../services/org/org.service';
import attendanceService from '../../../services/attendance/attendance.service';
import leaveService from '../../../services/leave/leave.service';
import { AttendanceStatus } from '../../../constants/attendance';
import { getLocalDateString, getLocalDateTimeString, toLocalDateString } from '../../../utils/date';
import { getDuration } from '../leave/leave-components';
import type { Employee } from '../../../types/org';
import type { Leave } from '../../../types/leave';
import { AppRoutes } from '../../../constants/routes';

export default function ManagerDashboard() {
    const { org, employee } = useOrgStore();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [pendingLeaves, setPendingLeaves] = useState<Leave[]>([]);
    const [_, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchData();
    }, [org]);

    const fetchData = async () => {
        if (!org) return;
        try {
            const [employeesRes, leavesRes] = await Promise.all([
                orgService.getAllEmployees(org._id),
                leaveService.getAllLeaves(org._id)
            ]);

            setEmployees(employeesRes.data.data.employees || []);

            const allLeaves = Array.isArray(leavesRes.data.data.leave)
                ? leavesRes.data.data.leave
                : [leavesRes.data.data.leave];

            setPendingLeaves(allLeaves.filter((leave: Leave) => leave.status === 'PENDING').slice(0, 5));

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleClockIn = async () => {
        if (!org || !employee) return;
        try {
            await attendanceService.createAttendance(org._id, {
                employee: employee._id,
                date: getLocalDateString(),
                status: AttendanceStatus.PRESENT,
                checkIn: getLocalDateTimeString(),
                checkOut: ''
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleClockOut = async () => {
        if (!employee) return;
        try {
            const res = await attendanceService.getAttendance(employee._id);
            const attendanceData = res.data.data.attendance;
            const allAttendance = Array.isArray(attendanceData) ? attendanceData : [attendanceData];
            const today = getLocalDateString();
            const todayAtt = allAttendance.find(att => {
                const attDate = att.date ? toLocalDateString(att.date) : '';
                return attDate === today;
            });

            if (todayAtt) {
                await attendanceService.updateAttendance(todayAtt._id, {
                    date: todayAtt.date ? toLocalDateString(todayAtt.date) : '',
                    status: todayAtt.status || AttendanceStatus.PRESENT,
                    checkIn: todayAtt.checkIn || getLocalDateTimeString(),
                    checkOut: getLocalDateTimeString()
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewLeave = (leave: Leave) => {
        setSelectedLeave(leave);
        setViewModalOpen(true);
    };

    const handleApproveLeave = async (leave: Leave) => {
        try {
            await leaveService.updateLeave(leave._id, { status: 'APPROVED' });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRejectLeave = async (leave: Leave) => {
        try {
            await leaveService.updateLeave(leave._id, { status: 'REJECTED' });
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const getEmployeeStats = () => {
        const activeEmployees = employees.filter(emp => emp.status === 'ACCEPTED').length;
        const inactiveEmployees = employees.filter(emp => emp.status !== 'ACCEPTED').length;
        return {
            total: employees.length,
            active: activeEmployees,
            inactive: inactiveEmployees,
            underYou: 0
        };
    };

    const stats = getEmployeeStats();

    return (
        <div className="w-full mx-auto py-2 px-2 sm:px-6">
            <header className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">Manager Dashboard</h1>
                        <p className="mt-2 text-sm sm:text-base text-neutral-500">
                            Overview of your team and organization.
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <InfoCard title="Attendance">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Current Time" value={currentTime.toLocaleTimeString()} />
                            <InfoItem label="Current Date" value={currentTime.toLocaleDateString()} />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <ActionButton icon={Timer} onClick={handleClockIn} className="flex-1">
                                Clock In
                            </ActionButton>
                            <ActionButton icon={TimerOff} onClick={handleClockOut} className="flex-1">
                                Clock Out
                            </ActionButton>
                        </div>
                    </div>
                </InfoCard>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard
                        icon={Users}
                        value={stats.total}
                        label="Total Employees"
                        colorClass="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    />
                    <StatCard
                        icon={UserCheck}
                        value={stats.active}
                        label="Active Employees"
                        colorClass="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    />
                    <StatCard
                        icon={UserX}
                        value={stats.inactive}
                        label="Inactive Employees"
                        colorClass="bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                    />
                    <StatCard
                        icon={Building2}
                        value={stats.underYou}
                        label="Employees Under You"
                        colorClass="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <InfoCard
                    title="Pending Approvals"
                    headerAction={
                        <div className="flex items-center gap-2">
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                                {pendingLeaves.length}
                            </span>
                        </div>
                    }
                >
                    <div className="space-y-6 max-h-[350px] overflow-y-auto -mx-6 -my-6 p-6">
                        <div className="bg-[#F7F7F5] dark:bg-[#0F0F0F] py-2 px-4 rounded text-center mb-4">
                            <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">Leaves</span>
                        </div>

                        {pendingLeaves.length > 0 ? (
                            <div className="space-y-4">
                                {pendingLeaves.map((leave, index, array) => (
                                    <div key={leave._id} className="relative group">
                                        {index < array.length - 1 && (
                                            <div className="absolute left-4 top-10 bottom-[-16px] w-px bg-[#E5E7EB] dark:bg-[#2F2F2F]"></div>
                                        )}
                                        <div className="flex gap-3">
                                            <Avatar
                                                name={leave.employee?.user?.name || 'Employee'}
                                                size="sm"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <h5 className="text-sm font-semibold text-[#1a1a1a] dark:text-white">
                                                            {leave.employee?.user?.name || 'Unknown Employee'}
                                                        </h5>
                                                        <p className="text-xs text-neutral-500">
                                                            {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : '-'} - {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : '-'}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleViewLeave(leave)}
                                                            className="h-7 w-7 flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleApproveLeave(leave)}
                                                            className="h-7 w-7 flex items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/70 transition-colors"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectLeave(leave)}
                                                            className="h-7 w-7 flex items-center justify-center rounded bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-neutral-500 leading-relaxed">
                                                    {leave.reason || 'No reason provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-neutral-500 text-sm">
                                No pending approvals
                            </div>
                        )}
                    </div>
                </InfoCard>

                <InfoCard
                    title="Today's Attendance"
                    headerAction={
                        <button className="text-xs border border-[#E5E7EB] dark:border-[#2F2F2F] rounded px-2 py-1 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-[#252525] text-neutral-500">
                            <Calendar size={14} /> Today
                        </button>
                    }
                >
                    <div className="space-y-4">
                        <div className="text-center py-8">
                            <p className="text-lg font-semibold text-[#1a1a1a] dark:text-white mb-2">
                                Total: 0
                            </p>
                            <p className="text-sm text-neutral-500">employees marked attendance</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="text-sm text-neutral-500">Present</span>
                                </div>
                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">0% (0)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    <span className="text-sm text-neutral-500">Absent</span>
                                </div>
                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">0% (0)</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                    <span className="text-sm text-neutral-500">Not Marked</span>
                                </div>
                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">100% ({stats.total})</span>
                            </div>
                        </div>
                    </div>
                </InfoCard>

                <InfoCard
                    title="Clock-In/Out Status"
                    headerAction={
                        <button className="text-xs border border-[#E5E7EB] dark:border-[#2F2F2F] rounded px-2 py-1 flex items-center gap-1 hover:bg-gray-50 dark:hover:bg-[#252525] text-neutral-500">
                            <Calendar size={14} /> Today
                        </button>
                    }
                >
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 text-3xl font-bold">
                            !
                        </div>
                        <h4 className="text-lg font-medium text-[#1a1a1a] dark:text-white mb-1">No attendance marked yet</h4>
                        <p className="text-sm text-neutral-500">Clock in to start tracking</p>
                        <ActionButton onClick={() => navigate(AppRoutes.ATTENDANCE_LIST)} className="w-full mt-6">
                            View All Attendance
                        </ActionButton>
                    </div>
                </InfoCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard title="Birthdays">
                    <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 bg-pink-50 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                                <Cake className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                            </div>
                        </div>
                        <p className="text-sm text-neutral-500">No birthdays today</p>
                    </div>
                </InfoCard>

                <InfoCard title="Work Anniversary">
                    <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                <PartyPopper className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-sm text-neutral-500">No anniversaries today</p>
                    </div>
                </InfoCard>

                <InfoCard title="Employees By Department">
                    <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <p className="text-sm text-neutral-500">No department data</p>
                    </div>
                </InfoCard>
            </div>

            <Modal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                title="Leave Details"
            >
                {selectedLeave && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB] dark:border-[#2F2F2F]">
                            <Avatar name={selectedLeave.employee?.user?.name || 'Employee'} size="md" />
                            <div>
                                <h3 className="font-semibold text-[#1a1a1a] dark:text-white">
                                    {selectedLeave.employee?.user?.name || 'Unknown Employee'}
                                </h3>
                                <p className="text-sm text-neutral-500">{selectedLeave.employee?.post?.name || 'No Post'}</p>
                            </div>
                        </div>
                        <InfoItem label="Leave Type" value={selectedLeave.type?.name || '-'} />
                        <InfoItem label="Start Date" value={selectedLeave.startDate ? new Date(selectedLeave.startDate).toLocaleDateString() : '-'} />
                        <InfoItem label="End Date" value={selectedLeave.endDate ? new Date(selectedLeave.endDate).toLocaleDateString() : '-'} />
                        <InfoItem label="Duration" value={getDuration(selectedLeave.startDate, selectedLeave.endDate)} />
                        <InfoItem label="Status" value={selectedLeave.status || 'PENDING'} />
                        <div>
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Reason</p>
                            <p className="text-sm text-[#1a1a1a] dark:text-white">{selectedLeave.reason || 'No reason provided'}</p>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <ActionButton
                                onClick={() => {
                                    handleApproveLeave(selectedLeave);
                                    setViewModalOpen(false);
                                }}
                                className="flex-1"
                            >
                                Approve
                            </ActionButton>
                            <ActionButton
                                onClick={() => {
                                    handleRejectLeave(selectedLeave);
                                    setViewModalOpen(false);
                                }}
                                variant="secondary"
                                className="flex-1"
                            >
                                Reject
                            </ActionButton>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}