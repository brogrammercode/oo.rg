import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../../components/ui/modal';
import type { LeaveType, Leave } from '../../../types/leave';
import type { Employee } from '../../../types/org';
import { LeaveStatus } from '../../../constants/leave';

interface LeaveFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        employee?: string;
        type: string;
        startDate: string;
        endDate: string;
        reason: string;
        status?: string;
    }) => Promise<void>;
    leaveTypes: LeaveType[];
    employees?: Employee[];
    leaves?: Leave[];
    currentEmployeeId?: string;
    title: string;
    submitLabel: string;
    showEmployeeSelect?: boolean;
    showStatusSelect?: boolean;
    initialData?: {
        employee?: string;
        type: string;
        startDate: string;
        endDate: string;
        reason: string;
        status?: string;
    };
}

export function LeaveFormModal({
    isOpen,
    onClose,
    onSubmit,
    leaveTypes,
    employees,
    leaves = [],
    currentEmployeeId,
    title,
    submitLabel,
    showEmployeeSelect = false,
    showStatusSelect = false,
    initialData
}: LeaveFormProps) {
    const [formData, setFormData] = useState({
        employee: initialData?.employee || currentEmployeeId || '',
        type: initialData?.type || '',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        reason: initialData?.reason || '',
        status: initialData?.status || LeaveStatus.PENDING
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        if (showEmployeeSelect && !formData.employee) return false;
        if (!formData.type || !formData.startDate || !formData.endDate) return false;

        const selectedType = leaveTypes.find(t => t._id === formData.type);
        if (!selectedType) return false;

        const employeeId = formData.employee || currentEmployeeId;
        if (!employeeId) return false;

        const remaining = calculateRemainingLeaves(leaves, employeeId, selectedType, formData.startDate);
        return remaining.remainingThisMonth > 0 && remaining.remainingThisYear > 0;
    };

    const getRemainingInfo = () => {
        if (!formData.type || !formData.startDate) return null;

        const selectedType = leaveTypes.find(t => t._id === formData.type);
        if (!selectedType) return null;

        const employeeId = formData.employee || currentEmployeeId;
        if (!employeeId) return null;

        return calculateRemainingLeaves(leaves, employeeId, selectedType, formData.startDate);
    };

    const remainingInfo = getRemainingInfo();

    const getMaxEndDate = (startDate: string, remaining: { remainingThisMonth: number; remainingThisYear: number }) => {
        if (!startDate) return '';
        const start = new Date(startDate);
        const maxDays = Math.min(remaining.remainingThisMonth, remaining.remainingThisYear);
        const maxDate = new Date(start);
        maxDate.setDate(start.getDate() + maxDays - 1);
        return maxDate.toISOString().split('T')[0];
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-4">
                {showEmployeeSelect && employees && (
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Employee</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.employee}
                            onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                        >
                            <option value="">Select employee</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.user?.name} - {emp.post?.name || 'No Post'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Leave Type</label>
                    <select
                        className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="">Select leave type</option>
                        {leaveTypes.map(type => (
                            <option key={type._id} value={type._id}>{type.name}</option>
                        ))}
                    </select>
                    {remainingInfo && (
                        <div className="mt-2 flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <span className="text-neutral-500">This Month:</span>
                                <span className={`font-medium ${remainingInfo.remainingThisMonth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {remainingInfo.remainingThisMonth} left
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-neutral-500">This Year:</span>
                                <span className={`font-medium ${remainingInfo.remainingThisYear > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {remainingInfo.remainingThisYear} left
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Start Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.startDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                                setFormData({ ...formData, startDate: e.target.value, endDate: '' });
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">End Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.endDate}
                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                            max={remainingInfo ? getMaxEndDate(formData.startDate, remainingInfo) : undefined}
                            disabled={!formData.startDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                        {remainingInfo && formData.startDate && (
                            <p className="text-xs text-neutral-500 mt-1">
                                Max: {getMaxEndDate(formData.startDate, remainingInfo)}
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Reason</label>
                    <textarea
                        className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                        rows={3}
                        placeholder="Enter reason for leave..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                </div>
                {showStatusSelect && (
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="ACTIVE">Active</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                )}
                {remainingInfo && (remainingInfo.remainingThisMonth <= 0 || remainingInfo.remainingThisYear <= 0) && (
                    <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-400">
                            {remainingInfo.remainingThisMonth <= 0
                                ? "You have exhausted your monthly limit for this leave type."
                                : "You have exhausted your yearly limit for this leave type."}
                        </p>
                    </div>
                )}
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading || !isFormValid()} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {submitLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    let styles = "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400";
    if (status === 'APPROVED') {
        styles = "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    } else if (status === 'REJECTED') {
        styles = "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    } else if (status === 'PENDING') {
        styles = "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    } else if (status === 'CANCELLED') {
        styles = "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    } else if (status === 'ACTIVE') {
        styles = "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    } else if (status === 'COMPLETED') {
        styles = "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    }
    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border border-transparent ${styles}`}>
            {status}
        </span>
    );
}

export function getDuration(startDate?: Date, endDate?: Date): string {
    if (!startDate || !endDate) return '-';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
}

export function isPositiveStatus(status?: string): boolean {
    if (!status) return false;
    return status === LeaveStatus.APPROVED ||
        status === LeaveStatus.ACTIVE ||
        status === LeaveStatus.COMPLETED;
}

export function calculateRemainingLeaves(
    leaves: Leave[],
    employeeId: string,
    leaveType: LeaveType,
    selectedDate: string
): { remainingThisMonth: number; remainingThisYear: number; usedThisMonth: number; usedThisYear: number } {
    const date = new Date(selectedDate);
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const employeeLeaves = leaves.filter(
        leave => leave.employee?._id === employeeId &&
            leave.type?._id === leaveType._id &&
            isPositiveStatus(leave.status)
    );

    const usedThisMonth = employeeLeaves.filter(leave => {
        const leaveDate = new Date(leave.startDate!);
        return leaveDate.getMonth() === currentMonth && leaveDate.getFullYear() === currentYear;
    }).length;

    const usedThisYear = employeeLeaves.filter(leave => {
        const leaveDate = new Date(leave.startDate!);
        return leaveDate.getFullYear() === currentYear;
    }).length;

    const maxMonth = leaveType.maxPerMonth || 999;
    const maxYear = leaveType.maxPerYear || 999;

    return {
        remainingThisMonth: Math.max(0, maxMonth - usedThisMonth),
        remainingThisYear: Math.max(0, maxYear - usedThisYear),
        usedThisMonth,
        usedThisYear
    };
}

export function calculateTotalRemainingLeaves(
    leaves: Leave[],
    employeeId: string,
    leaveTypes: LeaveType[]
): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    let totalRemaining = 0;

    leaveTypes.forEach(type => {
        const maxYear = type.maxPerYear || 0;
        if (maxYear === 0) return;

        const usedThisYear = leaves.filter(leave =>
            leave.employee?._id === employeeId &&
            leave.type?._id === type._id &&
            isPositiveStatus(leave.status) &&
            new Date(leave.startDate!).getFullYear() === currentYear
        ).length;

        totalRemaining += Math.max(0, maxYear - usedThisYear);
    });

    return totalRemaining;
}
