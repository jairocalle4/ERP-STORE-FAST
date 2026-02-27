import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, Truck,
    Package, ClipboardList,
    Printer, Trash2, Loader2
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { purchaseService, type Purchase } from '../services/purchase.service';
import { companyService, type CompanySetting } from '../services/company.service';
import { useNotificationStore } from '../store/useNotificationStore';
import ConfirmModal from '../components/modals/ConfirmModal';

export default function PurchaseDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [purchase, setPurchase] = useState<Purchase | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [company, setCompany] = useState<CompanySetting | null>(null);
    const addNotification = useNotificationStore(s => s.addNotification);

    useEffect(() => {
        if (id) {
            fetchPurchaseDetails(parseInt(id));
            fetchCompanySettings();
        }
    }, [id]);

    const fetchCompanySettings = async () => {
        try {
            const settings = await companyService.getSettings();
            setCompany(settings);
        } catch (err) {
            console.error('Error fetching company info for purchase print', err);
        }
    };

    const fetchPurchaseDetails = async (purchaseId: number) => {
        try {
            const data = await purchaseService.getById(purchaseId);
            setPurchase(data);
        } catch (err) {
            console.error(err);
            addNotification('Error al cargar el detalle de la compra', 'error');
            navigate('/purchases');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!purchase) return;
        setIsDeleting(true);
        try {
            await purchaseService.void(purchase.id);
            addNotification('Compra anulada correctamente', 'success');
            navigate('/purchases');
        } catch (err) {
            addNotification('Error al anular la compra', 'error');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handlePrint = () => {
        if (!purchase) return;

        const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (!windowPrint) return;

        windowPrint.document.write(`
            <html>
                <head>
                    <title>Compra #${purchase.invoiceNumber}</title>
                    <style>
                        @page { size: A4; margin: 10mm; }
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            padding: 2.0mm;
                            font-size: 13px;
                            line-height: 1.4;
                            color: #333;
                        }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .bold { font-weight: bold; }
                        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .store-name { font-size: 20px; font-weight: bold; margin-bottom: 5px; color: #1e293b; }
                        .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                        .info-section { border: 1px solid #e2e8f0; padding: 15px; rounded: 10px; }
                        .section-title { font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th { background-color: #f8fafc; text-align: left; border-bottom: 2px solid #e2e8f0; padding: 10px; font-weight: 800; font-size: 11px; text-transform: uppercase; color: #475569; }
                        td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; }
                        .total-table { width: 300px; margin-left: auto; margin-top: 20px; }
                        .total-row { display: flex; justify-content: space-between; padding: 5px 10px; }
                        .total-final { font-size: 18px; font-weight: 900; background: #f1f5f9; padding: 10px; margin-top: 10px; border-radius: 8px; }
                        .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="header flex justify-between items-start">
                        <div>
                            <div class="store-name">${company?.name || 'ERP STORE FAST'}</div>
                            <div>RUC: ${company?.ruc || '0999999999001'}</div>
                            <div>Dirección: ${company?.address || 'Dirección Principal'}</div>
                            <div>Teléfono: ${company?.phone || '-'}</div>
                        </div>
                        <div class="text-right">
                            <h2 style="margin: 0; color: #4f46e5;">FACTURA DE COMPRA</h2>
                            <div class="bold" style="font-size: 16px;"># ${purchase.invoiceNumber}</div>
                            <div>Fecha: ${new Date(purchase.date).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div class="info-grid">
                        <div class="info-section">
                            <div class="section-title">Proveedor</div>
                            <div class="bold" style="font-size: 15px;">${purchase.supplier?.name}</div>
                            <div>RUC/ID: ${purchase.supplier?.taxId}</div>
                            <div>Telf: ${purchase.supplier?.phone || '-'}</div>
                            <div>Email: ${purchase.supplier?.email || '-'}</div>
                        </div>
                        <div class="info-section">
                            <div class="section-title">Notas / Observaciones</div>
                            <div style="font-style: italic;">${purchase.notes || 'Sin observaciones adicionales.'}</div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th class="text-center">Cant.</th>
                                <th class="text-right">Precio Unit.</th>
                                <th class="text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${purchase.details?.map(d => `
                                <tr>
                                    <td>
                                        <div class="bold">${d.product?.name}</div>
                                        <div style="font-size: 10px; color: #64748b;">SKU: ${d.product?.sku || '-'}</div>
                                    </td>
                                    <td class="text-center">${d.quantity}</td>
                                    <td class="text-right">$${d.unitPrice.toFixed(2)}</td>
                                    <td class="text-right" class="bold">$${d.subtotal.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="total-table">
                        <div class="total-row">
                            <span class="bold">SUBTOTAL:</span>
                            <span>$${(purchase.total / 1.15).toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span class="bold">IVA (15%):</span>
                            <span>$${(purchase.total - (purchase.total / 1.15)).toFixed(2)}</span>
                        </div>
                        <div class="total-row total-final">
                            <span class="bold">TOTAL COMPRA:</span>
                            <span class="bold">$${purchase.total.toFixed(2)}</span>
                        </div>
                        <div class="total-row" style="margin-top: 10px; font-size: 11px;">
                            <span class="bold">MÉTODO DE PAGO:</span>
                            <span>${purchase.paymentMethod?.toUpperCase()}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Documento generado por el sistema administrativo ERP STORE FAST.</p>
                        <p>${company?.legalMessage || ''}</p>
                    </div>
                </body>
            </html>
        `);

        windowPrint.document.close();
        windowPrint.focus();
        setTimeout(() => {
            windowPrint.print();
            windowPrint.close();
        }, 500);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Cargando detalles de la compra...</p>
            </div>
        );
    }

    if (!purchase) return null;

    const getStatusStyle = (status: string, isVoid?: boolean) => {
        if (isVoid) return 'bg-rose-100 text-rose-600 border-rose-200';
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'Pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'PartiallyPaid': return 'bg-blue-100 text-blue-600 border-blue-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const statusLabel = purchase.isVoid ? 'Anulada' : (purchase.status === 'Paid' ? 'Pagado' : purchase.status === 'Pending' ? 'Pendiente' : 'Abono');

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Anular Factura de Compra"
                message="¿Estás seguro de que deseas anular esta factura? El stock de los productos incluidos se descontará automáticamente y el registro quedará marcado como 'Anulado' para fines de auditoría."
                confirmText="Sí, Anular Factura"
                cancelText="Cancelar"
                isLoading={isDeleting}
            />
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/purchases" className="p-3 bg-white/80 rounded-2xl shadow-sm text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className={`text-3xl font-black ${purchase.isVoid ? 'text-slate-400 line-through' : 'text-indigo-950'}`}>Factura #{purchase.invoiceNumber}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(purchase.status, purchase.isVoid)}`}>
                                {statusLabel}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            <Calendar size={14} className="text-indigo-400" />
                            Registrada el {new Date(purchase.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-2xl font-bold hover:bg-slate-50 transition shadow-sm active:scale-95"
                    >
                        <Printer size={18} />
                        <span>Imprimir</span>
                    </button>
                    {!purchase.isVoid && (
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 px-5 py-3 rounded-2xl font-bold hover:bg-rose-100 transition shadow-sm active:scale-95"
                        >
                            <Trash2 size={18} />
                            <span>Anular Compra</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Sections */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items Grid */}
                    <GlassCard className="!p-0 overflow-hidden">
                        <div className="p-6 border-b border-indigo-100 bg-indigo-50/30 flex justify-between items-center">
                            <h2 className="text-lg font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tight">
                                <Package size={20} className="text-indigo-600" /> Detalle de Productos
                            </h2>
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                {purchase.details?.length || 0} Productos Diferentes
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-indigo-50">
                                        <th className="px-6 py-4">Producto</th>
                                        <th className="px-6 py-4 text-center">Cantidad</th>
                                        <th className="px-6 py-4 text-center">Costo Unit.</th>
                                        <th className="px-6 py-4 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-indigo-50">
                                    {purchase.details?.map((detail) => (
                                        <tr key={detail.id} className="hover:bg-indigo-50/20 transition-colors">
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-slate-800">{detail.product?.name || 'Cargando...'}</p>
                                                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{detail.product?.sku || '-'}</p>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-black text-sm">
                                                    {detail.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <p className="text-sm font-bold text-slate-600">${detail.unitPrice.toFixed(2)}</p>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <p className="text-base font-black text-indigo-600">${detail.subtotal.toFixed(2)}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>

                    {/* Additional Notes */}
                    <GlassCard>
                        <h2 className="text-lg font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tight mb-4">
                            <ClipboardList size={20} className="text-indigo-600" /> Observaciones
                        </h2>
                        <div className="bg-white/40 border border-indigo-50 p-6 rounded-2xl min-h-[100px]">
                            <p className="text-slate-600 leading-relaxed font-bold italic">
                                {purchase.notes || "No se ingresaron notas adicionales para esta compra."}
                            </p>
                        </div>
                    </GlassCard>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-8">
                    {/* Total Summary */}
                    <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-indigo-950/20 relative overflow-hidden text-white transition-all duration-300">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">{purchase.isVoid ? 'Inversión Anulada' : 'Inversión Final'}</h3>
                            <div className="flex justify-between items-end mb-10">
                                <span className={`text-6xl font-black tracking-tighter text-white ${purchase.isVoid ? 'opacity-40' : ''}`}>${purchase.total.toFixed(2)}</span>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400">Metodo:</span>
                                    <span className="font-black uppercase tracking-wider text-indigo-200">{purchase.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-400">Total Items:</span>
                                    <span className="font-black text-white">{purchase.details?.reduce((acc, d) => acc + d.quantity, 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Supplier Info */}
                    <GlassCard className="border-l-8 border-l-indigo-600">
                        <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Información del Proveedor</h2>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Truck size={24} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-indigo-950 truncate text-lg leading-tight uppercase tracking-tight">{purchase.supplier?.name}</p>
                                    <p className="text-xs font-mono text-slate-400 mt-0.5">{purchase.supplier?.taxId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-indigo-50">
                                <div className="bg-white/40 p-3 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto</p>
                                    <p className="text-sm font-bold text-slate-700">{purchase.supplier?.phone || '-'}</p>
                                    <p className="text-[11px] font-medium text-slate-500">{purchase.supplier?.email || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
