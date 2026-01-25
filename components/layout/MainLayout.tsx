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
                {/* Add padding-top for mobile to account for fixed header */}
                <div className="container mx-auto p-4 md:p-6 lg:pt-6 pt-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
