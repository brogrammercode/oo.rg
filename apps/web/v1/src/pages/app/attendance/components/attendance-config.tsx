import { useEffect, useState } from 'react';
import { Modal } from '../../../../components/ui/modal';
import { Plus, Loader2, Pencil, Trash2, Clock, Timer } from 'lucide-react';
import type { ShiftType, BreakType } from '../../../../types/attendance';
import attendanceService from '../../../../services/attendance/attendance.service';
import { useOrgStore } from '../../../../stores/org';

interface ShiftTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
}

export function ShiftTypeModal({ isOpen, onClose, onRefresh }: ShiftTypeModalProps) {
    const { org } = useOrgStore();
    const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedShiftType, setSelectedShiftType] = useState<ShiftType | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start: '',
        end: '',
        lateGrace: 0,
        lateFinePerMin: 0,
        overtimePricePerMin: 0
    });

    const fetchShiftTypes = async () => {
        if (!org) return;
        try {
            const res = await attendanceService.getAllShiftTypes(org._id);
            setShiftTypes(res.data.data.shiftTypes);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchShiftTypes();
        }
    }, [isOpen]);

    const convertTimeToDate = (timeString: string): Date => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const handleCreate = async () => {
        if (!org) return;
        setActionLoading(true);
        try {
            const payload = {
                ...formData,
                start: formData.start ? convertTimeToDate(formData.start) : undefined,
                end: formData.end ? convertTimeToDate(formData.end) : undefined
            };
            await attendanceService.createShiftType(org._id, payload);
            setCreateModalOpen(false);
            setFormData({ name: '', description: '', start: '', end: '', lateGrace: 0, lateFinePerMin: 0, overtimePricePerMin: 0 });
            fetchShiftTypes();
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!org || !selectedShiftType) return;
        setActionLoading(true);
        try {
            const payload = {
                ...formData,
                start: formData.start ? convertTimeToDate(formData.start) : undefined,
                end: formData.end ? convertTimeToDate(formData.end) : undefined
            };
            await attendanceService.updateShiftType(org._id, selectedShiftType._id, payload);
            setEditModalOpen(false);
            setSelectedShiftType(null);
            fetchShiftTypes();
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!org || !selectedShiftType) return;
        setActionLoading(true);
        try {
            await attendanceService.deleteShiftType(org._id, selectedShiftType._id);
            setDeleteModalOpen(false);
            setSelectedShiftType(null);
            fetchShiftTypes();
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (shiftType: ShiftType) => {
        setSelectedShiftType(shiftType);
        setFormData({
            name: shiftType.name || '',
            description: shiftType.description || '',
            start: shiftType.start ? new Date(shiftType.start).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
            end: shiftType.end ? new Date(shiftType.end).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
            lateGrace: shiftType.lateGrace || 0,
            lateFinePerMin: shiftType.lateFinePerMin || 0,
            overtimePricePerMin: shiftType.overtimePricePerMin || 0
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (shiftType: ShiftType) => {
        setSelectedShiftType(shiftType);
        setDeleteModalOpen(true);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Shift Types">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-neutral-500">Manage shift types for your organization</p>
                        <button
                            onClick={() => {
                                setFormData({ name: '', description: '', start: '', end: '', lateGrace: 0, lateFinePerMin: 0, overtimePricePerMin: 0 });
                                setCreateModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                        >
                            <Plus size={16} />
                            Add Shift Type
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                        {shiftTypes.map((shiftType) => (
                            <div key={shiftType._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-neutral-400" />
                                        <h3 className="font-medium text-[#1a1a1a] dark:text-white">{shiftType.name}</h3>
                                    </div>
                                    {shiftType.description && (
                                        <p className="text-sm text-neutral-500 mt-1">{shiftType.description}</p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-500">
                                        {shiftType.start && shiftType.end && (
                                            <span>{new Date(shiftType.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(shiftType.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        )}
                                        {shiftType.lateGrace !== undefined && shiftType.lateGrace > 0 && (
                                            <span>Grace: {shiftType.lateGrace}min</span>
                                        )}
                                        {shiftType.lateFinePerMin !== undefined && shiftType.lateFinePerMin > 0 && (
                                            <span>Fine: ₹{shiftType.lateFinePerMin}/min</span>
                                        )}
                                        {shiftType.overtimePricePerMin !== undefined && shiftType.overtimePricePerMin > 0 && (
                                            <span>OT: ₹{shiftType.overtimePricePerMin}/min</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openEditModal(shiftType)}
                                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                    >
                                        <Pencil size={14} className="text-blue-600 dark:text-blue-400" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(shiftType)}
                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    >
                                        <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {shiftTypes.length === 0 && (
                            <p className="text-center text-neutral-500 py-8">No shift types found. Create one to get started.</p>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add Shift Type">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. Morning Shift"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={2}
                            placeholder="Brief description..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Start Time</label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                value={formData.start}
                                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">End Time</label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                value={formData.end}
                                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Late Grace (min)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                value={formData.lateGrace}
                                onChange={(e) => setFormData({ ...formData, lateGrace: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Fine (₹/min)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                step="0.01"
                                value={formData.lateFinePerMin}
                                onChange={(e) => setFormData({ ...formData, lateFinePerMin: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">OT Pay (₹/min)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                step="0.01"
                                value={formData.overtimePricePerMin}
                                onChange={(e) => setFormData({ ...formData, overtimePricePerMin: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:hover:text-white border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg whitespace-nowrap">Cancel</button>
                        <button onClick={handleCreate} disabled={actionLoading || !formData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2 whitespace-nowrap">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Create
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Shift Type">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Start Time</label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                value={formData.start}
                                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">End Time</label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                value={formData.end}
                                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Late Grace (min)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                value={formData.lateGrace}
                                onChange={(e) => setFormData({ ...formData, lateGrace: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Fine (₹/min)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                step="0.01"
                                value={formData.lateFinePerMin}
                                onChange={(e) => setFormData({ ...formData, lateFinePerMin: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">OT Pay (₹/min)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                                min="0"
                                step="0.01"
                                value={formData.overtimePricePerMin}
                                onChange={(e) => setFormData({ ...formData, overtimePricePerMin: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:hover:text-white border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg whitespace-nowrap">Cancel</button>
                        <button onClick={handleUpdate} disabled={actionLoading || !formData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2 whitespace-nowrap">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Update
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Shift Type">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete <strong>{selectedShiftType?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:hover:text-white border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg whitespace-nowrap">Cancel</button>
                        <button onClick={handleDelete} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2 whitespace-nowrap">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

interface BreakTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
}

export function BreakTypeModal({ isOpen, onClose, onRefresh }: BreakTypeModalProps) {
    const { org } = useOrgStore();
    const [breakTypes, setBreakTypes] = useState<BreakType[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedBreakType, setSelectedBreakType] = useState<BreakType | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 0
    });

    const fetchBreakTypes = async () => {
        if (!org) return;
        try {
            const res = await attendanceService.getAllBreakTypes(org._id);
            setBreakTypes(res.data.data.breakTypes);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchBreakTypes();
        }
    }, [isOpen]);

    const handleCreate = async () => {
        if (!org) return;
        setActionLoading(true);
        try {
            await attendanceService.createBreakType(org._id, formData);
            setCreateModalOpen(false);
            setFormData({ name: '', description: '', duration: 0 });
            fetchBreakTypes();
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!org || !selectedBreakType) return;
        setActionLoading(true);
        try {
            await attendanceService.updateBreakType(org._id, selectedBreakType._id, formData);
            setEditModalOpen(false);
            setSelectedBreakType(null);
            fetchBreakTypes();
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!org || !selectedBreakType) return;
        setActionLoading(true);
        try {
            await attendanceService.deleteBreakType(org._id, selectedBreakType._id);
            setDeleteModalOpen(false);
            setSelectedBreakType(null);
            fetchBreakTypes();
            onRefresh();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (breakType: BreakType) => {
        setSelectedBreakType(breakType);
        setFormData({
            name: breakType.name || '',
            description: breakType.description || '',
            duration: breakType.duration || 0
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (breakType: BreakType) => {
        setSelectedBreakType(breakType);
        setDeleteModalOpen(true);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Break Types">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-neutral-500">Manage break types for your organization</p>
                        <button
                            onClick={() => {
                                setFormData({ name: '', description: '', duration: 0 });
                                setCreateModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                        >
                            <Plus size={16} />
                            Add Break Type
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                        {breakTypes.map((breakType) => (
                            <div key={breakType._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Timer size={16} className="text-neutral-400" />
                                        <h3 className="font-medium text-[#1a1a1a] dark:text-white">{breakType.name}</h3>
                                    </div>
                                    {breakType.description && (
                                        <p className="text-sm text-neutral-500 mt-1">{breakType.description}</p>
                                    )}
                                    {breakType.duration !== undefined && breakType.duration > 0 && (
                                        <p className="text-xs text-neutral-500 mt-1">{breakType.duration} minutes</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openEditModal(breakType)}
                                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                    >
                                        <Pencil size={14} className="text-blue-600 dark:text-blue-400" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(breakType)}
                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    >
                                        <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {breakTypes.length === 0 && (
                            <p className="text-center text-neutral-500 py-8">No break types found. Create one to get started.</p>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add Break Type">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. Lunch Break"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={2}
                            placeholder="Brief description..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Duration (minutes)</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            min="0"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:hover:text-white border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg whitespace-nowrap">Cancel</button>
                        <button onClick={handleCreate} disabled={actionLoading || !formData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2 whitespace-nowrap">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Create
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Break Type">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Duration (minutes)</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            min="0"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:hover:text-white border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg whitespace-nowrap">Cancel</button>
                        <button onClick={handleUpdate} disabled={actionLoading || !formData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2 whitespace-nowrap">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Update
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Break Type">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete <strong>{selectedBreakType?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:hover:text-white border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg whitespace-nowrap">Cancel</button>
                        <button onClick={handleDelete} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2 whitespace-nowrap">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
