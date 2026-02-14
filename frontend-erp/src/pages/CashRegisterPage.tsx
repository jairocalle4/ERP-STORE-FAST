import React, { useState, useEffect } from 'react';
import { cashRegisterService, type CashRegisterSession, type CashRegisterSummary } from '../services/cash-register.service';
import { useNotificationStore } from '../store/useNotificationStore';
import { Coins, ArrowUpCircle, ArrowDownCircle, Wallet, AlertCircle } from 'lucide-react';

const CashRegisterPage: React.FC = () => {
    const [status, setStatus] = useState<CashRegisterSession | null>(null);
    const [summary, setSummary] = useState<CashRegisterSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [openAmount, setOpenAmount] = useState<string>('');
    const [closeAmount, setCloseAmount] = useState<string>('');
    const [closeNotes, setCloseNotes] = useState('');
    const [showCloseModal, setShowCloseModal] = useState(false);

    // Transaction Modal
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [transactionType, setTransactionType] = useState<'Income' | 'Expense'>('Income');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionDesc, setTransactionDesc] = useState('');

    const { addNotification } = useNotificationStore();

    useEffect(() => {
        fetchStatus();
    }, []);

    useEffect(() => {
        if (status?.status === 'Open') {
            fetchSummary();
        }
    }, [status]);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const data = await cashRegisterService.getStatus();
            setStatus(data || null); // API returns 204 NoContent which axios might treat as empty string or null
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const data = await cashRegisterService.getSummary();
            setSummary(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenSession = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await cashRegisterService.openSession(Number(openAmount));
            addNotification('Caja abierta con éxito');
            fetchStatus();
        } catch (error: any) {
            addNotification(error.response?.data || 'Error al abrir caja', 'error');
        }
    };

    const handleCloseSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.confirm('¿Está seguro de cerrar la caja? Esta acción no se puede deshacer.')) return;

        try {
            await cashRegisterService.closeSession(Number(closeAmount), closeNotes);
            addNotification('Caja cerrada con éxito');
            setShowCloseModal(false);
            fetchStatus();
            setSummary(null);
            setCloseAmount('');
            setCloseNotes('');
        } catch (error: any) {
            addNotification(error.response?.data || 'Error al cerrar caja', 'error');
        }
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await cashRegisterService.addTransaction(transactionType, Number(transactionAmount), transactionDesc);
            addNotification('Movimiento registrado');
            setShowTransactionModal(false);
            setTransactionAmount('');
            setTransactionDesc('');
            fetchSummary();
        } catch (error: any) {
            addNotification('Error al registrar movimiento', 'error');
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando estado de caja...</div>;

    if (!status || status.status !== 'Open') {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Wallet className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Apertura de Caja</h2>
                    <p className="text-gray-500 mb-6">Ingresa el monto inicial para comenzar las operaciones del día.</p>

                    <form onSubmit={handleOpenSession} className="space-y-4">
                        <div>
                            <label className="block text-left text-sm font-medium text-gray-700 mb-1">Monto Inicial ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                                placeholder="0.00"
                                value={openAmount}
                                onChange={(e) => setOpenAmount(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Abrir Caja
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Arqueo de Caja</h1>
                    <p className="text-gray-500 mt-1">Sesión iniciada: {new Date(status.openTime).toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowTransactionModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        <ArrowUpCircle className="w-4 h-4" />
                        Movimiento Manual
                    </button>
                    <button
                        onClick={() => setShowCloseModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        <AlertCircle className="w-4 h-4" />
                        Cerrar Caja
                    </button>
                </div>
            </header>

            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Tarjeta Base */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2 text-gray-500">
                            <Wallet className="w-5 h-5" />
                            <span className="font-medium">Monto Inicial</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">${summary.openAmount.toFixed(2)}</p>
                    </div>

                    {/* Ventas en Efectivo */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2 text-green-600">
                            <ArrowUpCircle className="w-5 h-5" />
                            <span className="font-medium">Ventas Efectivo</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">+${summary.cashSales.toFixed(2)}</p>
                    </div>

                    {/* Gastos / Salidas */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-2 text-red-600">
                            <ArrowDownCircle className="w-5 h-5" />
                            <span className="font-medium">Gastos / Servicios</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">-${(summary.expenses + summary.manualExpense).toFixed(2)}</p>
                    </div>

                    {/* Balance Calculado */}
                    <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
                        <div className="flex items-center gap-3 mb-2 text-blue-700">
                            <Coins className="w-5 h-5" />
                            <span className="font-medium">Balance Esperado</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-800">${summary.calculatedBalance.toFixed(2)}</p>
                        <p className="text-xs text-blue-600 mt-2">Monto que debería haber en caja</p>
                    </div>
                </div>
            )}

            {/* Modal de Cierre */}
            {showCloseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Cerrar Caja</h2>
                            <p className="text-sm text-gray-500">Ingresa el monto físico contado.</p>
                        </div>
                        <form onSubmit={handleCloseSession} className="p-6 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <span className="block text-sm text-gray-500 mb-1">Balance Esperado</span>
                                <span className="text-2xl font-bold text-gray-800">${summary?.calculatedBalance.toFixed(2)}</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dinero en Efectivo (Contado)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                                    placeholder="0.00"
                                    value={closeAmount}
                                    onChange={(e) => setCloseAmount(e.target.value)}
                                    required
                                />
                            </div>

                            {closeAmount && summary && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${Number(closeAmount) - summary.calculatedBalance === 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    Diferencia: ${(Number(closeAmount) - summary.calculatedBalance).toFixed(2)}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observaciones</label>
                                <textarea
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={3}
                                    value={closeNotes}
                                    onChange={(e) => setCloseNotes(e.target.value)}
                                    placeholder="Ej: Faltante de 0.50 por redondeo..."
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCloseModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Confirmar Cierre
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Movimiento Manual */}
            {showTransactionModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">Registrar Movimiento</h2>
                        </div>
                        <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setTransactionType('Income')}
                                    className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition ${transactionType === 'Income' ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}
                                >
                                    Ingreso
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTransactionType('Expense')}
                                    className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition ${transactionType === 'Expense' ? 'bg-white shadow text-red-700' : 'text-gray-500'}`}
                                >
                                    Egreso / Retiro
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={transactionAmount}
                                    onChange={(e) => setTransactionAmount(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej: Cambio, Pago proveedor menor..."
                                    value={transactionDesc}
                                    onChange={(e) => setTransactionDesc(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowTransactionModal(false)}
                                    className="flex-1 px-4 py-2 border hover:bg-gray-50 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashRegisterPage;
