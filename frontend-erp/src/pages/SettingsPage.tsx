import { useEffect, useState, useRef } from 'react';
import { Building2, Save, MapPin, Phone, Mail, Hash, ShieldCheck, Eye, EyeOff, FileText, Upload, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { companyService } from '../services/company.service';
import type { CompanySetting } from '../services/company.service';
import { electronicBillingService } from '../services/electronic-billing.service';
import type { ElectronicBillingSettings } from '../services/electronic-billing.service';
import { useNotificationStore } from '../store/useNotificationStore';
import api from '../services/api';

export default function SettingsPage() {
    const [settings, setSettings] = useState<CompanySetting | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSmtpPass, setShowSmtpPass] = useState(false);
    const [testingEmail, setTestingEmail] = useState(false);
    const [testEmailResult, setTestEmailResult] = useState<{ ok: boolean; msg: string; detail?: string } | null>(null);
    const addNotification = useNotificationStore(state => state.addNotification);

    // === Facturación Electrónica ===
    const [feSettings, setFeSettings] = useState<Omit<ElectronicBillingSettings, 'hasSignature'>>({
        electronicBillingEnabled: false,
        tributaryRegime: 'RIMPE_NEGOCIO_POPULAR',
        sriEnvironment: '1',
        commercialName: '',
        sriEstablishment: '001',
        sriPointOfIssue: '001',
        ivaRate: 15
    });
    const [feHasSignature, setFeHasSignature] = useState(false);
    const [savingFe, setSavingFe] = useState(false);
    const [uploadingFirma, setUploadingFirma] = useState(false);
    const [showFirmaPass, setShowFirmaPass] = useState(false);
    const [firmaPassword, setFirmaPassword] = useState('');
    const [firmaFile, setFirmaFile] = useState<File | null>(null);
    const firmaInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings();
        fetchFeSettings();
    }, []);

    const fetchFeSettings = async () => {
        try {
            const data = await electronicBillingService.obtenerConfiguracion();
            setFeHasSignature(data.hasSignature);
            setFeSettings({
                electronicBillingEnabled: data.electronicBillingEnabled,
                tributaryRegime: data.tributaryRegime ?? 'RIMPE_NEGOCIO_POPULAR',
                sriEnvironment: data.sriEnvironment ?? '1',
                commercialName: data.commercialName ?? '',
                sriEstablishment: data.sriEstablishment ?? '001',
                sriPointOfIssue: data.sriPointOfIssue ?? '001',
                ivaRate: data.ivaRate ?? 15
            });
        } catch { /* ok if not set yet */ }
    };

    const handleSaveFe = async () => {
        setSavingFe(true);
        try {
            // Guarda la configuración de FE (establecimiento, ambiente, régimen, etc.)
            await electronicBillingService.guardarConfiguracion(feSettings);
            // Guarda también el secuencial y el mensaje legal (pertenecen a CompanySetting)
            if (settings) await companyService.updateSettings(settings);
            addNotification('Configuración de Facturación Electrónica guardada', 'success');
        } catch {
            addNotification('Error al guardar la configuración de FE', 'error');
        } finally {
            setSavingFe(false);
        }
    };

    const handleSubirFirma = async () => {
        if (!firmaFile) return addNotification('Selecciona un archivo .p12 primero', 'error');
        if (!firmaPassword) return addNotification('Ingresa la contraseña de la firma', 'error');
        setUploadingFirma(true);
        try {
            await electronicBillingService.subirFirma(firmaFile, firmaPassword);
            setFeHasSignature(true);
            setFirmaFile(null);
            setFirmaPassword('');
            addNotification('¡Firma electrónica cargada exitosamente!', 'success');
        } catch {
            addNotification('Error al subir la firma. Verifica el archivo y la contraseña.', 'error');
        } finally {
            setUploadingFirma(false);
        }
    };

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
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Imagen de Portada (Hero de la Tienda)</label>
                                <input
                                    type="text"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={settings?.coverImageUrl || ''}
                                    onChange={e => setSettings(s => s ? { ...s, coverImageUrl: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm"
                                />
                                <p className="text-[10px] text-slate-400 mt-1 italic">
                                    ⚡ Esta imagen aparece como foto principal en la tienda online y al compartir en redes sociales.
                                </p>
                                {settings?.coverImageUrl && (
                                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                        <img
                                            src={settings.coverImageUrl}
                                            alt="Vista previa"
                                            className="w-full h-32 object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                        <p className="text-[10px] text-slate-400 text-center py-1.5 bg-slate-50">Vista previa de la imagen</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    {/* Email Alerts Config — Redesigned with method selector */}
                    <GlassCard className="p-8 space-y-6 md:col-span-2">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
                                <Mail className="text-indigo-600" size={20} />
                                Configuración de Correo Saliente
                            </h3>
                            <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                                settings?.brevoApiKey
                                    ? 'bg-violet-50 border-violet-200 text-violet-700'
                                    : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                            }`}>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${settings?.brevoApiKey ? 'bg-violet-500' : 'bg-emerald-500'}`}></div>
                                {settings?.brevoApiKey ? 'Brevo API' : 'SMTP'}
                            </div>
                        </div>

                        {/* === Shared: Email remitente — always visible === */}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Correo Remitente (De:)
                            </label>
                            <input
                                type="email"
                                placeholder="tu-correo@empresa.com"
                                value={settings?.smtpUser || ''}
                                onChange={e => setSettings(s => s ? { ...s, smtpUser: e.target.value } : null)}
                                className="w-full px-4 py-3 bg-white/80 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm font-medium"
                            />
                            <div className="mt-2 flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                                <span className="text-amber-500 text-sm shrink-0 mt-0.5">⚠</span>
                                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                                    Es el correo que aparece como <span className="font-black">"De:"</span> en todos los envíos.
                                    Si usas <span className="font-black">Gmail / Outlook</span>, debe ser <span className="font-black underline">exactamente</span> la misma cuenta con la que generaste la Contraseña de Aplicación — no puede ser distinto, el servidor lo rechazará.
                                </p>
                            </div>
                        </div>

                        {/* === Method Selector tabs === */}
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Método de Envío</p>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Tab: Brevo */}
                                <button
                                    type="button"
                                    onClick={() => {/* just visual — brevo takes priority when api key is set */}}
                                    className={`relative flex flex-col items-start gap-1 p-4 rounded-2xl border-2 text-left transition-all ${
                                        settings?.brevoApiKey
                                            ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100'
                                            : 'border-slate-200 bg-white/50 hover:border-violet-200'
                                    }`}
                                >
                                    {settings?.brevoApiKey && (
                                        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                                    )}
                                    <span className="text-base">🚀</span>
                                    <span className="font-black text-sm text-violet-800">Brevo API</span>
                                    <span className="text-[11px] text-violet-600 leading-relaxed">Recomendado. Gratuito 300 correos/día. Funciona aunque el ISP bloquee los puertos SMTP.</span>
                                </button>
                                {/* Tab: SMTP */}
                                <button
                                    type="button"
                                    onClick={() => {/* visual only */}}
                                    className={`relative flex flex-col items-start gap-1 p-4 rounded-2xl border-2 text-left transition-all ${
                                        !settings?.brevoApiKey
                                            ? 'border-indigo-400 bg-indigo-50 shadow-sm shadow-indigo-100'
                                            : 'border-slate-200 bg-white/50 hover:border-indigo-200'
                                    }`}
                                >
                                    {!settings?.brevoApiKey && (
                                        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                                    )}
                                    <span className="text-base">📧</span>
                                    <span className="font-black text-sm text-indigo-800">SMTP Manual</span>
                                    <span className="text-[11px] text-indigo-600 leading-relaxed">Gmail, Outlook, Yahoo, etc. Requiere Contraseña de Aplicación.</span>
                                </button>
                            </div>
                        </div>

                        {/* === BREVO panel === */}
                        <div className={`rounded-2xl border-2 p-5 space-y-3 transition-all ${
                            settings?.brevoApiKey
                                ? 'border-violet-300 bg-violet-50/60'
                                : 'border-slate-100 bg-slate-50/50 opacity-60'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                                        <Mail size={14} className="text-violet-600" />
                                    </div>
                                    <span className="font-black text-violet-800 text-sm">Brevo API Key</span>
                                </div>
                                <a
                                    href="https://app.brevo.com/settings/keys/api"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-bold text-violet-600 underline hover:text-violet-800"
                                >
                                    → Obtener gratis
                                </a>
                            </div>
                            <input
                                type="text"
                                placeholder="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxx..."
                                value={settings?.brevoApiKey || ''}
                                onChange={e => setSettings(s => s ? { ...s, brevoApiKey: e.target.value } : null)}
                                className="w-full px-4 py-3 bg-white border border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-400/50 outline-none transition-all text-sm font-mono"
                            />
                            <p className="text-[10px] text-violet-500 font-medium">
                                {settings?.brevoApiKey
                                    ? '✅ Brevo está activo y tiene prioridad sobre SMTP.'
                                    : 'Deja vacío para usar SMTP. Si se llena, Brevo tiene prioridad automáticamente.'}
                            </p>
                        </div>

                        {/* === SMTP panel — collapsed when Brevo is active === */}
                        <div className={`space-y-4 transition-all ${settings?.brevoApiKey ? 'opacity-40 pointer-events-none select-none' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-slate-200" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {settings?.brevoApiKey ? 'SMTP (inactivo — Brevo tiene prioridad)' : 'Configuración SMTP'}
                                </span>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            {/* Provider shortcuts */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: 'Gmail', server: 'smtp.gmail.com', port: 587 },
                                    { name: 'Outlook', server: 'smtp.office365.com', port: 587 },
                                    { name: 'Yahoo', server: 'smtp.mail.yahoo.com', port: 465 },
                                    { name: 'iCloud', server: 'smtp.mail.me.com', port: 587 }
                                ].map(prov => (
                                    <button
                                        key={prov.name}
                                        type="button"
                                        onClick={() => setSettings(s => s ? { ...s, smtpServer: prov.server, smtpPort: prov.port } : null)}
                                        className={`px-3 py-1.5 bg-white border rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                            settings?.smtpServer === prov.server
                                                ? 'border-indigo-400 text-indigo-700 bg-indigo-50'
                                                : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                                        }`}
                                    >
                                        {prov.name}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                        value={settings?.smtpPort || 587}
                                        onChange={e => setSettings(s => s ? { ...s, smtpPort: parseInt(e.target.value) } : null)}
                                        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Seguridad</label>
                                    <div className="flex items-center gap-2 mt-3.5">
                                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow shadow-emerald-200" />
                                        <span className="text-xs font-bold text-slate-500">SSL/TLS</span>
                                    </div>
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contraseña de Aplicación</label>
                                    <div className="relative max-w-md">
                                        <input
                                            type={showSmtpPass ? 'text' : 'password'}
                                            placeholder="••••••••••••••••"
                                            value={settings?.smtpPass || ''}
                                            onChange={e => setSettings(s => s ? { ...s, smtpPass: e.target.value } : null)}
                                            className="w-full pr-12 pl-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSmtpPass(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-indigo-500 transition-colors"
                                        >
                                            {showSmtpPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1.5 italic">
                                        Gmail / Outlook: usa una <span className="underline font-semibold">Contraseña de Aplicación</span>, no tu clave habitual.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Test Email Button */}
                        <div className="pt-2 flex items-center gap-4 flex-wrap border-t border-slate-100">

                            <button
                                type="button"
                                onClick={async () => {
                                    setTestingEmail(true);
                                    setTestEmailResult(null);
                                    try {
                                        const res = await api.post('/notifications/test-email');
                                        setTestEmailResult({ ok: true, msg: res.data.message });
                                    } catch (e: any) {
                                        const errData = e?.response?.data;
                                        if (errData) {
                                            setTestEmailResult({ ok: false, msg: errData.error, detail: errData.detail });
                                        } else {
                                            setTestEmailResult({ ok: false, msg: 'No se pudo conectar. Verifica que el backend esté corriendo.' });
                                        }
                                    } finally {
                                        setTestingEmail(false);
                                    }
                                }}
                                disabled={testingEmail}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95"
                            >
                                {testingEmail ? (
                                    <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                                ) : (
                                    <Mail size={15} />
                                )}
                                {testingEmail ? 'Enviando...' : 'Enviar Correo de Prueba'}
                            </button>

                            {testEmailResult && (
                                <div className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold border ${testEmailResult.ok
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-rose-50 border-rose-200 text-rose-700'
                                    }`}>
                                    {testEmailResult.ok ? '✅ ' : '❌ '}{testEmailResult.msg}
                                    {testEmailResult.detail && (
                                        <p className="text-[11px] font-normal mt-0.5 opacity-80">{testEmailResult.detail}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* ══════════════════════════════════════════
                        FACTURACIÓN ELECTRÓNICA SRI (sección unificada)
                    ══════════════════════════════════════════ */}
                    <GlassCard className="p-8 space-y-6 md:col-span-2 border-2 border-indigo-100">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
                                <FileText className="text-indigo-600" size={20} />
                                Facturación Electrónica SRI
                            </h3>
                            <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-xs font-black uppercase tracking-widest ${feSettings.electronicBillingEnabled
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-slate-100 border-slate-200 text-slate-500'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${feSettings.electronicBillingEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                                    }`} />
                                {feSettings.electronicBillingEnabled ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>

                        {/* Toggle Activar */}
                        <div className="flex items-center justify-between p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                            <div>
                                <p className="font-black text-slate-800">Activar Facturación Electrónica</p>
                                <p className="text-xs text-slate-500 mt-0.5">Habilita la emisión de comprobantes electrónicos al SRI</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFeSettings(s => ({ ...s, electronicBillingEnabled: !s.electronicBillingEnabled }))}
                                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${feSettings.electronicBillingEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                                    }`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${feSettings.electronicBillingEnabled ? 'translate-x-7' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Régimen */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Régimen Tributario</label>
                                <select
                                    value={feSettings.tributaryRegime ?? 'RIMPE_NEGOCIO_POPULAR'}
                                    onChange={e => setFeSettings(s => ({ ...s, tributaryRegime: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm"
                                >
                                    <option value="RIMPE_NEGOCIO_POPULAR">RIMPE – Negocio Popular</option>
                                    <option value="RIMPE_EMPRENDEDOR">RIMPE – Emprendedor</option>
                                    <option value="GENERAL">Régimen General</option>
                                </select>
                            </div>
                            {/* Ambiente */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ambiente SRI</label>
                                <select
                                    value={feSettings.sriEnvironment ?? '1'}
                                    onChange={e => setFeSettings(s => ({ ...s, sriEnvironment: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm"
                                >
                                    <option value="1">🟡 Pruebas (Certificación)</option>
                                    <option value="2">🟢 Producción</option>
                                </select>
                                {feSettings.sriEnvironment === '2' && (
                                    <p className="text-[10px] text-amber-600 font-bold mt-1">⚠ Las facturas emitidas en Producción tienen validez legal.</p>
                                )}
                            </div>
                            {/* IVA */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tasa IVA (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        max="30"
                                        value={feSettings.ivaRate}
                                        onChange={e => setFeSettings(s => ({ ...s, ivaRate: parseFloat(e.target.value) || 0 }))}
                                        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-mono text-sm"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 italic">RIMPE Negocio Popular → 0% automático</p>
                            </div>
                            {/* Nombre Comercial */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre Comercial (RIDE)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Tec-Store Jairo"
                                    value={feSettings.commercialName ?? ''}
                                    onChange={e => setFeSettings(s => ({ ...s, commercialName: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm"
                                />
                            </div>
                            {/* Establecimiento */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Establecimiento</label>
                                <input
                                    type="text"
                                    placeholder="001"
                                    maxLength={3}
                                    value={feSettings.sriEstablishment ?? '001'}
                                    onChange={e => setFeSettings(s => ({ ...s, sriEstablishment: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-mono text-sm"
                                />
                            </div>
                            {/* Punto Emisión */}
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Punto de Emisión</label>
                                <input
                                    type="text"
                                    placeholder="001"
                                    maxLength={3}
                                    value={feSettings.sriPointOfIssue ?? '001'}
                                    onChange={e => setFeSettings(s => ({ ...s, sriPointOfIssue: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* ── Secuencial y Mensaje Legal ── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Secuencial Actual</label>
                                <div className="relative">
                                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="number"
                                        min={0}
                                        value={settings?.currentSequence ?? 0}
                                        onChange={e => setSettings(s => s ? { ...s, currentSequence: parseInt(e.target.value) || 0 } : null)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 italic">
                                    Último n° usado. La próxima factura será #{(settings?.currentSequence ?? 0) + 1}.
                                    En producción reinicia en <span className="font-bold">0</span>.
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mensaje Legal (Pie de Ticket)</label>
                                <textarea
                                    rows={2}
                                    value={settings?.legalMessage || ''}
                                    onChange={e => setSettings(s => s ? { ...s, legalMessage: e.target.value } : null)}
                                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none text-sm"
                                    placeholder="Ej: Contribuyente Negocio Popular – Régimen RIMPE."
                                />
                                <p className="text-[10px] text-slate-400 mt-1 italic">Aparece al pie del ticket térmico impreso.</p>
                            </div>
                        </div>

                        {/* Firma Electrónica .p12 */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-black text-indigo-800 flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-indigo-600" />
                                    Firma Electrónica (.p12)
                                </h4>
                                {feHasSignature ? (
                                    <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                                        <CheckCircle size={14} className="text-emerald-600" />
                                        <span className="text-xs font-black text-emerald-700">Firma Configurada</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                                        <AlertCircle size={14} className="text-amber-600" />
                                        <span className="text-xs font-black text-amber-700">Sin Firma</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Upload .p12 */}
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Archivo .p12 / .pfx</label>
                                    <div
                                        onClick={() => firmaInputRef.current?.click()}
                                        className="cursor-pointer border-2 border-dashed border-indigo-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-indigo-400 transition-colors bg-white/60"
                                    >
                                        <Upload size={22} className="text-indigo-400" />
                                        <span className="text-xs text-slate-500 font-medium text-center">
                                            {firmaFile ? (
                                                <span className="text-indigo-700 font-black flex items-center gap-1">
                                                    <CheckCircle size={14} /> {firmaFile.name}
                                                </span>
                                            ) : 'Haz clic para seleccionar tu firma .p12'}
                                        </span>
                                    </div>
                                    <input
                                        ref={firmaInputRef}
                                        type="file"
                                        accept=".p12,.pfx"
                                        className="hidden"
                                        onChange={e => setFirmaFile(e.target.files?.[0] ?? null)}
                                    />
                                </div>
                                {/* Contraseña */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Contraseña del .p12</label>
                                        <div className="relative">
                                            <input
                                                type={showFirmaPass ? 'text' : 'password'}
                                                placeholder="Contraseña de la firma"
                                                value={firmaPassword}
                                                onChange={e => setFirmaPassword(e.target.value)}
                                                className="w-full pr-12 pl-4 py-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowFirmaPass(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500"
                                            >
                                                {showFirmaPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSubirFirma}
                                        disabled={uploadingFirma || !firmaFile}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95"
                                    >
                                        {uploadingFirma ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : <Upload size={15} />}
                                        {uploadingFirma ? 'Subiendo...' : 'Cargar Firma'}
                                    </button>
                                </div>
                            </div>

                            {!feHasSignature && (
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                        <span className="font-black">📋 Sin firma .p12:</span> El sistema generará y validará el XML correctamente, pero no podrá enviarlo al SRI hasta que configures tu firma electrónica.
                                        Obtén tu firma en el <strong>Registro Civil</strong> o <strong>Security Data</strong> (~$25-35).
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Botón guardar FE */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={handleSaveFe}
                                disabled={savingFe}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-60 active:scale-95 shadow-lg shadow-indigo-200"
                            >
                                {savingFe ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : <Zap size={15} />}
                                {savingFe ? 'Guardando...' : 'Guardar Config. FE'}
                            </button>
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
