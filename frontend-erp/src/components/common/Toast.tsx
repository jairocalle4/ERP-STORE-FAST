import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';

const iconMap = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
};

const bgMap = {
    success: 'bg-emerald-50/90 border-emerald-100 shadow-emerald-500/10',
    error: 'bg-rose-50/90 border-rose-100 shadow-rose-500/10',
    warning: 'bg-amber-50/90 border-amber-100 shadow-amber-500/10',
    info: 'bg-blue-50/90 border-blue-100 shadow-blue-500/10',
};

export const Toast: React.FC = () => {
    const { notifications, removeNotification } = useNotificationStore();

    if (notifications.length === 0) return null;

    const content = (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`
                        pointer-events-auto
                        flex items-center gap-3 px-4 py-3 min-w-[300px] max-w-md
                        backdrop-blur-md border rounded-2xl shadow-xl
                        animate-fade-in transition-all duration-300
                        ${bgMap[n.type]}
                    `}
                >
                    <div className="flex-shrink-0">{iconMap[n.type]}</div>
                    <div className="flex-1 text-sm font-bold text-slate-800">
                        {n.message}
                    </div>
                    <button
                        onClick={() => removeNotification(n.id)}
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );

    return createPortal(content, document.body);
};
