import {
    MoreHorizontal,
    Plus,
    Loader2,
    Calendar,
    Clock,
    Trash2,
    Pencil,
    CalendarDays
} from 'lucide-react';
import { useEffect, useState } from 'react';
import attendanceService from '../../../services/attendance/attendance.service';
import orgService from '../../../services/org/org.service';
import { useOrgStore } from '../../../stores/org';
import type { Attendance } from '../../../types/attendance';
import type { Employee } from '../../../types/org';
import Avatar from '../../../components/ui/avatar';
import { Dropdown, DropdownItem } from '../../../components/ui/dropdown';
import { Modal } from '../../../components/ui/modal';
import { AttendanceStatus } from '../../../constants/attendance';
import { getLocalDateString, toLocalDateString, toLocalDateTimeString } from '../../../utils/date';
import { CalendarView } from '../../../components/ui/calendar-view';
import { AttendanceStatusBadge } from './attendance-components';
import { PermissionGuard } from '../../../components/guards/permission-guard';
import { Permissions } from '../../../constants/org';

const StatusBadge = ({ status }: { status: string }) => {
    let styles = "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400";
    if (status === 'PRESENT') {
        styles = "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    } else if (status === 'ABSENT') {
        styles = "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    } else if (status === 'LATE') {
        styles = "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    } else if (status === 'HOLIDAY') {
        styles = "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    } else if (status === 'LEAVE') {
        styles = "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    } else if (status === 'OVERTIME') {
        styles = "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
    }
    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border border-transparent ${styles}`}>
            {status}
        </span>
    );
};

export default function AttendanceList() {
    const { org } = useOrgStore();
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
    const [formData, setFormData] = useState({
        employeeId: '',
        date: getLocalDateString(),
        status: 'PRESENT',
        checkIn: '',
        checkOut: ''
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [calendarModalOpen, setCalendarModalOpen] = useState(false);
    const [selectedEmployeeAttendance, setSelectedEmployeeAttendance] = useState<Attendance[]>([]);

    const fetchAttendance = async () => {
        if (!org) return;
        try {
            const res = await attendanceService.getAllAttendance(org._id);
            const sortedAttendance = res.data.data.attendance.sort((a: Attendance, b: Attendance) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            });
            setAttendance(sortedAttendance);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
        fetchAttendance();
        fetchEmployees();
    }, [org]);

    const handleCreateAttendance = async () => {
        if (!org) return;
        setActionLoading(true);
        try {
            await attendanceService.createAttendance(org._id, formData.employeeId, {
                date: formData.date,
                status: formData.status,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut
            });
            setCreateModalOpen(false);
            setFormData({
                employeeId: '',
                date: getLocalDateString(),
                status: AttendanceStatus.PRESENT,
                checkIn: '',
                checkOut: ''
            });
            fetchAttendance();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateAttendance = async () => {
        if (!selectedAttendance) return;
        setActionLoading(true);
        try {
            await attendanceService.updateAttendance(selectedAttendance._id, {
                date: formData.date,
                status: formData.status,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut
            });
            setEditModalOpen(false);
            fetchAttendance();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAttendance = async () => {
        if (!selectedAttendance) return;
        setActionLoading(true);
        try {
            await attendanceService.deleteAttendance(selectedAttendance._id);
            setDeleteModalOpen(false);
            fetchAttendance();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (att: Attendance) => {
        setSelectedAttendance(att);
        setFormData({
            employeeId: att.employee?._id || '',
            date: att.date ? toLocalDateString(att.date) : '',
            status: att.status || 'PRESENT',
            checkIn: att.checkIn ? toLocalDateTimeString(att.checkIn) : '',
            checkOut: att.checkOut ? toLocalDateTimeString(att.checkOut) : ''
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (att: Attendance) => {
        setSelectedAttendance(att);
        setDeleteModalOpen(true);
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const openCalendarView = async (employeeId: string) => {
        try {
            const res = await attendanceService.getAttendance(employeeId);
            setSelectedEmployeeAttendance(Array.isArray(res.data.data.attendance) ? res.data.data.attendance : [res.data.data.attendance]);
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
                    <h1 className="text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">Attendance</h1>
                    <p className="mt-2 text-neutral-500 max-w-2xl">
                        Track and manage employee attendance records.
                    </p>
                </div>
                <PermissionGuard permission={Permissions.CREATE_ALL_ATTENDANCE}>
                    <button
                        onClick={() => {
                            setFormData({
                                employeeId: '',
                                date: getLocalDateString(),
                                status: 'PRESENT',
                                checkIn: '',
                                checkOut: ''
                            });
                            setCreateModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Add Attendance
                    </button>
                </PermissionGuard>
            </header>

            <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg overflow-hidden bg-white dark:bg-[#191919] shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-[#2F2F2F] bg-gray-50/50 dark:bg-zinc-800/20">
                            <th className="py-3 px-4 font-medium text-neutral-500 w-[30%]">Employee</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Date</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Status</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Check In</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Check Out</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Duration</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2F2F2F]">
                        {attendance.map((att) => (
                            <tr key={att._id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            initials={att.employee?.user?.name?.substring(0, 2).toUpperCase()}
                                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 w-8 h-8"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[#1a1a1a] dark:text-white">{att.employee?.user?.name}</span>
                                            <span className="text-xs text-neutral-400">{att.employee?.post?.name || 'No Post'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Calendar size={14} className="text-neutral-400" />
                                        <span>{att.date ? new Date(att.date).toLocaleDateString() : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={att.status || 'PRESENT'} />
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Clock size={14} className="text-neutral-400" />
                                        <span>{att.checkIn ? new Date(att.checkIn).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Clock size={14} className="text-neutral-400" />
                                        <span>{att.checkOut ? new Date(att.checkOut).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                                    {att.duration ? formatDuration(att.duration) : '-'}
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
                                        <DropdownItem icon={CalendarDays} label="View Calendar" onClick={() => openCalendarView(att.employee?._id || '')} />
                                        <PermissionGuard permission={Permissions.UPDATE_ATTENDANCE}>
                                            <DropdownItem icon={Pencil} label="Edit" onClick={() => openEditModal(att)} />
                                        </PermissionGuard>
                                        <PermissionGuard permission={Permissions.DELETE_ATTENDANCE}>
                                            <DropdownItem icon={Trash2} label="Delete" danger onClick={() => openDeleteModal(att)} />
                                        </PermissionGuard>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                        {attendance.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-neutral-500">
                                    No attendance records found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add Attendance">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Employee</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        >
                            <option value="">Select employee</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.user?.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LATE">Late</option>
                            <option value="HOLIDAY">Holiday</option>
                            <option value="LEAVE">Leave</option>
                            <option value="OVERTIME">Overtime</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Check In</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.checkIn}
                            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Check Out</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.checkOut}
                            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleCreateAttendance} disabled={actionLoading || !formData.employeeId} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Add Attendance
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Attendance">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Employee</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm"
                            value={selectedAttendance?.employee?.user?.name || ''}
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LATE">Late</option>
                            <option value="HOLIDAY">Holiday</option>
                            <option value="LEAVE">Leave</option>
                            <option value="OVERTIME">Overtime</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Check In</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.checkIn}
                            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Check Out</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.checkOut}
                            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleUpdateAttendance} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Attendance">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete the attendance record for <strong>{selectedAttendance?.employee?.user?.name}</strong> on <strong>{selectedAttendance?.date ? new Date(selectedAttendance.date).toLocaleDateString() : ''}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleDeleteAttendance} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Delete Attendance
                        </button>
                    </div>
                </div>
            </Modal>

            <CalendarView
                isOpen={calendarModalOpen}
                onClose={() => setCalendarModalOpen(false)}
                title="Employee Attendance Calendar"
                data={selectedEmployeeAttendance}
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
