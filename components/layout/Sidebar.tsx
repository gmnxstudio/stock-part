'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    FileText,
    Search,
    History,
    DollarSign,
    Menu,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Part Master', href: '/part-master', icon: Package },
    { name: 'Data Entry', href: '/data-entry', icon: FileText },
    { name: 'CariPart', href: '/cari-part', icon: Search },
    { name: 'Riwayat', href: '/riwayat', icon: History },
    { name: 'Anggaran', href: '/anggaran', icon: DollarSign },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col">
            {/* Logo/Header */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 bg-[#009ce4]">
                <h1 className="text-base md:text-lg font-bold text-white text-center leading-tight">
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
                            onClick={onLinkClick}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                isActive
                                    ? 'bg-[#009ce4] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            )}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">© 2026 PT UPL</p>
            </div>
        </div>
    );
}

export function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-4">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
                        <SidebarContent onLinkClick={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
                <h1 className="text-sm font-bold text-gray-900">
                    STOK BARANG UPL
                </h1>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex h-full w-64 flex-col bg-white border-r border-gray-200">
                <SidebarContent />
            </div>
        </>
    );
}
