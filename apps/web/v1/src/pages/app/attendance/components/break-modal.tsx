import { Modal } from '../../../../components/ui/modal';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { BreakType } from '../../../../types/attendance';

interface BreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { type: string; start: string; end?: string }) => Promise<void>;
    breakTypes: BreakType[];
    initialData?: {
        type?: string;
        start?: string;
        end?: string;
    };
}

export function BreakModal({ isOpen, onClose, onSubmit, breakTypes, initialData }: BreakModalProps) {
    const [formData, setFormData] = useState({
        type: '',
        start: '',
        end: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                type: initialData.type || '',
                start: initialData.start || '',
                end: initialData.end || ''
            });
        } else if (isOpen) {
            setFormData({ type: '', start: '', end: '' });
        }
    }, [isOpen, initialData]);

    const handleSubmit = async () => {
        if (!formData.type) return;
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Break' : 'Add Break'}>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Break Type</label>
                    <select
                        className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="">Select break type</option>
                        {breakTypes.map((bt) => (
                            <option key={bt._id} value={bt._id}>
                                {bt.name} {bt.duration ? `(${bt.duration} min)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Start Time</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.start}
                            onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">End Time</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.end}
                            onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:hover:text-white border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg whitespace-nowrap">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={loading || !formData.type} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2 whitespace-nowrap">
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {initialData ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
