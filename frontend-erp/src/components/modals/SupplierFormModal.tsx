import { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Hash, Save, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { supplierService, type Supplier } from '../../services/supplier.service';
import { useNotificationStore } from '../../store/useNotificationStore';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    supplier?: Supplier | null;
}

export function SupplierFormModal({ isOpen, onClose, onSuccess, supplier }: Props) {
    const [formData, setFormData] = useState({
        name: '',
        taxId: '',
        phone: '',
        email: '',
        address: '',
        contactName: '',
        isActive: true
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const addNotification = useNotificationStore(s => s.addNotification);

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                taxId: supplier.taxId || '',
                phone: supplier.phone || '',
                email: supplier.email || '',
                address: supplier.address || '',
                contactName: supplier.contactName || '',
                isActive: supplier.isActive
            });
            setErrors({}); // Clear errors when editing a new supplier
        } else {
            setFormData({
                name: '',
                taxId: '',
                phone: '',
                email: '',
                address: '',
                contactName: '',
                isActive: true
            });
            setErrors({});
        }
    }, [supplier, isOpen]);

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!value.trim()) error = 'El nombre es obligatorio';
                else if (value.trim().length < 3) error = 'Mínimo 3 caracteres';
                break;
            case 'taxId':
                if (!value) error = 'La identificación es obligatoria';
                else if (!/^\d+$/.test(value)) error = 'Solo se permiten números';
                else if (value.length !== 10 && value.length !== 13)
                    error = 'Debe tener 10 dígitos (C.I.) o 13 (RUC)';
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    error = 'Email inválido';
                break;
            case 'phone':
                if (!value) error = 'El teléfono es obligatorio';
                else if (!/^\d+$/.test(value)) error = 'Solo números';
                else if (value.length !== 10) error = 'Debe tener 10 dígitos';
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Special restriction for taxId and phone: only numbers allowed
        if ((name === 'taxId' || name === 'phone') && value !== '' && !/^\d+$/.test(value)) {
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation
        const nameValid = validateField('name', formData.name);
        const taxValid = validateField('taxId', formData.taxId);
        const emailValid = validateField('email', formData.email);

        if (!nameValid || !taxValid || !emailValid) {
            addNotification('Por favor corrige los errores del formulario', 'error');
            return;
        }

        setLoading(true);
        try {
            if (supplier) {
                await supplierService.update(supplier.id, formData);
                addNotification('Proveedor actualizado correctamente', 'success');
            } else {
                await supplierService.create(formData);
                addNotification('Proveedor creado correctamente', 'success');
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            addNotification(err.response?.data || 'Error al guardar proveedor', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl animate-scale-up">
                <GlassCard className="overflow-hidden border-indigo-200/50 shadow-2xl">
                    <div className="flex justify-between items-center p-6 border-b border-indigo-50 bg-indigo-50/30">
                        <div>
                            <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2 uppercase tracking-tight">
                                {supplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                            </h2>
                            <p className="text-xs text-slate-500 font-bold mt-1">Completa los datos de tu aliado comercial</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-rose-500">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre / Empresa <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border ${errors.name ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50'} rounded-xl outline-none transition-all font-bold text-indigo-950`}
                                        placeholder="Ej: Distribuidora Central S.A."
                                    />
                                    {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 animate-fade-in">{errors.name}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">RUC / Identificación <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                    <input
                                        type="text"
                                        name="taxId"
                                        value={formData.taxId}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border ${errors.taxId ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50'} rounded-xl outline-none transition-all font-mono text-sm`}
                                        placeholder="17xxxxxxxx001"
                                    />
                                    {errors.taxId && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 animate-fade-in">{errors.taxId}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Persona de Contacto</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                    <input
                                        type="text"
                                        name="contactName"
                                        value={formData.contactName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all text-sm"
                                        placeholder="Nombre del vendedor..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Teléfono <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={10}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border ${errors.phone ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50'} rounded-xl outline-none transition-all text-sm`}
                                        placeholder="Ej: 09XXXXXXXX"
                                    />
                                    {errors.phone && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 animate-fade-in">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-white border ${errors.email ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50'} rounded-xl outline-none transition-all text-sm`}
                                        placeholder="ejemplo@empresa.com"
                                    />
                                    {errors.email && <p className="text-[10px] text-rose-500 font-bold mt-1 ml-1 animate-fade-in">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Dirección</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all text-sm"
                                        placeholder="Ciudad, Sector, Calle..."
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center gap-3 cursor-pointer p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 transition-all hover:bg-white group">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-indigo-950 uppercase tracking-tight">Proveedor Activo</p>
                                        <p className="text-[10px] text-slate-400 font-bold">Habilita o deshabilita este proveedor para compras</p>
                                    </div>
                                    <ShieldCheck className={`transition-all ${formData.isActive ? 'text-emerald-500' : 'text-slate-300'}`} size={24} />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-100 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Save size={16} />
                                )}
                                {supplier ? 'Actualizar' : 'Crear Proveedor'}
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}
