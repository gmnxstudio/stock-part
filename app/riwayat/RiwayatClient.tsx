'use client';

import { useState } from 'react';
import { Transaction } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/format';

interface RiwayatClientProps {
    initialTransactions: Transaction[];
}

export function RiwayatClient({ initialTransactions }: RiwayatClientProps) {
    const [transactions] = useState(initialTransactions);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const filteredTransactions = transactions.filter((t) => {
        if (dateFrom && t.date < dateFrom) return false;
        if (dateTo && t.date > dateTo) return false;
        return true;
    });

    const filterByType = (type?: 'MASUK' | 'KELUAR') => {
        return type
            ? filteredTransactions.filter((t) => t.type === type)
            : filteredTransactions;
    };

    const TransactionTable = ({ data }: { data: Transaction[] }) => (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Barang</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead>PIC</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((trans) => (
                            <TableRow key={trans.id}>
                                <TableCell>
                                    {formatDate(trans.date)}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {(trans.item as any)?.item_name || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={trans.type === 'MASUK' ? 'default' : 'secondary'}
                                        className={
                                            trans.type === 'MASUK'
                                                ? 'bg-[#7eb93e] hover:bg-[#6da32e]'
                                                : 'bg-red-500 hover:bg-red-600'
                                        }
                                    >
                                        {trans.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {trans.type === 'MASUK' ? '+' : '-'} {trans.qty}
                                </TableCell>
                                <TableCell>{(trans.pic as any)?.name || '-'}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <Card className="p-6">
            {/* Date Filter */}
            <div className="mb-6 grid md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="dateFrom">Dari Tanggal</Label>
                    <Input
                        id="dateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="dateTo">Sampai Tanggal</Label>
                    <Input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="mt-1"
                    />
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="all">
                        Semua ({filteredTransactions.length})
                    </TabsTrigger>
                    <TabsTrigger value="masuk">
                        Masuk ({filterByType('MASUK').length})
                    </TabsTrigger>
                    <TabsTrigger value="keluar">
                        Keluar ({filterByType('KELUAR').length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <TransactionTable data={filteredTransactions} />
                </TabsContent>

                <TabsContent value="masuk">
                    <TransactionTable data={filterByType('MASUK')} />
                </TabsContent>

                <TabsContent value="keluar">
                    <TransactionTable data={filterByType('KELUAR')} />
                </TabsContent>
            </Tabs>
        </Card>
    );
}
