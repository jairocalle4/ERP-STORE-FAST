import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isLoading = false
}) => {
    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-[2px] animate-fade-in">
            <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] transform transition-all scale-100 border border-slate-100">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                        <AlertTriangle size={24} />
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all p-2 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">
                    {title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3.5 text-slate-400 hover:text-slate-600 font-bold transition-all text-sm"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-[2] px-4 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold transition-all text-sm shadow-xl shadow-rose-600/10 flex items-center justify-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : null}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ConfirmModal;
