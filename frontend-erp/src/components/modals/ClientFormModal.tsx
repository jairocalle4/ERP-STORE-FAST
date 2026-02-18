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
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                cedulaRuc: initialData.cedulaRuc,
                phone: initialData.phone,
                address: initialData.address,
                email: initialData.email
            });
            setErrors({});
        } else {
            setFormData({
                name: '',
                cedulaRuc: '',
                phone: '',
                address: '',
                email: ''
            });
            setErrors({});
        }
    }, [initialData, isOpen]);

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!value.trim()) error = 'El nombre es obligatorio';
                else if (value.trim().length < 3) error = 'Mínimo 3 caracteres';
                break;
            case 'cedulaRuc':
                if (!value) error = 'La identificación es obligatoria';
                else if (!/^\d+$/.test(value)) error = 'Solo se permiten números';
                else if (value.length !== 10 && value.length !== 13)
                    error = 'Debe tener 10 dígitos (Cédula) o 13 (RUC)';
                break;
            case 'phone':
                if (!value) error = 'El teléfono es obligatorio';
                else if (!/^\d+$/.test(value)) error = 'Solo números';
                else if (value.length !== 10) error = 'Debe tener exactamente 10 dígitos';
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    error = 'Email con formato inválido';
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Restriction for numeric-only fields
        if ((name === 'cedulaRuc' || name === 'phone') && value !== '' && !/^\d+$/.test(value)) {
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Global validation check
        const isNameValid = validateField('name', formData.name);
        const isIdValid = validateField('cedulaRuc', formData.cedulaRuc || '');
        const isPhoneValid = validateField('phone', formData.phone || '');
        const isEmailValid = validateField('email', formData.email || '');

        if (!isNameValid || !isIdValid || !isPhoneValid || !isEmailValid) {
            return;
        }

        setIsLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setErrors(prev => ({ ...prev, form: err.message || 'Error al guardar el cliente' }));
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

                {errors.form && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium animate-shake">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.name ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5'} rounded-2xl focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
                            placeholder="Ej: Juan Pérez"
                        />
                        {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 animate-fade-in">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Cédula / RUC <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            name="cedulaRuc"
                            required
                            value={formData.cedulaRuc}
                            onChange={handleChange}
                            className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.cedulaRuc ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5'} rounded-2xl focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
                            placeholder="Ej: 0999999999 o 0999999999001"
                            maxLength={13}
                        />
                        {errors.cedulaRuc && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 animate-fade-in">{errors.cedulaRuc}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Teléfono <span className="text-rose-500">*</span></label>
                            <input
                                type="text"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.phone ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5'} rounded-2xl focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
                                placeholder="Ej: 0991234567"
                                maxLength={10}
                            />
                            {errors.phone && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 animate-fade-in">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-5 py-3.5 bg-slate-50 border ${errors.email ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5'} rounded-2xl focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium`}
                                placeholder="juan@mail.com"
                            />
                            {errors.email && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 animate-fade-in">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Dirección</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
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
