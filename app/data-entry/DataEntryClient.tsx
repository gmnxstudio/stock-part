'use client';

import { useState } from 'react';
import { Item, Staff } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Check, ChevronsUpDown } from 'lucide-react';
import { createTransaction } from '@/services/transaction.service';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

interface DataEntryClientProps {
    items: Item[];
    staff: Staff[];
}

export function DataEntryClient({ items, staff }: DataEntryClientProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openCombobox, setOpenCombobox] = useState(false);
    const [formData, setFormData] = useState({
        item_id: '',
        type: 'MASUK',
        qty: '',
        date: new Date().toISOString().split('T')[0],
        pic_id: '',
        witness_id: '',
        remarks: '',
    });

    const selectedItem = items.find((item) => item.id.toString() === formData.item_id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            await createTransaction({
                item_id: Number(formData.item_id),
                type: formData.type as 'MASUK' | 'KELUAR',
                qty: Number(formData.qty),
                date: formData.date,
                pic_id: formData.pic_id ? Number(formData.pic_id) : undefined,
                witness_id: formData.witness_id ? Number(formData.witness_id) : undefined,
                remarks: formData.remarks || undefined,
            });

            setSuccess(true);
            // Reset form
            setFormData({
                ...formData,
                item_id: '',
                qty: '',
                remarks: '',
            });
        } catch (error: any) {
            alert(error.message || 'Error menyimpan transaksi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6">
            {success && (
                <Alert className="mb-6 bg-green-50 border-green-500">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertDescription className="text-green-800">
                        ✅ Transaksi berhasil disimpan!
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="type">Tipe Transaksi *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MASUK">
                                        <span className="text-green-600 font-medium">MASUK (+)</span>
                                    </SelectItem>
                                    <SelectItem value="KELUAR">
                                        <span className="text-red-600 font-medium">KELUAR (-)</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Nama Barang *</Label>
                            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCombobox}
                                        className="w-full justify-between mt-1 font-normal h-10"
                                    >
                                        {formData.item_id
                                            ? (() => {
                                                const item = items.find((i) => i.id.toString() === formData.item_id);
                                                return item ? `${item.item_code} - ${item.item_name}` : "Pilih barang...";
                                            })()
                                            : "Pilih barang..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[var(--radix-popover-trigger-width)] p-0"
                                    align="start"
                                    side="bottom"
                                    sideOffset={4}
                                >
                                    <Command className="rounded-lg border shadow-md">
                                        <CommandInput placeholder="Cari barang..." className="h-12" />
                                        <CommandList className="max-h-[60vh] overflow-y-auto">
                                            <CommandEmpty className="py-6 text-center text-sm">Barang tidak ditemukan.</CommandEmpty>
                                            <CommandGroup>
                                                {items.map((item) => (
                                                    <CommandItem
                                                        key={item.id}
                                                        value={`${item.item_code} ${item.item_name}`}
                                                        onSelect={() => {
                                                            setFormData({ ...formData, item_id: item.id.toString() });
                                                            setOpenCombobox(false);
                                                        }}
                                                        className="min-h-[3rem] py-3 cursor-pointer"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4 flex-shrink-0",
                                                                formData.item_id === item.id.toString() ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <div className="flex flex-col flex-1 min-w-0">
                                                            <span className="font-medium truncate">{item.item_name}</span>
                                                            <span className="text-xs text-gray-500">{item.item_code}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {selectedItem && (
                            <div className="p-3 bg-blue-50 rounded-lg text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-gray-600">Kategori:</span>{' '}
                                        <strong>{(selectedItem.category as any)?.name || '-'}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Satuan:</span>{' '}
                                        <strong>{selectedItem.unit}</strong>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Harga:</span>{' '}
                                        <strong>
                                            {formatCurrency(selectedItem.buying_price)}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="qty">Jumlah *</Label>
                            <Input
                                id="qty"
                                type="number"
                                value={formData.qty}
                                onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                                min="1"
                                required
                                className="mt-1"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <Label htmlFor="date">Tanggal *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="pic_id">PIC (Penanggung Jawab)</Label>
                            <Select
                                value={formData.pic_id}
                                onValueChange={(value) => setFormData({ ...formData, pic_id: value })}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Pilih PIC..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {staff.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name} {s.position && `(${s.position})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="witness_id">Mengetahui</Label>
                            <Select
                                value={formData.witness_id}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, witness_id: value })
                                }
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Pilih yang mengetahui..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {staff.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name} {s.position && `(${s.position})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>


                        <div>
                            <Label htmlFor="remarks">Keterangan</Label>
                            <Input
                                id="remarks"
                                value={formData.remarks}
                                onChange={(e) =>
                                    setFormData({ ...formData, remarks: e.target.value })
                                }
                                className="mt-1"
                                placeholder="Opsional"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            setFormData({
                                ...formData,
                                item_id: '',
                                qty: '',
                                remarks: '',
                            })
                        }
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-[#009ce4] hover:bg-[#0088cc]"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
