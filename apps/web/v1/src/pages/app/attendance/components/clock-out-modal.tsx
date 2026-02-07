import { useState } from 'react';
import { Modal } from '../../../../components/ui/modal';
import { Loader2 } from 'lucide-react';
import type { Attendance, Break } from '../../../../types/attendance';
import { AttendanceDetails } from './attendance-details';
import { BreaksSummary } from './breaks-summary';

interface ClockOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (notes: string) => Promise<void>;
    attendance: Attendance;
    breaks: Break[];
}

export function ClockOutModal({ isOpen, onClose, onConfirm, attendance, breaks }: ClockOutModalProps) {
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm(notes);
            setNotes('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Clock Out Confirmation">
            <div className="flex flex-col gap-4">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Attendance Summary</h3>
                        <div className="p-3 bg-gray-50 dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg">
                            <AttendanceDetails attendance={attendance} />
                        </div>
                    </div>

                    {breaks && breaks.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Breaks</h3>
                            <div className="p-3 bg-gray-50 dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg">
                                <BreaksSummary breaks={breaks} />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 resize-none"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about your workday..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:hover:text-white border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg whitespace-nowrap"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2 whitespace-nowrap"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Clock Out
                    </button>
                </div>
            </div>
        </Modal>
    );
}
