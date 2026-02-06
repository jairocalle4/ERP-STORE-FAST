import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import type { Client, ClientCreateDto } from '../../services/client.service';

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ClientCreateDto) => Promise<void>;
    initialData?: Client | null;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<ClientCreateDto>({
        name: '',
        cedulaRuc: '',
        phone: '',
        address: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                cedulaRuc: initialData.cedulaRuc,
                phone: initialData.phone,
                address: initialData.address,
                email: initialData.email
            });
        } else {
            setFormData({
                name: '',
                cedulaRuc: '',
                phone: '',
                address: '',
                email: ''
            });
        }
        setError(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation: Cédula / RUC (10 or 13 digits)
        const cedulaRuc = formData.cedulaRuc || '';
        if (!/^\d{10}(\d{3})?$/.test(cedulaRuc)) {
            setError('La Identificación debe tener 10 dígitos (Cédula) o 13 dígitos (RUC)');
            return;
        }

        // Validation: Phone (10 digits)
        const phone = formData.phone || '';
        if (!/^\d{10}$/.test(phone)) {
            setError('El Teléfono debe tener exactamente 10 dígitos numéricos');
            return;
        }

        // Validation: Email (Optional but must be valid if present)
        const email = formData.email || '';
        if (email && !validateEmail(email)) {
            setError('El formato del correo electrónico no es válido');
            return;
        }

        setIsLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al guardar el cliente');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-[2px] animate-fade-in">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-scale-in border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {initialData ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Cédula / RUC</label>
                        <input
                            type="text"
                            required
                            value={formData.cedulaRuc}
                            onChange={e => setFormData({ ...formData, cedulaRuc: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                            placeholder="Ej: 0999999999 o 0999999999001"
                            maxLength={13}
                            title="10 dígitos para Cédula o 13 para RUC"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                            <input
                                type="text"
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                                placeholder="Ej: 0991234567"
                                maxLength={10}
                                title="Debe tener 10 dígitos"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                                placeholder="juan@mail.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Dirección</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                            placeholder="Calle Principal 123"
                        />
                    </div>

                    <div className="pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 text-slate-400 hover:text-slate-600 font-bold transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            {initialData ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientFormModal;
