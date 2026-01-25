'use client';

import { useState } from 'react';
import { StockInfo } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface AnggaranClientProps {
    stockInfo: StockInfo[];
}

export function AnggaranClient({ stockInfo }: AnggaranClientProps) {
    const criticalItems = stockInfo.filter((item) => item.status !== 'AMAN');
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    const toggleItem = (itemId: number) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    const selectedStockItems = criticalItems.filter((item) =>
        selectedItems.has(item.item_id)
    );

    const totalEstimate = selectedStockItems.reduce((sum, item) => {
        const qtyNeeded = Math.max(item.min_stock * 1.5 - item.current_stock, 0);
        return sum + qtyNeeded * item.buying_price;
    }, 0);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <>
            <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                    Barang yang Perlu Dibeli ({criticalItems.length})
                </h3>

                {criticalItems.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                        ✅ Semua stok dalam kondisi aman
                    </p>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12"></TableHead>
                                    <TableHead>Barang</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Stok</TableHead>
                                    <TableHead className="text-right">Min</TableHead>
                                    <TableHead className="text-right">Perlu Beli</TableHead>
                                    <TableHead className="text-right">Harga</TableHead>
                                    <TableHead className="text-right">Estimasi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {criticalItems.map((item) => {
                                    const qtyNeeded = Math.ceil(
                                        Math.max(item.min_stock * 1.5 - item.current_stock, 0)
                                    );
                                    const estimate = qtyNeeded * item.buying_price;

                                    return (
                                        <TableRow key={item.item_id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedItems.has(item.item_id)}
                                                    onCheckedChange={() => toggleItem(item.item_id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.item_name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        item.status === 'HABIS' ? 'destructive' : 'default'
                                                    }
                                                    className={
                                                        item.status === 'RENDAH'
                                                            ? 'bg-yellow-500'
                                                            : ''
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.current_stock} {item.unit}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item.min_stock}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {qtyNeeded} {item.unit}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatCurrency(item.buying_price)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                {formatCurrency(estimate)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>

            {selectedItems.size > 0 && (
                <Card className="p-6 bg-blue-50 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg">Ringkasan Anggaran</h3>
                            <p className="text-gray-600">
                                {selectedItems.size} barang dipilih
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total Estimasi</p>
                            <p className="text-3xl font-bold text-[#009ce4]">
                                {formatCurrency(totalEstimate)}
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
}
