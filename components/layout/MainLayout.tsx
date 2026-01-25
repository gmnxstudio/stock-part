'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
