import {
    Loader2,
    Calendar,
    FileText,
    Plus,
    CalendarDays,
    Tag
} from 'lucide-react';
import { useEffect, useState } from 'react';
import leaveService from '../../../services/leave/leave.service';
import { useOrgStore } from '../../../stores/org';
import { PermissionGuard } from '../../../components/guards/permission-guard';
import { Permissions } from '../../../constants/org';
import type { Leave, LeaveType } from '../../../types/leave';
import { LeaveStatus } from '../../../constants/leave';
import { LeaveFormModal, StatusBadge, getDuration, isPositiveStatus, calculateTotalRemainingLeaves } from './leave-components';
import { CalendarView } from '../../../components/ui/calendar-view';
import { Modal } from '../../../components/ui/modal';

export default function SelfLeave() {
    const { org, employee } = useOrgStore();
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [calendarModalOpen, setCalendarModalOpen] = useState(false);
    const [leaveTypesModalOpen, setLeaveTypesModalOpen] = useState(false);

    const fetchMyLeaves = async () => {
        if (!employee) return;
        try {
            const res = await leaveService.getMyLeaves(employee._id);
            setLeaves(res.data.data.leave);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaveTypes = async () => {
        if (!org) return;
        try {
            const res = await leaveService.getAllLeaveType(org._id);
            setLeaveTypes(res.data.data.leaveTypes);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchMyLeaves();
        fetchLeaveTypes();
    }, [org, employee]);

    const handleCreateLeave = async (formData: {
        type: string;
        startDate: string;
        endDate: string;
        reason: string;
        status?: string;
    }) => {
        if (!org || !employee) return;
        await leaveService.createLeave(org._id, {
            ...formData,
            employee: employee._id,
        });
        setCreateModalOpen(false);
        fetchMyLeaves();
    };

    const getStats = () => {
        const approved = leaves.filter(l => isPositiveStatus(l.status)).length;
        const pending = leaves.filter(l => l.status === LeaveStatus.PENDING).length;
        const remaining = employee ? calculateTotalRemainingLeaves(leaves, employee._id, leaveTypes) : 0;
        return { approved, pending, remaining, total: leaves.length };
    };

    const stats = getStats();

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
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">My Leaves</h1>
                        <p className="mt-2 text-sm sm:text-base text-neutral-500">
                            View and track your leave requests and approvals.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <PermissionGuard permission={Permissions.READ_LEAVE_TYPE}>
                            <button
                                onClick={() => setLeaveTypesModalOpen(true)}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] hover:bg-gray-50 dark:hover:bg-[#252525] text-[#1a1a1a] dark:text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Tag size={16} />
                                <span className="hidden sm:inline">Leave Types</span>
                            </button>
                        </PermissionGuard>
                        <button
                            onClick={() => setCalendarModalOpen(true)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] hover:bg-gray-50 dark:hover:bg-[#252525] text-[#1a1a1a] dark:text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <CalendarDays size={16} />
                            <span className="hidden sm:inline">Calendar</span>
                        </button>
                        <PermissionGuard permission={Permissions.REQUEST_LEAVE}>
                            <button
                                onClick={() => setCreateModalOpen(true)}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Plus size={16} />
                                <span className="hidden sm:inline">Request Leave</span>
                                <span className="sm:hidden">Request</span>
                            </button>
                        </PermissionGuard>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-6 bg-white dark:bg-[#191919] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Total</p>
                            <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-6 bg-white dark:bg-[#191919] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Approved</p>
                            <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{stats.approved}</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-6 bg-white dark:bg-[#191919] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Pending</p>
                            <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg p-6 bg-white dark:bg-[#191919] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500">Remaining</p>
                            <p className="text-2xl font-bold text-[#1a1a1a] dark:text-white">{stats.remaining}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg overflow-x-auto bg-white dark:bg-[#191919] shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-[#2F2F2F] bg-gray-50/50 dark:bg-zinc-800/20">
                            <th className="py-3 px-4 font-medium text-neutral-500">Type</th>
                            <th className="py-3 px-4 font-medium text-neutral-500 hidden sm:table-cell">Start Date</th>
                            <th className="py-3 px-4 font-medium text-neutral-500 hidden sm:table-cell">End Date</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Duration</th>
                            <th className="py-3 px-4 font-medium text-neutral-500 hidden md:table-cell">Reason</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2F2F2F]">
                        {leaves.map((leave) => (
                            <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: leave.type?.color || '#3b82f6' }}
                                        />
                                        <span className="text-neutral-600 dark:text-neutral-300 font-medium text-xs sm:text-sm">{leave.type?.name || '-'}</span>
                                        {leave.type?.isPaid && (
                                            <span className="text-xs text-green-600 dark:text-green-400 hidden sm:inline">(Paid)</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4 hidden sm:table-cell">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Calendar size={14} className="text-neutral-400" />
                                        <span className="text-xs sm:text-sm">{leave.startDate ? new Date(leave.startDate).toLocaleDateString() : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 hidden sm:table-cell">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Calendar size={14} className="text-neutral-400" />
                                        <span className="text-xs sm:text-sm">{leave.endDate ? new Date(leave.endDate).toLocaleDateString() : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-neutral-600 dark:text-neutral-300 font-medium text-xs sm:text-sm">
                                        {getDuration(leave.startDate, leave.endDate)}
                                    </span>
                                </td>
                                <td className="py-3 px-4 hidden md:table-cell">
                                    <span className="text-neutral-600 dark:text-neutral-300 text-sm">
                                        {leave.reason ? (leave.reason.length > 50 ? leave.reason.substring(0, 50) + '...' : leave.reason) : '-'}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={leave.status || 'PENDING'} />
                                </td>
                            </tr>
                        ))}
                        {leaves.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-neutral-500 text-sm">
                                    No leave requests found. Request your first leave!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <LeaveFormModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateLeave}
                leaveTypes={leaveTypes}
                leaves={leaves}
                currentEmployeeId={employee?._id}
                title="Request Leave"
                submitLabel="Submit Request"
                showEmployeeSelect={false}
                showStatusSelect={false}
            />

            <CalendarView
                isOpen={calendarModalOpen}
                onClose={() => setCalendarModalOpen(false)}
                title="My Leave Calendar"
                data={leaves}
                dateField="startDate"
                renderDay={(day) => {
                    const leave = leaves.find(l => {
                        const start = l.startDate ? new Date(l.startDate) : null;
                        const end = l.endDate ? new Date(l.endDate) : null;
                        if (!start || !end) return false;
                        return day.date >= start && day.date <= end;
                    });

                    if (!leave) return null;

                    return (
                        <div className="flex flex-col gap-1">
                            <StatusBadge status={leave.status || 'PENDING'} />
                            <div className="text-[10px] text-neutral-500 truncate">
                                {leave.type?.name}
                            </div>
                        </div>
                    );
                }}
            />

            <Modal isOpen={leaveTypesModalOpen} onClose={() => setLeaveTypesModalOpen(false)} title="Leave Types">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-500">
                        View all available leave types and their details
                    </p>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {leaveTypes.length === 0 ? (
                            <div className="py-8 text-center text-neutral-500 text-sm">
                                No leave types available yet.
                            </div>
                        ) : (
                            leaveTypes.map((type) => (
                                <div key={type._id} className="flex items-center justify-between p-3 border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: type.color || '#3b82f6' }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-medium text-[#1a1a1a] dark:text-white">{type.name}</h4>
                                                {type.isPaid && (
                                                    <span className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded whitespace-nowrap">Paid</span>
                                                )}
                                            </div>
                                            {type.description && (
                                                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{type.description}</p>
                                            )}
                                            <div className="flex gap-3 mt-1 text-xs text-neutral-500 flex-wrap">
                                                {type.maxPerMonth! > 0 && <span className="whitespace-nowrap">Max/Month: {type.maxPerMonth}</span>}
                                                {type.maxPerYear! > 0 && <span className="whitespace-nowrap">Max/Year: {type.maxPerYear}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
