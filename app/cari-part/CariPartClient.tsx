'use client';

import { useState } from 'react';
import { StockInfo } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';
import { Search } from 'lucide-react';

interface CariPartClientProps {
    stockInfo: StockInfo[];
}

export function CariPartClient({ stockInfo }: CariPartClientProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStock = stockInfo.filter(
        (item) =>
            item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'HABIS':
                return 'bg-red-500';
            case 'RENDAH':
                return 'bg-yellow-500';
            default:
                return 'bg-[#7eb93e]';
        }
    };

    return (
        <Card className="p-6">
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="Ketik nama, kode, atau kategori barang..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-lg h-12"
                        autoFocus
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filteredStock.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                        {searchTerm ? 'Tidak ditemukan' : 'Mulai ketik untuk mencari...'}
                    </p>
                ) : (
                    filteredStock.map((item) => (
                        <Card key={item.item_id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{item.item_name}</h3>
                                        <Badge
                                            className={`${getStatusColor(item.status)} text-white`}
                                        >
                                            {item.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Kode: <span className="font-mono">{item.item_code}</span> •{' '}
                                        {item.category_name}
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Stok:</span>{' '}
                                            <strong className="text-lg">
                                                {item.current_stock} {item.unit}
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Masuk:</span>{' '}
                                            <strong className="text-green-600">+{item.stock_in}</strong>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Keluar:</span>{' '}
                                            <strong className="text-red-600">-{item.stock_out}</strong>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Harga:</span>{' '}
                                            <strong>{formatCurrency(item.buying_price)}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <div className="mt-6 text-sm text-gray-500 text-center">
                Menampilkan {filteredStock.length} dari {stockInfo.length} barang
            </div>
        </Card>
    );
}
