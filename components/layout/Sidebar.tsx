'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    FileText,
    Smartphone,
    Search,
    History,
    DollarSign,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Part Master', href: '/part-master', icon: Package },
    { name: 'Data Entry', href: '/data-entry', icon: FileText },
    { name: 'Input Mobile', href: '/mobile-input', icon: Smartphone },
    { name: 'CariPart', href: '/cari-part', icon: Search },
    { name: 'Riwayat', href: '/riwayat', icon: History },
    { name: 'Anggaran', href: '/anggaran', icon: DollarSign },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
            {/* Logo/Header */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 bg-[#009ce4]">
                <h1 className="text-lg font-bold text-white text-center leading-tight">
                    STOK BARANG<br />ULU PLASTIK LATERSIA
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                isActive
                                    ? 'bg-[#009ce4] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                    © 2026 PT UPL
                </p>
            </div>
        </div>
    );
}
