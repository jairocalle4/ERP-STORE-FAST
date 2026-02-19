import { useEffect, useState } from 'react';
import { Building2, Save, MapPin, Phone, Mail, Hash, Calendar, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { companyService } from '../services/company.service';
import type { CompanySetting } from '../services/company.service';
import { useNotificationStore } from '../store/useNotificationStore';

export default function SettingsPage() {
    const [settings, setSettings] = useState<CompanySetting | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const addNotification = useNotificationStore(state => state.addNotification);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await companyService.getSettings();
            setSettings(data);
        } catch (err) {
            console.error('Error fetching settings', err);
            addNotification('Error al cargar la configuración', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        try {
            await companyService.updateSettings(settings);
            addNotification('Configuración guardada correctamente', 'success');
        } catch (err) {
            console.error('Error saving settings', err);
            addNotification('Error al guardar la configuración', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <span className="bg-indigo-600 w-2 h-8 rounded-full"></span>
                        Configuración de Empresa
                    </h2>
                    <p className="text-slate-500 ml-4 font-medium">Gestiona la información legal y de contacto de tu negocio</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <GlassCard className="p-8 space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <Building2 className="text-indigo-600" size={20} />
                            Información General
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre Comercial</label>
                                <input
                                    type="text"
                                    value={settings?.name || ''}
                                    onChange={e => setSettings(s => s ? { ...s, name: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Razón Social</label>
                                <input
                                    type="text"
                                    value={settings?.socialReason || ''}
                                    onChange={e => setSettings(s => s ? { ...s, socialReason: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">RUC</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={settings?.ruc || ''}
                                        onChange={e => setSettings(s => s ? { ...s, ruc: e.target.value } : null)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Contact Info */}
                    <GlassCard className="p-8 space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <MapPin className="text-indigo-600" size={20} />
                            Contacto y Ubicación
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Dirección</label>
                                <input
                                    type="text"
                                    value={settings?.address || ''}
                                    onChange={e => setSettings(s => s ? { ...s, address: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Teléfono</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={settings?.phone || ''}
                                            onChange={e => setSettings(s => s ? { ...s, phone: e.target.value } : null)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Recibo</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            value={settings?.email || ''}
                                            onChange={e => setSettings(s => s ? { ...s, email: e.target.value } : null)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">URL Imagen Portada (SEO/Redes)</label>
                                <input
                                    type="text"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={settings?.coverImageUrl || ''}
                                    onChange={e => setSettings(s => s ? { ...s, coverImageUrl: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                                />
                                <p className="text-[10px] text-slate-400 mt-1 italic">
                                    Esta imagen aparecerá al compartir tu tienda en redes sociales.
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Email Alerts Config (SMTP) */}
                    <GlassCard className="p-8 space-y-6 md:col-span-2">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
                                <Mail className="text-indigo-600" size={20} />
                                Configuración de Envío de Alertas (Correo Saliente)
                            </h3>
                            <div className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Sistema Activo</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 mb-2">
                                <label className="block text-xs font-black text-indigo-900/60 uppercase tracking-widest mb-3 ml-1">Seleccionar Proveedor Sugerido</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { name: 'Gmail', server: 'smtp.gmail.com', port: 587 },
                                        { name: 'Outlook / Hotmail', server: 'smtp.office365.com', port: 587 },
                                        { name: 'Yahoo', server: 'smtp.mail.yahoo.com', port: 465 },
                                        { name: 'iCloud', server: 'smtp.mail.me.com', port: 587 }
                                    ].map(prov => (
                                        <button
                                            key={prov.name}
                                            type="button"
                                            onClick={() => setSettings(s => s ? { ...s, smtpServer: prov.server, smtpPort: prov.port } : null)}
                                            className="px-4 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                                        >
                                            {prov.name}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setSettings(s => s ? { ...s, smtpServer: '', smtpPort: 587 } : null)}
                                        className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all"
                                    >
                                        Personalizado
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Servidor SMTP</label>
                                <input
                                    type="text"
                                    placeholder="smtp.gmail.com"
                                    value={settings?.smtpServer || ''}
                                    onChange={e => setSettings(s => s ? { ...s, smtpServer: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Puerto</label>
                                <input
                                    type="number"
                                    placeholder="587"
                                    value={settings?.smtpPort || 587}
                                    onChange={e => setSettings(s => s ? { ...s, smtpPort: parseInt(e.target.value) } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Seguridad</label>
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200"></div>
                                    <span className="text-xs font-bold text-slate-500 uppercase">Siempre SSL/TLS</span>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Usuario / Email de Envío</label>
                                <input
                                    type="email"
                                    placeholder="tu-correo@empresa.com"
                                    value={settings?.smtpUser || ''}
                                    onChange={e => setSettings(s => s ? { ...s, smtpUser: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contraseña de Aplicación</label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••••••"
                                    value={settings?.smtpPass || ''}
                                    onChange={e => setSettings(s => s ? { ...s, smtpPass: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                                />
                                <p className="text-[10px] text-slate-400 mt-2 italic leading-relaxed">
                                    <span className="font-bold text-indigo-600">⚠ Muy Importante:</span> En Gmail y Outlook no se usa su clave normal. Debe generar una <span className="underline">Contraseña de Aplicación</span> en la cuenta de Google/Microsoft.
                                </p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Tax Info (SRI) */}
                    <GlassCard className="p-8 space-y-6 md:col-span-2">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <ShieldCheck className="text-indigo-600" size={20} />
                            Configuración SRI / Facturación
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Establecimiento</label>
                                <input
                                    type="text"
                                    placeholder="001"
                                    value={settings?.establishment || ''}
                                    onChange={e => setSettings(s => s ? { ...s, establishment: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Punto de Emisión</label>
                                <input
                                    type="text"
                                    placeholder="001"
                                    value={settings?.pointOfIssue || ''}
                                    onChange={e => setSettings(s => s ? { ...s, pointOfIssue: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Secuencial Actual</label>
                                <input
                                    type="number"
                                    value={settings?.currentSequence || 0}
                                    onChange={e => setSettings(s => s ? { ...s, currentSequence: parseInt(e.target.value) } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Autorización SRI</label>
                                <input
                                    type="text"
                                    value={settings?.sriAuth || ''}
                                    onChange={e => setSettings(s => s ? { ...s, sriAuth: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Fecha de Caducidad</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="date"
                                        value={settings?.expirationDate ? settings.expirationDate.split('T')[0] : ''}
                                        onChange={e => setSettings(s => s ? { ...s, expirationDate: e.target.value } : null)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mensaje Legal (Pie de Ticket)</label>
                                <textarea
                                    rows={3}
                                    value={settings?.legalMessage || ''}
                                    onChange={e => setSettings(s => s ? { ...s, legalMessage: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none"
                                    placeholder="Ej: Gracias por su compra. No se aceptan devoluciones..."
                                />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-70"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save size={20} />
                        )}
                        Guardar Configuración
                    </button>
                </div>
            </form >
        </div >
    );
}
