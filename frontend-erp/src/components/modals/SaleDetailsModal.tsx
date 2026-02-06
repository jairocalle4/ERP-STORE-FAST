import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Calendar, User, Package, Hash, CreditCard, Download, Trash2 } from 'lucide-react';
import type { Sale } from '../../services/sale.service';
import { saleService } from '../../services/sale.service';
import { useNotificationStore } from '../../store/useNotificationStore';

interface SaleDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    sale: Sale | null;
    autoPrint?: boolean;
    onVoid?: () => void;
}

const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({ isOpen, onClose, sale, autoPrint = false, onVoid }) => {
    const addNotification = useNotificationStore(state => state.addNotification);
    const [isVoiding, setIsVoiding] = React.useState(false);
    const [showConfirmVoid, setShowConfirmVoid] = React.useState(false);

    // Auto-print effect
    React.useEffect(() => {
        if (isOpen && sale && autoPrint) {
            // Small delay to ensure modal is rendered
            const timer = setTimeout(() => {
                handlePrint();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen, sale, autoPrint]);

    if (!isOpen || !sale) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-EC', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePrint = () => {
        if (!sale) return;

        const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (!windowPrint) return;

        windowPrint.document.write(`
            <html>
                <head>
                    <title>Ticket de Venta # ${sale.noteNumber || sale.id}</title>
                    <style>
                        @page { size: 80mm auto; margin: 0; }
                        body { 
                            font-family: 'Courier New', Courier, monospace; 
                            width: 80mm; 
                            padding: 5mm;
                            margin: 0;
                            font-size: 12px;
                            line-height: 1.2;
                        }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .bold { font-weight: bold; }
                        .divider { border-top: 1px dashed #000; margin: 5mm 0; }
                        .header { margin-bottom: 5mm; }
                        .store-name { font-size: 16px; font-weight: bold; margin-bottom: 2mm; }
                        .info-row { display: flex; justify-content: space-between; margin-bottom: 1mm; }
                        table { width: 100%; border-collapse: collapse; margin: 3mm 0; }
                        th { text-align: left; border-bottom: 1px solid #000; padding-bottom: 1mm; }
                        td { padding: 1mm 0; vertical-align: top; }
                        .total-section { margin-top: 3mm; }
                        .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; }
                        .footer { margin-top: 8mm; font-size: 10px; }
                    </style>
                </head>
                <body>
                    <div class="text-center header">
                        <div class="store-name">ERP STORE FAST</div>
                        <div>RUC: 0999999999001</div>
                        <div>Matriz: Calle Principal 123</div>
                        <div>Telf: 0991693863</div>
                    </div>

                    <div class="divider"></div>

                    <div class="info-row">
                        <span># NOTA:</span>
                        <span class="bold">${sale.noteNumber || `V-${sale.id}`}</span>
                    </div>
                    <div class="info-row">
                        <span>FECHA:</span>
                        <span>${new Date(sale.date).toLocaleString('es-EC')}</span>
                    </div>
                    <div class="info-row">
                        <span>CLIENTE:</span>
                        <span class="bold">${sale.client?.name || 'CONSUMIDOR FINAL'}</span>
                    </div>
                    <div class="info-row">
                        <span>C.I./RUC:</span>
                        <span>${sale.client?.cedulaRuc || '9999999999'}</span>
                    </div>
                    <div class="info-row">
                        <span>VENDEDOR:</span>
                        <span>${sale.employee?.name || 'Sistema'}</span>
                    </div>
                    <div class="info-row">
                        <span>PAGO:</span>
                        <span class="bold">${sale.paymentMethod?.toUpperCase() || 'EFECTIVO'}</span>
                    </div>

                    <div class="divider"></div>

                    <table>
                        <thead>
                            <tr>
                                <th>CANT. PRODUCTO</th>
                                <th class="text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sale.saleDetails?.map(detail => `
                                <tr>
                                    <td>${detail.quantity} x ${detail.productName || detail.product?.name || 'Producto'}</td>
                                    <td class="text-right">$${(detail.unitPrice * detail.quantity).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="font-size: 10px; color: #666; padding-top: 0;">P.U: $${detail.unitPrice.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="divider"></div>

                    <div class="total-section">
                        <div class="total-row">
                            <span>TOTAL A PAGAR:</span>
                            <span>$${sale.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="footer text-center">
                        <div class="bold">¡GRACIAS POR SU COMPRA!</div>
                        <div>Este documento es un comprobante de venta.</div>
                        <div>Conserve su ticket para cambios o devoluciones.</div>
                    </div>
                </body>
            </html>
        `);

        windowPrint.document.close();
        windowPrint.focus();
        setTimeout(() => {
            windowPrint.print();
            windowPrint.close();
        }, 250);
    };

    const handleVoid = async () => {
        if (!sale) return;
        setIsVoiding(true);
        try {
            console.log('Anulando venta ID:', sale.id);
            await saleService.void(sale.id);
            addNotification('Venta anulada correctamente. Stock restaurado.', 'success');
            if (onVoid) onVoid();
            onClose();
        } catch (err) {
            console.error('Error voiding sale:', err);
            addNotification('Error al intentar anular la venta', 'error');
        } finally {
            setIsVoiding(false);
            setShowConfirmVoid(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            {/* Wrapper to ensure centering */}
            <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-center">
                <div
                    className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-[0_40px_100px_rgba(0,0,0,0.2)] animate-scale-in border border-slate-100 overflow-hidden flex flex-col max-h-[calc(100vh-4rem)] text-left"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                <Hash size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Detalle de Venta</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Transacción #{sale.noteNumber || sale.id}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-white rounded-2xl transition-all shadow-sm"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto grow p-8 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-8 mb-10">
                            {/* Information Cards */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                                    <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Cliente</p>
                                        <p className="font-bold text-slate-800">{sale.client?.name || 'Consumidor Final'}</p>
                                        <p className="text-xs text-slate-500 font-medium">{sale.client?.cedulaRuc || '9999999999'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                                    <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Fecha y Hora</p>
                                        <p className="font-bold text-slate-800">{formatDate(sale.date)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                                    <div className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Vendedor encargado</p>
                                        <p className="font-bold text-slate-800">{sale.employee?.name || 'Administrador'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                                    <div className="p-3 bg-white rounded-2xl text-slate-600 shadow-sm">
                                        <Hash size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Estado / Pago</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {sale.isVoid ? (
                                                <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black uppercase rounded-lg">Anulada</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase rounded-lg">Completada</span>
                                            )}
                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase rounded-lg">{sale.paymentMethod || 'Efectivo'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="bg-white border-2 border-slate-50 rounded-[2rem] overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Producto</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Cant.</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">P. Unit.</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-slate-50">
                                    {sale.saleDetails?.map((detail) => (
                                        <tr key={detail.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                        <Package size={20} />
                                                    </div>
                                                    <span className="font-bold text-slate-700 text-sm leading-tight">{detail.productName || detail.product?.name || 'Producto'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-black rounded-lg">{detail.quantity}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-500 text-sm">
                                                ${detail.unitPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-slate-800">
                                                ${(detail.quantity * detail.unitPrice).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Total Summary */}
                        <div className="mt-8 flex justify-end">
                            <div className="w-64 space-y-3 bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl shadow-slate-900/20">
                                <div className="flex justify-between items-center opacity-60">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Base Imponible</span>
                                    <span className="font-bold text-sm">${(sale.total / 1.15).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center opacity-60">
                                    <span className="text-[10px] font-black uppercase tracking-widest">IVA (15%)</span>
                                    <span className="font-bold text-sm">${(sale.total - (sale.total / 1.15)).toFixed(2)}</span>
                                </div>
                                <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-widest">Total Final</span>
                                    <span className="text-2xl font-black text-indigo-400 tracking-tighter">${sale.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
                        {!sale.isVoid && (
                            <div className="flex gap-2">
                                {!showConfirmVoid ? (
                                    <button
                                        onClick={() => setShowConfirmVoid(true)}
                                        className="px-6 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 border border-rose-100"
                                    >
                                        <Trash2 size={18} />
                                        Anular Venta
                                    </button>
                                ) : (
                                    <div className="flex gap-2 animate-in fade-in slide-in-from-left-2 transition-all">
                                        <button
                                            onClick={handleVoid}
                                            disabled={isVoiding}
                                            className="px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-lg shadow-rose-200"
                                        >
                                            {isVoiding ? (
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                            ¿CONFIRMAS?
                                        </button>
                                        <button
                                            onClick={() => setShowConfirmVoid(false)}
                                            disabled={isVoiding}
                                            className="px-4 py-4 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all"
                                        >
                                            No
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex-1 flex gap-4">
                            <button
                                onClick={handlePrint}
                                className="flex-1 py-4 bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-600 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
                            >
                                <Printer size={18} />
                                Imprimir Ticket
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-6 py-4 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20"
                            >
                                <Download size={18} />
                                PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SaleDetailsModal;
