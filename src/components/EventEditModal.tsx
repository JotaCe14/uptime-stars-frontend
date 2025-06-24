'use client';
import { useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (data: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues?: any;
}

export const EventEditModal = ({ isOpen, onClose, onSave, defaultValues }: Props) => {
    const [form, setForm] = useState({
        falsePositive: defaultValues?.falsePositive || false,
        category: defaultValues?.category || null,
        note: defaultValues?.note || '',
        maintenanceType: defaultValues?.maintenanceType || null,
        ticketId: defaultValues?.ticketId || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            // Solo HTMLInputElement tiene checked
            setForm(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
                <h2 className="text-lg font-bold mb-4 text-gray-500">Edit event</h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-gray-500">
                    <label className="block">
                        <input
                            type="checkbox"
                            name="falsePositive"
                            checked={form.falsePositive}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        False positive?
                    </label>

                    <div>
                        <label className="block">Category</label>
                        <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded p-2">
                            <option value="">-- Select --</option>
                            <option value="0">Internal</option>
                            <option value="1">External</option>
                        </select>
                    </div>

                    <div>
                        <label className="block">Note</label>
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block">Ticket code</label>
                        <input
                            type="text"
                            name="ticketId"
                            value={form.ticketId}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block">Maintenance type</label>
                        <select
                            name="maintenanceType"
                            value={form.maintenanceType}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        >
                            <option value="">-- Select --</option>
                            <option value="0">Planned</option>
                            <option value="1">Emergency</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};