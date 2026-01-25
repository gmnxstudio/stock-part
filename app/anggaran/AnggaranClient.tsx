'use client';

import { useState } from 'react';
import { StockInfo } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/format';
import { Download, Plus, Trash2, Check, ChevronsUpDown } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AnggaranClientProps {
    stockInfo: StockInfo[];
}

interface BudgetItem {
    item_id: number;
    item_name: string;
    item_code: string;
    unit: string;
    buying_price: number;
    qty: number;
}

export function AnggaranClient({ stockInfo }: AnggaranClientProps) {
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [openCombobox, setOpenCombobox] = useState(false);
    const [budgetName, setBudgetName] = useState('Anggaran Belanja');
    const [budgetDate, setBudgetDate] = useState(new Date().toISOString().split('T')[0]);

    // Add item to budget
    const handleAddItem = () => {
        if (!selectedItemId) return;

        const item = stockInfo.find((s) => s.item_id.toString() === selectedItemId);
        if (!item) return;

        // Check if already added
        if (budgetItems.some((bi) => bi.item_id === item.item_id)) {
            alert('Barang sudah ada di daftar anggaran');
            return;
        }

        const newItem: BudgetItem = {
            item_id: item.item_id,
            item_name: item.item_name,
            item_code: item.item_code,
            unit: item.unit,
            buying_price: item.buying_price,
            qty: 1, // Default quantity
        };

        setBudgetItems([...budgetItems, newItem]);
        setSelectedItemId('');
    };

    // Update quantity
    const handleQtyChange = (itemId: number, qty: number) => {
        setBudgetItems(
            budgetItems.map((item) =>
                item.item_id === itemId ? { ...item, qty: Math.max(1, qty) } : item
            )
        );
    };

    // Remove item
    const handleRemoveItem = (itemId: number) => {
        setBudgetItems(budgetItems.filter((item) => item.item_id !== itemId));
    };

    // Calculate totals
    const grandTotal = budgetItems.reduce(
        (sum, item) => sum + item.buying_price * item.qty,
        0
    );

    // Generate PDF
    const handleExportPDF = async () => {
        if (budgetItems.length === 0) {
            alert('Belum ada barang yang dipilih untuk anggaran');
            return;
        }

        // Dynamic import to avoid SSR issues
        const jsPDF = (await import('jspdf')).default;
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('ANGGARAN BELANJA', 105, 20, { align: 'center' });

        // Subtitle
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('PT ULU PLASTIK LATERSIA', 105, 28, { align: 'center' });

        // Budget info
        doc.setFontSize(10);
        doc.text(`Nama Anggaran: ${budgetName}`, 14, 45);
        doc.text(`Tanggal: ${formatDate(budgetDate)}`, 14, 52);

        // Table
        const tableData = budgetItems.map((item, index) => [
            index + 1,
            item.item_code,
            item.item_name,
            item.qty,
            item.unit,
            formatCurrency(item.buying_price),
            formatCurrency(item.buying_price * item.qty),
        ]);

        autoTable(doc, {
            startY: 60,
            head: [['No', 'Kode', 'Nama Barang', 'Qty', 'Satuan', 'Harga', 'Subtotal']],
            body: tableData,
            foot: [['', '', '', '', '', 'GRAND TOTAL', formatCurrency(grandTotal)]],
            theme: 'grid',
            headStyles: { fillColor: [0, 156, 228], fontSize: 9, fontStyle: 'bold' },
            footStyles: { fillColor: [240, 240, 240], fontSize: 10, fontStyle: 'bold' },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 25 },
                2: { cellWidth: 60 },
                3: { cellWidth: 15, halign: 'center' },
                4: { cellWidth: 20, halign: 'center' },
                5: { cellWidth: 30, halign: 'right' },
                6: { cellWidth: 30, halign: 'right' },
            },
        });

        // Footer
        const finalY = (doc as any).lastAutoTable.finalY || 60;
        doc.setFontSize(8);
        doc.text(
            `Dicetak pada: ${formatDate(new Date().toISOString())}`,
            14,
            finalY + 15
        );

        // Save
        doc.save(`Anggaran_${budgetName.replace(/\s+/g, '_')}_${budgetDate}.pdf`);
    };

    return (
        <div className="space-y-6">
            {/* Budget Header */}
            <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Informasi Anggaran</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Nama Anggaran</label>
                        <Input
                            value={budgetName}
                            onChange={(e) => setBudgetName(e.target.value)}
                            className="mt-1"
                            placeholder="Contoh: Anggaran Q1 2026"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Tanggal</label>
                        <Input
                            type="date"
                            value={budgetDate}
                            onChange={(e) => setBudgetDate(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                </div>
            </Card>

            {/* Add Item Section */}
            <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Tambah Barang ke Anggaran</h3>
                <div className="flex gap-3">
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openCombobox}
                                className="flex-1 justify-between font-normal h-10"
                            >
                                {selectedItemId
                                    ? (() => {
                                        const item = stockInfo.find((i) => i.item_id.toString() === selectedItemId);
                                        return item ? `${item.item_code} - ${item.item_name}` : "Pilih barang...";
                                    })()
                                    : "Pilih barang..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[500px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Cari barang..." />
                                <CommandList>
                                    <CommandEmpty>Barang tidak ditemukan.</CommandEmpty>
                                    <CommandGroup>
                                        {stockInfo.map((item) => (
                                            <CommandItem
                                                key={item.item_id}
                                                value={`${item.item_code} ${item.item_name}`}
                                                onSelect={() => {
                                                    setSelectedItemId(item.item_id.toString());
                                                    setOpenCombobox(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedItemId === item.item_id.toString() ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <div className="flex items-center gap-2 flex-1">
                                                    <div className="flex flex-col flex-1">
                                                        <span className="font-medium">{item.item_name}</span>
                                                        <span className="text-xs text-gray-500">{item.item_code}</span>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`ml-2 ${item.status === 'HABIS'
                                                            ? 'bg-red-500 text-white'
                                                            : item.status === 'RENDAH'
                                                                ? 'bg-yellow-500 text-white'
                                                                : 'bg-green-500 text-white'
                                                            }`}
                                                    >
                                                        Stok: {item.current_stock}
                                                    </Badge>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Button
                        onClick={handleAddItem}
                        disabled={!selectedItemId}
                        className="bg-[#009ce4] hover:bg-[#0088cc]"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah
                    </Button>
                </div>
            </Card>

            {/* Budget Items Table */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">
                        Daftar Barang ({budgetItems.length})
                    </h3>
                    <Button
                        onClick={handleExportPDF}
                        disabled={budgetItems.length === 0}
                        className="bg-[#7eb93e] hover:bg-[#6da32e]"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Cetak PDF
                    </Button>
                </div>

                {budgetItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">Belum ada barang yang dipilih</p>
                        <p className="text-sm mt-2">
                            Pilih barang dari dropdown di atas untuk menambahkan ke anggaran
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Barang</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead className="text-right">Harga Satuan</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {budgetItems.map((item, index) => {
                                        const subtotal = item.buying_price * item.qty;
                                        return (
                                            <TableRow key={item.item_id}>
                                                <TableCell className="font-medium">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {item.item_code}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.item_name}
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.qty}
                                                        onChange={(e) =>
                                                            handleQtyChange(
                                                                item.item_id,
                                                                parseInt(e.target.value) || 1
                                                            )
                                                        }
                                                        className="w-20 text-center"
                                                    />
                                                </TableCell>
                                                <TableCell>{item.unit}</TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(item.buying_price)}
                                                </TableCell>
                                                <TableCell className="text-right font-bold">
                                                    {formatCurrency(subtotal)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleRemoveItem(item.item_id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Grand Total */}
                        <div className="mt-4 flex justify-end">
                            <Card className="p-4 bg-blue-50 border-[#009ce4]">
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 mb-1">GRAND TOTAL</p>
                                    <p className="text-3xl font-bold text-[#009ce4]">
                                        {formatCurrency(grandTotal)}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}
