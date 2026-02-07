import {
    MoreHorizontal,
    Plus,
    Loader2,
    Calendar,
    FileText,
    Trash2,
    Pencil,
    Tag,
    CalendarDays
} from 'lucide-react';
import { useEffect, useState } from 'react';
import leaveService from '../../../services/leave/leave.service';
import orgService from '../../../services/org/org.service';
import { useOrgStore } from '../../../stores/org';
import { usePermission } from '../../../hooks/usePermission';
import { Permissions } from '../../../constants/org';
import type { Leave, LeaveType } from '../../../types/leave';
import type { Employee } from '../../../types/org';
import Avatar from '../../../components/ui/avatar';
import { Dropdown, DropdownItem } from '../../../components/ui/dropdown';
import { Modal } from '../../../components/ui/modal';
import { LeaveStatus } from '../../../constants/leave';
import { LeaveFormModal, StatusBadge, getDuration } from './leave-components';
import { toLocalDateString } from '../../../utils/date';
import { CalendarView } from '../../../components/ui/calendar-view';
import { PermissionGuard } from '../../../components/guards/permission-guard';

export default function LeaveList() {
    const { org } = useOrgStore();
    const { hasPermission } = usePermission();
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const [leaveTypesModalOpen, setLeaveTypesModalOpen] = useState(false);
    const [createLeaveTypeModalOpen, setCreateLeaveTypeModalOpen] = useState(false);
    const [editLeaveTypeModalOpen, setEditLeaveTypeModalOpen] = useState(false);
    const [deleteLeaveTypeModalOpen, setDeleteLeaveTypeModalOpen] = useState(false);

    const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
    const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);

    const [editFormData, setEditFormData] = useState({
        type: '',
        startDate: '',
        endDate: '',
        reason: '',
        status: LeaveStatus.PENDING
    });

    const [leaveTypeFormData, setLeaveTypeFormData] = useState({
        name: '',
        description: '',
        color: '#3b82f6',
        maxPerMonth: 0,
        maxPerYear: 0,
        isPaid: false
    });

    const [actionLoading, setActionLoading] = useState(false);
    const [calendarModalOpen, setCalendarModalOpen] = useState(false);
    const [selectedEmployeeLeaves, setSelectedEmployeeLeaves] = useState<Leave[]>([]);

    const fetchLeaves = async () => {
        if (!org) return;
        try {
            const res = await leaveService.getAllLeaves(org._id);
            const sortedLeaves = res.data.data.leave.sort((a: Leave, b: Leave) => {
                const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                return dateB - dateA;
            });
            setLeaves(sortedLeaves);
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

    const fetchEmployees = async () => {
        if (!org) return;
        try {
            const res = await orgService.getAllEmployees(org._id);
            setEmployees(res.data.data.employees);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
        fetchLeaveTypes();
        fetchEmployees();
    }, [org]);

    const handleCreateLeave = async (formData: {
        employee?: string;
        type: string;
        startDate: string;
        endDate: string;
        reason: string;
    }) => {
        if (!org) return;
        await leaveService.createLeave(org._id, formData);
        setCreateModalOpen(false);
        fetchLeaves();
    };

    const handleUpdateLeave = async () => {
        if (!selectedLeave) return;
        setActionLoading(true);
        try {
            await leaveService.updateLeave(selectedLeave._id, editFormData);
            setEditModalOpen(false);
            fetchLeaves();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteLeave = async () => {
        if (!selectedLeave) return;
        setActionLoading(true);
        try {
            await leaveService.deleteLeave(selectedLeave._id);
            setDeleteModalOpen(false);
            fetchLeaves();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateLeaveType = async () => {
        if (!org) return;
        setActionLoading(true);
        try {
            await leaveService.createLeaveType(org._id, leaveTypeFormData);
            setCreateLeaveTypeModalOpen(false);
            setLeaveTypeFormData({
                name: '',
                description: '',
                color: '#3b82f6',
                maxPerMonth: 0,
                maxPerYear: 0,
                isPaid: false
            });
            fetchLeaveTypes();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateLeaveType = async () => {
        if (!org || !selectedLeaveType) return;
        setActionLoading(true);
        try {
            await leaveService.updateLeaveType(org._id, selectedLeaveType._id, leaveTypeFormData);
            setEditLeaveTypeModalOpen(false);
            fetchLeaveTypes();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteLeaveType = async () => {
        if (!org || !selectedLeaveType) return;
        setActionLoading(true);
        try {
            await leaveService.deleteLeaveType(org._id, selectedLeaveType._id);
            setDeleteLeaveTypeModalOpen(false);
            fetchLeaveTypes();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (leave: Leave) => {
        setSelectedLeave(leave);
        setEditFormData({
            type: leave.type?._id || '',
            startDate: leave.startDate ? toLocalDateString(leave.startDate) : '',
            endDate: leave.endDate ? toLocalDateString(leave.endDate) : '',
            reason: leave.reason || '',
            status: leave.status || 'PENDING'
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (leave: Leave) => {
        setSelectedLeave(leave);
        setDeleteModalOpen(true);
    };

    const openViewModal = (leave: Leave) => {
        setSelectedLeave(leave);
        setViewModalOpen(true);
    };

    const openEditLeaveTypeModal = (leaveType: LeaveType) => {
        setSelectedLeaveType(leaveType);
        setLeaveTypeFormData({
            name: leaveType.name || '',
            description: leaveType.description || '',
            color: leaveType.color || '#3b82f6',
            maxPerMonth: leaveType.maxPerMonth || 0,
            maxPerYear: leaveType.maxPerYear || 0,
            isPaid: leaveType.isPaid || false
        });
        setEditLeaveTypeModalOpen(true);
    };

    const openDeleteLeaveTypeModal = (leaveType: LeaveType) => {
        setSelectedLeaveType(leaveType);
        setDeleteLeaveTypeModalOpen(true);
    };

    const openCalendarView = async (employeeId: string) => {
        try {
            const res = await leaveService.getMyLeaves(employeeId);
            setSelectedEmployeeLeaves(Array.isArray(res.data.data.leave) ? res.data.data.leave : [res.data.data.leave]);
            setCalendarModalOpen(true);
        } catch (error) {
            console.error(error);
        }
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
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">Leaves</h1>
                    <p className="mt-2 text-neutral-500 max-w-2xl">
                        Manage employee leave requests and approvals.
                    </p>
                </div>
                <div className="flex gap-2">
                    {hasPermission(Permissions.READ_LEAVE_TYPE) && (
                        <button
                            onClick={() => setLeaveTypesModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] hover:bg-gray-50 dark:hover:bg-[#252525] text-[#1a1a1a] dark:text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Tag size={16} />
                            Leave Types
                        </button>
                    )}
                    {hasPermission(Permissions.CREATE_LEAVE) && (
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            New Leave
                        </button>
                    )}
                </div>
            </header>

            <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg overflow-hidden bg-white dark:bg-[#191919] shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-[#2F2F2F] bg-gray-50/50 dark:bg-zinc-800/20">
                            <th className="py-3 px-4 font-medium text-neutral-500 w-[25%]">Employee</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Type</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Start Date</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">End Date</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Duration</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Status</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2F2F2F]">
                        {leaves.map((leave) => (
                            <tr key={leave._id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            initials={leave.employee?.user?.name?.substring(0, 2).toUpperCase()}
                                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 w-8 h-8"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[#1a1a1a] dark:text-white">{leave.employee?.user?.name}</span>
                                            <span className="text-xs text-neutral-400">{leave.employee?.post?.name || 'No Post'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: leave.type?.color || '#3b82f6' }}
                                        />
                                        <span className="text-neutral-600 dark:text-neutral-300">{leave.type?.name || '-'}</span>
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
                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                                    {getDuration(leave.startDate, leave.endDate)}
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={leave.status || 'PENDING'} />
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <Dropdown
                                        trigger={
                                            <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        }
                                        align="right"
                                    >
                                        <DropdownItem icon={CalendarDays} label="View Calendar" onClick={() => openCalendarView(leave.employee?._id || '')} />
                                        <DropdownItem icon={FileText} label="View Details" onClick={() => openViewModal(leave)} />
                                        <PermissionGuard permission={Permissions.UPDATE_LEAVE}>
                                            <DropdownItem icon={Pencil} label="Edit" onClick={() => openEditModal(leave)} />
                                        </PermissionGuard>
                                        <PermissionGuard permission={Permissions.DELETE_LEAVE}>
                                            <DropdownItem icon={Trash2} label="Delete" danger onClick={() => openDeleteModal(leave)} />
                                        </PermissionGuard>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                        {leaves.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-neutral-500">
                                    No leave requests found. Create one to get started.
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
                employees={employees}
                leaves={leaves}
                title="New Leave Request"
                submitLabel="Submit Request"
                showEmployeeSelect={true}
                showStatusSelect={false}
            />

            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Leave Request">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Leave Type</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={editFormData.type}
                            onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                        >
                            <option value="">Select leave type</option>
                            {leaveTypes.map(type => (
                                <option key={type._id} value={type._id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Start Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                value={editFormData.startDate}
                                onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">End Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                value={editFormData.endDate}
                                onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Reason</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={3}
                            value={editFormData.reason}
                            onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={editFormData.status}
                            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="ACTIVE">Active</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleUpdateLeave} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Leave Details">
                {selectedLeave && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-[#E5E7EB] dark:border-[#2F2F2F]">
                            <Avatar
                                initials={selectedLeave.employee?.user?.name?.substring(0, 2).toUpperCase()}
                                className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 w-12 h-12"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-white">{selectedLeave.employee?.user?.name}</h3>
                                <p className="text-sm text-neutral-500">{selectedLeave.employee?.post?.name || 'No Post'}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">Leave Type</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: selectedLeave.type?.color || '#3b82f6' }}
                                    />
                                    <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">{selectedLeave.type?.name}</span>
                                    {selectedLeave.type?.isPaid && (
                                        <span className="text-xs text-green-600 dark:text-green-400">(Paid)</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">Start Date</span>
                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                                    {selectedLeave.startDate ? new Date(selectedLeave.startDate).toLocaleDateString() : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">End Date</span>
                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                                    {selectedLeave.endDate ? new Date(selectedLeave.endDate).toLocaleDateString() : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">Duration</span>
                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                                    {getDuration(selectedLeave.startDate, selectedLeave.endDate)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">Status</span>
                                <StatusBadge status={selectedLeave.status || 'PENDING'} />
                            </div>
                            {selectedLeave.reason && (
                                <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#2F2F2F]">
                                    <span className="text-sm text-neutral-500 block mb-2">Reason</span>
                                    <p className="text-sm text-[#1a1a1a] dark:text-white">{selectedLeave.reason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Leave Request">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete this leave request for <strong>{selectedLeave?.employee?.user?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleDeleteLeave} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Delete Leave
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={leaveTypesModalOpen} onClose={() => setLeaveTypesModalOpen(false)} title="Leave Types">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        {hasPermission(Permissions.CREATE_LEAVE_TYPE) && (
                            <button
                                onClick={() => {
                                    setLeaveTypeFormData({
                                        name: '',
                                        description: '',
                                        color: '#3b82f6',
                                        maxPerMonth: 0,
                                        maxPerYear: 0,
                                        isPaid: false
                                    });
                                    setCreateLeaveTypeModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Plus size={16} />
                                Add Leave Type
                            </button>
                        )}
                    </div>
                    <div className="space-y-2">
                        {leaveTypes.map((type) => (
                            <div key={type._id} className="group flex items-center justify-between p-3 border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <div className="flex items-center gap-3 flex-1">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: type.color || '#3b82f6' }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-[#1a1a1a] dark:text-white">{type.name}</h4>
                                            {type.isPaid && (
                                                <span className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded">Paid</span>
                                            )}
                                        </div>
                                        {type.description && (
                                            <p className="text-xs text-neutral-500 mt-0.5">{type.description}</p>
                                        )}
                                        <div className="flex gap-3 mt-1 text-xs text-neutral-500">
                                            {type.maxPerMonth! > 0 && <span>Max/Month: {type.maxPerMonth}</span>}
                                            {type.maxPerYear! > 0 && <span>Max/Year: {type.maxPerYear}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {hasPermission(Permissions.UPDATE_LEAVE_TYPE) && (
                                        <button
                                            onClick={() => openEditLeaveTypeModal(type)}
                                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
                                        >
                                            <Pencil size={14} className="text-neutral-600 dark:text-neutral-400" />
                                        </button>
                                    )}
                                    {hasPermission(Permissions.DELETE_LEAVE_TYPE) && (
                                        <button
                                            onClick={() => openDeleteLeaveTypeModal(type)}
                                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {leaveTypes.length === 0 && (
                            <p className="text-center text-neutral-500 py-8">No leave types found. Create one to get started.</p>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={createLeaveTypeModalOpen} onClose={() => setCreateLeaveTypeModalOpen(false)} title="Add Leave Type">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. Sick Leave"
                            value={leaveTypeFormData.name}
                            onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={2}
                            placeholder="Brief description..."
                            value={leaveTypeFormData.description}
                            onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Color</label>
                            <input
                                type="color"
                                className="w-full h-10 px-1 py-1 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg cursor-pointer"
                                value={leaveTypeFormData.color}
                                onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, color: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="isPaid"
                                className="w-4 h-4 rounded border-gray-300"
                                checked={leaveTypeFormData.isPaid}
                                onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, isPaid: e.target.checked })}
                            />
                            <label htmlFor="isPaid" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Is Paid</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Max Per Month</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                value={leaveTypeFormData.maxPerMonth}
                                onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, maxPerMonth: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Max Per Year</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                value={leaveTypeFormData.maxPerYear}
                                onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, maxPerYear: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setCreateLeaveTypeModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleCreateLeaveType} disabled={actionLoading || !leaveTypeFormData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Create Leave Type
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={editLeaveTypeModalOpen} onClose={() => setEditLeaveTypeModalOpen(false)} title="Edit Leave Type">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={leaveTypeFormData.name}
                            onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={2}
                            value={leaveTypeFormData.description}
                            onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Color</label>
                            <input
                                type="color"
                                className="w-full h-10 px-1 py-1 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg cursor-pointer"
                                value={leaveTypeFormData.color}
                                onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, color: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="isPaidEdit"
                                className="w-4 h-4 rounded border-gray-300"
                                checked={leaveTypeFormData.isPaid}
                                onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, isPaid: e.target.checked })}
                            />
                            <label htmlFor="isPaidEdit" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Is Paid</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Max Per Month</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                value={leaveTypeFormData.maxPerMonth}
                                onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, maxPerMonth: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Max Per Year</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                value={leaveTypeFormData.maxPerYear}
                                onChange={(e) => setLeaveTypeFormData({ ...leaveTypeFormData, maxPerYear: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditLeaveTypeModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleUpdateLeaveType} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteLeaveTypeModalOpen} onClose={() => setDeleteLeaveTypeModalOpen(false)} title="Delete Leave Type">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete the leave type <strong>{selectedLeaveType?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setDeleteLeaveTypeModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleDeleteLeaveType} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Delete Leave Type
                        </button>
                    </div>
                </div>
            </Modal>

            <CalendarView
                isOpen={calendarModalOpen}
                onClose={() => setCalendarModalOpen(false)}
                title="Employee Leave Calendar"
                data={selectedEmployeeLeaves}
                dateField="startDate"
                renderDay={(day) => {
                    const leave = selectedEmployeeLeaves.find(l => {
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
        </div>
    );
}
