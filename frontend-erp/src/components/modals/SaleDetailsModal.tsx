import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Calendar, User, Package, Hash, CreditCard, Download, Trash2, FileText } from 'lucide-react';
import type { Sale } from '../../services/sale.service';
import { saleService } from '../../services/sale.service';
import { companyService, type CompanySetting } from '../../services/company.service';
import { useNotificationStore } from '../../store/useNotificationStore';
import { electronicBillingService } from '../../services/electronic-billing.service';

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
    const [company, setCompany] = React.useState<CompanySetting | null>(null);

    // Load company settings for print
    React.useEffect(() => {
        if (isOpen) {
            const loadSettings = async () => {
                try {
                    const data = await companyService.getSettings();
                    setCompany(data);
                } catch (err) {
                    console.error('Error fetching company settings for print', err);
                }
            };
            loadSettings();
        }
    }, [isOpen]);

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

        const saleAny = sale as any;
        const isElectronic = !!saleAny.isElectronic;
        const isAuthorized = saleAny.electronicStatus === 'AUTORIZADO';
        const authNumber = saleAny.authorizationNumber || '';
        const authDate = saleAny.authorizationDate
            ? new Date(saleAny.authorizationDate).toLocaleString('es-EC')
            : '';
        const accessKey = saleAny.accessKey || '';

        // Formato clave de acceso en bloques de 10 para facilitar lectura
        const accessKeyFormatted = accessKey
            ? accessKey.match(/.{1,10}/g)?.join(' ') ?? accessKey
            : '';

        const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (!windowPrint) return;

        windowPrint.document.write(`
            <html>
                <head>
                    <title>${isElectronic && isAuthorized ? 'FACTURA ELECTRÓNICA' : 'Ticket de Venta'} # ${sale.noteNumber || sale.id}</title>
                    <style>
                        @page { size: 80mm auto; margin: 0; }
                        body { 
                            font-family: 'Courier New', Courier, monospace; 
                            width: 80mm; 
                            padding: 4mm;
                            margin: 0;
                            font-size: 11px;
                            line-height: 1.3;
                        }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .bold { font-weight: bold; }
                        .divider { border-top: 1px dashed #000; margin: 4mm 0; }
                        .divider-solid { border-top: 1px solid #000; margin: 4mm 0; }
                        .header { margin-bottom: 4mm; }
                        .store-name { font-size: 15px; font-weight: bold; margin-bottom: 1mm; }
                        .doc-type { font-size: 12px; font-weight: bold; border: 1px solid #000; padding: 2mm; margin: 2mm 0; display: inline-block; }
                        .info-row { display: flex; justify-content: space-between; margin-bottom: 1mm; font-size: 11px; }
                        table { width: 100%; border-collapse: collapse; margin: 2mm 0; }
                        th { text-align: left; border-bottom: 1px solid #000; padding-bottom: 1mm; font-size: 10px; }
                        td { padding: 1mm 0; vertical-align: top; font-size: 11px; }
                        .total-section { margin-top: 2mm; }
                        .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; }
                        .sub-row { display: flex; justify-content: space-between; font-size: 10px; color: #444; margin-bottom: 0.5mm; }
                        .footer { margin-top: 6mm; font-size: 9px; }
                        .sri-section { margin-top: 3mm; padding: 2mm; border: 1px solid #000; font-size: 9px; }
                        .sri-title { font-weight: bold; font-size: 10px; text-align: center; margin-bottom: 2mm; }
                        .access-key { font-size: 7.5px; letter-spacing: 0.5px; word-break: break-all; text-align: center; margin: 1mm 0; }
                        .rimpe-legend { font-size: 9px; text-align: center; font-style: italic; border-top: 1px dashed #000; margin-top: 2mm; padding-top: 2mm; }
                        .auth-ok { font-weight: bold; text-align: center; font-size: 11px; }
                        .auth-pending { font-size: 9px; text-align: center; color: #555; font-style: italic; }
                    </style>
                </head>
                <body>
                    <div class="text-center header">
                        <div class="store-name">${company?.name || 'ERP STORE FAST'}</div>
                        ${isElectronic ? `<div class="doc-type">FACTURA</div>` : ''}
                        <div>RUC: ${company?.ruc || '0000000000001'}</div>
                        <div>Dir: ${company?.address || ''}</div>
                        <div>Telf: ${company?.phone || ''}</div>
                        ${isElectronic ? `<div>Est: ${company?.establishment || '001'} &nbsp; P.E: ${company?.pointOfIssue || '001'}</div>` : ''}
                    </div>

                    <div class="divider"></div>

                    <div class="info-row">
                        <span>${isElectronic ? 'Nº FACTURA:' : '# NOTA:'}</span>
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
                            ${(sale.saleDetails || []).map(detail => `
                                <tr>
                                    <td>${detail.quantity} x ${detail.productName || detail.product?.name || 'Producto'}</td>
                                    <td class="text-right">$${(detail.unitPrice * detail.quantity).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="font-size: 9px; color: #666; padding-top: 0;">P.U: $${detail.unitPrice.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="divider"></div>

                    <div class="total-section">
                        <div class="sub-row"><span>SUBTOTAL IVA 0%:</span><span>$${sale.total.toFixed(2)}</span></div>
                        <div class="sub-row"><span>SUBTOTAL IVA ${isElectronic ? '15' : '0'}%:</span><span>$0.00</span></div>
                        <div class="sub-row"><span>IVA (15%):</span><span>$0.00</span></div>
                        <div class="divider-solid"></div>
                        <div class="total-row">
                            <span>TOTAL A PAGAR:</span>
                            <span>$${sale.total.toFixed(2)}</span>
                        </div>
                    </div>

                    ${isElectronic ? `
                    <div class="sri-section">
                        <div class="sri-title">★ COMPROBANTE ELECTRÓNICO SRI ★</div>
                        ${isAuthorized ? `
                            <div class="auth-ok">✓ AUTORIZADO</div>
                            <div class="info-row" style="margin-top:1mm;"><span>Nº AUTORIZACIÓN:</span></div>
                            <div style="font-size:8px; word-break:break-all; text-align:center; margin:0.5mm 0;">${authNumber}</div>
                            <div class="info-row"><span>FECHA AUTORIZACIÓN:</span><span>${authDate}</span></div>
                        ` : `
                            <div class="auth-pending">○ PENDIENTE DE AUTORIZACIÓN</div>
                        `}
                        <div class="info-row" style="margin-top:1mm;"><span>CLAVE DE ACCESO:</span></div>
                        <div class="access-key">${accessKeyFormatted}</div>
                        <div class="rimpe-legend">
                            CONTRIBUYENTE RÉGIMEN RIMPE<br/>
                            NEGOCIO POPULAR - NO COBRA IVA
                        </div>
                    </div>
                    ` : ''}

                    <div class="footer text-center">
                        <div class="bold">¡GRACIAS POR SU COMPRA!</div>
                        <div>${company?.legalMessage || 'Este documento es un comprobante de venta.<br/>Conserve su ticket para cambios o devoluciones.'}</div>
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
                                    <span className="text-[10px] font-black uppercase tracking-widest">Subtotal IVA 0%</span>
                                    <span className="font-bold text-sm">${sale.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center opacity-40">
                                    <span className="text-[10px] font-black uppercase tracking-widest">IVA (0%)</span>
                                    <span className="font-bold text-sm">$0.00</span>
                                </div>
                                <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-widest">Total Final</span>
                                    <span className="text-2xl font-black text-indigo-400 tracking-tighter">${sale.total.toFixed(2)}</span>
                                </div>
                                {(sale as any).isElectronic && (
                                    <div className="pt-2 border-t border-white/10">
                                        <p className="text-[9px] text-center font-black uppercase tracking-widest text-emerald-400">
                                            {(sale as any).electronicStatus === 'AUTORIZADO' ? '✓ Factura Electrónica Autorizada' : '⏳ FE: ' + ((sale as any).electronicStatus ?? 'Pendiente')}
                                        </p>
                                    </div>
                                )}
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
                            {/* FE: XML & RIDE download buttons if authorized */}
                            {(sale as any).isElectronic && (
                                <>
                                    <button
                                        onClick={() => electronicBillingService.descargarXml(sale.id, sale.noteNumber || String(sale.id))}
                                        className="px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                                        title="Descargar XML Autorizado"
                                    >
                                        <Download size={16} />
                                        XML
                                    </button>
                                    <button
                                        onClick={() => electronicBillingService.descargarRide(sale.id, sale.noteNumber || String(sale.id))}
                                        className="px-4 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-lg shadow-purple-200"
                                        title="Descargar RIDE (PDF SRI)"
                                    >
                                        <FileText size={16} />
                                        RIDE
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SaleDetailsModal;
