'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    AlertTriangle,
    Package,
    TrendingUp,
    DollarSign,
    AlertCircle,
    Search,
    ChevronRight,
    ExternalLink,
    Flame,
    Zap,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { StockInfo } from '@/types/database';
import Link from 'next/link';

interface DashboardStats {
    totalValue: number;
    totalItems: number;
    criticalCount: number;
    outOfStockCount: number;
    lowStockCount: number;
    criticalItems: StockInfo[];
    outOfStockItems?: StockInfo[];
    lowStockItems?: StockInfo[];
    mostUsedItems?: StockInfo[];
    frequentlyOutOfStockItems?: StockInfo[];
    recentTransactions: any[];
}

type TabType = 'HABIS' | 'RENDAH' | 'SERING_HABIS' | 'SERING_DIPAKAI' | 'ALL';

export function DashboardClient({ stats }: { stats: DashboardStats }) {
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('HABIS');
    const [searchQuery, setSearchQuery] = useState('');

    const openModalWithTab = (tab: TabType) => {
        setActiveTab(tab);
        setSearchQuery('');
        setIsModalOpen(true);
    };

    // Filter items based on active tab & search query
    const outOfStockList = stats.outOfStockItems || stats.criticalItems.filter((i) => i.status === 'HABIS');
    const lowStockList = stats.lowStockItems || stats.criticalItems.filter((i) => i.status === 'RENDAH');
    
    // Barang sering dipakai (diurutkan berdasarkan stock_out tertinggi)
    const mostUsedList = stats.mostUsedItems || [...stats.criticalItems]
        .filter((i) => (i.stock_out || 0) > 0)
        .sort((a, b) => (b.stock_out || 0) - (a.stock_out || 0));

    // Barang sering habis (prioritas status HABIS & frekuensi pemakaian tinggi)
    const frequentlyOutOfStockList = stats.frequentlyOutOfStockItems || [...stats.criticalItems]
        .filter((i) => i.status === 'HABIS' || i.status === 'RENDAH')
        .sort((a, b) => {
            if (a.status === 'HABIS' && b.status !== 'HABIS') return -1;
            if (b.status === 'HABIS' && a.status !== 'HABIS') return 1;
            return (b.stock_out || 0) - (a.stock_out || 0);
        });

    const getBaseList = () => {
        if (activeTab === 'HABIS') return outOfStockList;
        if (activeTab === 'RENDAH') return lowStockList;
        if (activeTab === 'SERING_HABIS') return frequentlyOutOfStockList;
        if (activeTab === 'SERING_DIPAKAI') return mostUsedList;
        return stats.criticalItems;
    };

    const filteredItems = getBaseList().filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            item.item_name.toLowerCase().includes(query) ||
            item.item_code.toLowerCase().includes(query) ||
            (item.category_name || '').toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Ringkasan stok dan transaksi terbaru
                </p>
            </div>

            {/* Critical Stock Alert Bar */}
            {stats.criticalCount > 0 && (
                <Alert
                    onClick={() => openModalWithTab('ALL')}
                    className="border-red-500 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors group flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <AlertDescription className="text-red-800">
                            <strong>Perhatian!</strong> Ada {stats.criticalCount} barang dengan stok kritis (Stok Habis & Stok Rendah) yang memerlukan perhatian segera.
                        </AlertDescription>
                    </div>
                    <span className="text-xs font-semibold text-red-700 underline group-hover:text-red-900 flex items-center gap-1 shrink-0 ml-2">
                        Detail <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                </Alert>
            )}

            {/* Statistics Cards Row 1: Ringkasan Utama */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Asset Value */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Nilai Aset
                        </CardTitle>
                        <DollarSign className="h-5 w-5 text-[#009ce4]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(stats.totalValue)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Dari {stats.totalItems} jenis barang
                        </p>
                    </CardContent>
                </Card>

                {/* Out of Stock Card - CLICKABLE */}
                <Card
                    onClick={() => openModalWithTab('HABIS')}
                    className="shadow-sm cursor-pointer border-red-200 hover:border-red-500 hover:shadow-md transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-2 h-full bg-red-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-red-700 transition-colors">
                            Stok Habis
                        </CardTitle>
                        <AlertTriangle className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {stats.outOfStockCount}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">Perlu segera dibeli</p>
                            <span className="text-xs text-red-600 font-medium group-hover:underline flex items-center">
                                Lihat detail <ChevronRight className="w-3 h-3 ml-0.5" />
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock Card - CLICKABLE */}
                <Card
                    onClick={() => openModalWithTab('RENDAH')}
                    className="shadow-sm cursor-pointer border-yellow-200 hover:border-yellow-500 hover:shadow-md transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-2 h-full bg-yellow-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-yellow-700 transition-colors">
                            Stok Rendah
                        </CardTitle>
                        <Package className="h-5 w-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.lowStockCount}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">Di bawah minimum stock</p>
                            <span className="text-xs text-yellow-600 font-medium group-hover:underline flex items-center">
                                Lihat detail <ChevronRight className="w-3 h-3 ml-0.5" />
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Items Card */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Barang
                        </CardTitle>
                        <TrendingUp className="h-5 w-5 text-[#7eb93e]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalItems}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Jenis barang aktif</p>
                    </CardContent>
                </Card>
            </div>

            {/* Statistics Cards Row 2: Fitur Baru (Sering Habis & Sering Dipakai) */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                {/* Sering Habis Card - CLICKABLE */}
                <Card
                    onClick={() => openModalWithTab('SERING_HABIS')}
                    className="shadow-sm cursor-pointer border-rose-200 bg-gradient-to-br from-white to-rose-50/40 hover:border-rose-500 hover:shadow-md transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-2 h-full bg-rose-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                                <Flame className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold text-gray-800 group-hover:text-rose-700 transition-colors">
                                    Barang Sering Habis
                                </CardTitle>
                                <p className="text-xs text-gray-500">Prioritas pengadaan & restock rutin</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-rose-300 text-rose-700 bg-rose-50 font-bold">
                            {frequentlyOutOfStockList.length} Item
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-600">
                            {frequentlyOutOfStockList.length > 0 ? (
                                <p className="truncate">
                                    Contoh: <strong className="text-gray-900">{frequentlyOutOfStockList[0].item_name}</strong>
                                    {frequentlyOutOfStockList.length > 1 && ` dan ${frequentlyOutOfStockList.length - 1} barang lainnya`}
                                </p>
                            ) : (
                                <p className="text-gray-400">Tidak ada barang yang sering habis.</p>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-rose-100">
                            <span className="text-xs text-gray-500">Klik untuk melihat analisis & daftar lengkap</span>
                            <span className="text-xs text-rose-600 font-semibold group-hover:underline flex items-center gap-1">
                                Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Sering Dipakai Card - CLICKABLE */}
                <Card
                    onClick={() => openModalWithTab('SERING_DIPAKAI')}
                    className="shadow-sm cursor-pointer border-blue-200 bg-gradient-to-br from-white to-blue-50/40 hover:border-[#009ce4] hover:shadow-md transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#009ce4]" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg text-[#009ce4]">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold text-gray-800 group-hover:text-[#009ce4] transition-colors">
                                    Barang Sering Dipakai
                                </CardTitle>
                                <p className="text-xs text-gray-500">Paling aktif keluar dalam operasional</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-blue-300 text-[#009ce4] bg-blue-50 font-bold">
                            {mostUsedList.length} Item
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-600">
                            {mostUsedList.length > 0 ? (
                                <p className="truncate">
                                    Paling sering: <strong className="text-gray-900">{mostUsedList[0].item_name}</strong> ({mostUsedList[0].stock_out} {mostUsedList[0].unit} keluar)
                                </p>
                            ) : (
                                <p className="text-gray-400">Belum ada data barang keluar tercatat.</p>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-blue-100">
                            <span className="text-xs text-gray-500">Klik untuk melihat peringkat pemakaian</span>
                            <span className="text-xs text-[#009ce4] font-semibold group-hover:underline flex items-center gap-1">
                                Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Two Column Layout: Barang Kritis & Transaksi Terbaru */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Critical Stock Items List */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Barang Kritis</CardTitle>
                        {stats.criticalItems.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openModalWithTab('ALL')}
                                className="text-xs text-[#009ce4] hover:text-[#007cb6] hover:bg-blue-50"
                            >
                                Lihat Semua ({stats.criticalItems.length}) →
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {stats.criticalItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                ✅ Semua stok dalam kondisi aman
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {stats.criticalItems.slice(0, 5).map((item) => (
                                    <div
                                        key={item.item_id}
                                        onClick={() => openModalWithTab(item.status === 'HABIS' ? 'HABIS' : 'RENDAH')}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex-1 min-w-0 mr-3">
                                            <p className="font-medium text-sm truncate">{item.item_name}</p>
                                            <p className="text-xs text-gray-500 truncate">
                                                Kode: {item.item_code} • {item.category_name}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <Badge
                                                variant={item.status === 'HABIS' ? 'destructive' : 'default'}
                                                className={
                                                    item.status === 'RENDAH'
                                                        ? 'bg-yellow-500 hover:bg-yellow-600'
                                                        : ''
                                                }
                                            >
                                                {item.current_stock} {item.unit}
                                            </Badge>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Min: {item.min_stock}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {stats.criticalItems.length > 5 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => openModalWithTab('ALL')}
                                        className="w-full text-xs text-gray-600 mt-2 border-dashed"
                                    >
                                        +{stats.criticalItems.length - 5} barang lainnya — Klik untuk lihat semua
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Transaksi Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.recentTransactions.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                Belum ada transaksi
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {stats.recentTransactions.map((trans: any) => (
                                    <div
                                        key={trans.id}
                                        className="flex items-center justify-between p-3 rounded-lg border"
                                    >
                                        <div className="flex-1 min-w-0 mr-3">
                                            <p className="font-medium text-sm truncate">
                                                {trans.item?.item_name || 'N/A'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {trans.pic?.name || 'N/A'} • {formatDate(trans.date)}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={trans.type === 'MASUK' ? 'default' : 'secondary'}
                                            className={
                                                trans.type === 'MASUK'
                                                    ? 'bg-[#7eb93e] hover:bg-[#6da32e]'
                                                    : ''
                                            }
                                        >
                                            {trans.type === 'MASUK' ? '+' : '-'} {trans.qty}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ======================================================== */}
            {/* MODAL DETIL STOK HABIS, STOK RENDAH, SERING HABIS & SERING DIPAKAI */}
            {/* ======================================================== */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[750px] max-h-[88vh] flex flex-col p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {activeTab === 'HABIS' && (
                                <>
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    <span>Daftar Barang — Stok Habis ({outOfStockList.length})</span>
                                </>
                            )}
                            {activeTab === 'RENDAH' && (
                                <>
                                    <Package className="h-5 w-5 text-yellow-600" />
                                    <span>Daftar Barang — Stok Rendah ({lowStockList.length})</span>
                                </>
                            )}
                            {activeTab === 'SERING_HABIS' && (
                                <>
                                    <Flame className="h-5 w-5 text-rose-600" />
                                    <span>Daftar Barang Sering Habis ({frequentlyOutOfStockList.length})</span>
                                </>
                            )}
                            {activeTab === 'SERING_DIPAKAI' && (
                                <>
                                    <Zap className="h-5 w-5 text-[#009ce4]" />
                                    <span>Daftar Barang Paling Sering Dipakai ({mostUsedList.length})</span>
                                </>
                            )}
                            {activeTab === 'ALL' && (
                                <>
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                    <span>Daftar Seluruh Barang Kritis ({stats.criticalCount})</span>
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-gray-500">
                            {activeTab === 'SERING_DIPAKAI' 
                                ? 'Peringkat barang dengan volume penggunaan (stok keluar) terbanyak dalam operasional.'
                                : activeTab === 'SERING_HABIS'
                                ? 'Daftar barang kritis yang memiliki frekuensi pemakaian tinggi dan perlu diprioritaskan saat pengadaan.'
                                : 'Rincian sparepart yang memerlukan perhatian dan pengadaan stok.'}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 border-b pb-3 pt-1 overflow-x-auto no-scrollbar">
                        <button
                            type="button"
                            onClick={() => setActiveTab('SERING_DIPAKAI')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                activeTab === 'SERING_DIPAKAI'
                                    ? 'bg-[#009ce4] text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-[#009ce4]'
                            }`}
                        >
                            ⚡ Sering Dipakai ({mostUsedList.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('SERING_HABIS')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                activeTab === 'SERING_HABIS'
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                        >
                            🔥 Sering Habis ({frequentlyOutOfStockList.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('HABIS')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                activeTab === 'HABIS'
                                    ? 'bg-red-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
                            }`}
                        >
                            🚨 Stok Habis ({outOfStockList.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('RENDAH')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                activeTab === 'RENDAH'
                                    ? 'bg-yellow-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700'
                            }`}
                        >
                            ⚠️ Stok Rendah ({lowStockList.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('ALL')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                activeTab === 'ALL'
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            📦 Semua ({stats.criticalCount})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative my-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari nama barang, kode, atau kategori..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 text-sm h-9"
                        />
                    </div>

                    {/* Items List Container */}
                    <div className="flex-1 overflow-y-auto min-h-[250px] max-h-[420px] pr-1 space-y-2.5">
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 text-sm">
                                {searchQuery ? 'Tidak ada barang yang cocok dengan pencarian.' : 'Tidak ada barang pada kategori ini.'}
                            </div>
                        ) : (
                            filteredItems.map((item, index) => (
                                <div
                                    key={item.item_id}
                                    className="flex items-center justify-between p-3.5 rounded-xl border bg-white hover:bg-gray-50 transition-colors shadow-2xs"
                                >
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {activeTab === 'SERING_DIPAKAI' && (
                                                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                                    #{index + 1} Terpopuler
                                                </span>
                                            )}
                                            <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                {item.item_code}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {item.category_name}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-sm text-gray-900 truncate">
                                            {item.item_name}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                            <span>Harga: {formatCurrency(item.buying_price)}</span>
                                            <span>•</span>
                                            <span className="text-rose-600 font-medium">Total Keluar: <strong>{item.stock_out} {item.unit}</strong></span>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <Badge
                                            variant={item.status === 'HABIS' ? 'destructive' : 'default'}
                                            className={`text-xs px-2.5 py-1 ${
                                                item.status === 'RENDAH'
                                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                    : item.status === 'AMAN'
                                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                                    : ''
                                            }`}
                                        >
                                            {item.status === 'HABIS' 
                                                ? '0 ' + item.unit + ' (HABIS)' 
                                                : item.current_stock + ' ' + item.unit + ' (' + item.status + ')'}
                                        </Badge>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Min: <strong className="text-gray-700">{item.min_stock} {item.unit}</strong>
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Modal Footer / Navigation to Anggaran */}
                    <div className="border-t pt-3 flex items-center justify-between text-xs text-gray-500">
                        <span>
                            Menampilkan <strong>{filteredItems.length}</strong> dari <strong>{getBaseList().length}</strong> barang
                        </span>
                        <Link
                            href="/anggaran"
                            onClick={() => setIsModalOpen(false)}
                            className="inline-flex items-center gap-1 text-[#009ce4] font-semibold hover:underline"
                        >
                            Ke Rencana Anggaran <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
