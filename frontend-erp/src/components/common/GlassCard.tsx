import React, { type ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${className}`}
        >
            {children}
        </div>
    );
};
