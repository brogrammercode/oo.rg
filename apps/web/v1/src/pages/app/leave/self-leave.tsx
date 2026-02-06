import {
    Loader2,
    Calendar,
    FileText,
    Plus
} from 'lucide-react';
import { useEffect, useState } from 'react';
import leaveService from '../../../services/leave/leave.service';
import { useOrgStore } from '../../../stores/org';
import type { Leave, LeaveType } from '../../../types/leave';
import { LeaveStatus } from '../../../constants/leave';
import { LeaveFormModal, StatusBadge, getDuration, isPositiveStatus, calculateTotalRemainingLeaves } from './leave-components';

export default function SelfLeave() {
    const { org, employee } = useOrgStore();
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);

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
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">My Leaves</h1>
                    <p className="mt-2 text-neutral-500 max-w-2xl">
                        View and track your leave requests and approvals.
                    </p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus size={16} />
                    Request Leave
                </button>
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

            <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg overflow-hidden bg-white dark:bg-[#191919] shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-[#2F2F2F] bg-gray-50/50 dark:bg-zinc-800/20">
                            <th className="py-3 px-4 font-medium text-neutral-500">Type</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Start Date</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">End Date</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Duration</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Reason</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2F2F2F]">
                        {leaves.map((leave) => (
                            <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: leave.type?.color || '#3b82f6' }}
                                        />
                                        <span className="text-neutral-600 dark:text-neutral-300 font-medium">{leave.type?.name || '-'}</span>
                                        {leave.type?.isPaid && (
                                            <span className="text-xs text-green-600 dark:text-green-400">(Paid)</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Calendar size={14} className="text-neutral-400" />
                                        <span>{leave.startDate ? new Date(leave.startDate).toLocaleDateString() : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Calendar size={14} className="text-neutral-400" />
                                        <span>{leave.endDate ? new Date(leave.endDate).toLocaleDateString() : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                                        {getDuration(leave.startDate, leave.endDate)}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
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
                                <td colSpan={6} className="py-8 text-center text-neutral-500">
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
        </div>
    );
}
