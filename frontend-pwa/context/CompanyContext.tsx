"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface CompanySettings {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    coverImageUrl?: string;
}

interface CompanyContextType {
    company: CompanySettings;
    loading: boolean;
}

const defaultCompany: CompanySettings = {
    name: "FASTSTORE",
};

const CompanyContext = createContext<CompanyContextType>({
    company: defaultCompany,
    loading: true,
});

export function CompanyProvider({ children }: { children: React.ReactNode }) {
    const [company, setCompany] = useState<CompanySettings>(defaultCompany);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCompany() {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5140/api/v1";
                const res = await fetch(`${API_URL}/companysettings`);
                if (res.ok) {
                    const data = await res.json();
                    setCompany({
                        name: data.name?.trim() || "FASTSTORE",
                        phone: data.phone,
                        email: data.email,
                        address: data.address,
                        coverImageUrl: data.coverImageUrl,
                    });
                }
            } catch {
                // fallback to default
            } finally {
                setLoading(false);
            }
        }
        fetchCompany();
    }, []);

    return (
        <CompanyContext.Provider value={{ company, loading }}>
            {children}
        </CompanyContext.Provider>
    );
}

export function useCompany() {
    return useContext(CompanyContext);
}
