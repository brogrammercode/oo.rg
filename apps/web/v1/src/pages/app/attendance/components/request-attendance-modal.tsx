import { useState } from 'react';
import { Modal } from '../../../../components/ui/modal';
import { Loader2 } from 'lucide-react';
import { getLocalDateString } from '../../../../utils/date';
import { AttendanceStatus } from '../../../../constants/attendance';
import type { ShiftType } from '../../../../types/attendance';

interface RequestAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        date: string;
        checkIn: string;
        checkOut?: string;
        status: string;
        shiftType?: string;
        notes: string;
    }) => Promise<void>;
    shiftTypes: ShiftType[];
}

export function RequestAttendanceModal({ isOpen, onClose, onSubmit, shiftTypes }: RequestAttendanceModalProps) {
    const [formData, setFormData] = useState({
        date: getLocalDateString(),
        checkIn: '',
        checkOut: '',
        status: String(AttendanceStatus.REQUESTED),
        shiftType: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.date || !formData.checkIn || !formData.notes) return;

        setLoading(true);
        try {
            await onSubmit({
                date: formData.date,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut || undefined,
                status: formData.status,
                shiftType: formData.shiftType || undefined,
                notes: formData.notes
            });
            setFormData({
                date: getLocalDateString(),
                checkIn: '',
                checkOut: '',
                status: AttendanceStatus.REQUESTED,
                shiftType: '',
                notes: ''
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request Attendance">
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.date}
                            max={getLocalDateString()}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Check Out (Optional)</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.checkOut}
                            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        />
                    </div>
                </div>

                {shiftTypes.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Shift (Optional)</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.shiftType}
                            onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                        >
                            <option value="">No shift</option>
                            {shiftTypes.map(shift => (
                                <option key={shift._id} value={shift._id}>{shift.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Reason</label>
                    <textarea
                        className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 resize-none"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Please explain why you're requesting this attendance..."
                    />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:hover:text-white border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg whitespace-nowrap"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.date || !formData.checkIn || !formData.notes}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2 whitespace-nowrap"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Submit Request
                    </button>
                </div>
            </div>
        </Modal>
    );
}
