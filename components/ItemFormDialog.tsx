'use client';

import { useState, useEffect } from 'react';
import { Item } from '@/types/database';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

interface ItemFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: Item | null;
    categories: { id: number; name: string }[];
    onSubmit: (data: any) => Promise<void>;
}

export function ItemFormDialog({
    open,
    onOpenChange,
    item,
    categories,
    onSubmit,
}: ItemFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        item_code: '',
        item_name: '',
        category_id: '',
        unit: '',
        min_stock: '0',
        buying_price: '0',
    });

    useEffect(() => {
        if (open) {
            setFormData({
                item_code: item?.item_code || '',
                item_name: item?.item_name || '',
                category_id: item?.category_id?.toString() || '',
                unit: item?.unit || '',
                min_stock: item?.min_stock?.toString() || '0',
                buying_price: item?.buying_price?.toString() || '0',
            });
        }
    }, [item, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit({
                ...formData,
                category_id: formData.category_id ? Number(formData.category_id) : null,
                min_stock: Number(formData.min_stock),
                buying_price: Number(formData.buying_price),
            });
            onOpenChange(false);
        } catch (error) {
            alert('Error menyimpan data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {item ? 'Edit Barang' : 'Tambah Barang Baru'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="item_code">Kode Barang *</Label>
                        <Input
                            id="item_code"
                            value={formData.item_code}
                            onChange={(e) =>
                                setFormData({ ...formData, item_code: e.target.value })
                            }
                            placeholder="Contoh: ATK-001"
                            required
                            disabled={!!item} // Can't change code for existing items
                        />
                    </div>

                    <div>
                        <Label htmlFor="item_name">Nama Barang *</Label>
                        <Input
                            id="item_name"
                            value={formData.item_name}
                            onChange={(e) =>
                                setFormData({ ...formData, item_name: e.target.value })
                            }
                            placeholder="Contoh: Spidol Whiteboard"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="category_id">Kategori</Label>
                        <Select
                            value={formData.category_id}
                            onValueChange={(value) =>
                                setFormData({ ...formData, category_id: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="unit">Satuan *</Label>
                            <Input
                                id="unit"
                                value={formData.unit}
                                onChange={(e) =>
                                    setFormData({ ...formData, unit: e.target.value })
                                }
                                placeholder="Pcs, Kg, Box"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="min_stock">Min. Stok</Label>
                            <Input
                                id="min_stock"
                                type="number"
                                value={formData.min_stock}
                                onChange={(e) =>
                                    setFormData({ ...formData, min_stock: e.target.value })
                                }
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="buying_price">Harga Beli (Rp)</Label>
                        <Input
                            id="buying_price"
                            type="number"
                            value={formData.buying_price}
                            onChange={(e) =>
                                setFormData({ ...formData, buying_price: e.target.value })
                            }
                            min="0"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-[#009ce4] hover:bg-[#0088cc]"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
