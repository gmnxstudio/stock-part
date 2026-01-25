'use client';

import { useState } from 'react';
import { Item, Staff } from '@/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTransaction } from '@/services/transaction.service';
import { CheckCircle2 } from 'lucide-react';

interface MobileInputClientProps {
    items: Item[];
    staff: Staff[];
}

export function MobileInputClient({ items, staff }: MobileInputClientProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        item_id: '',
        type: 'MASUK',
        qty: '',
        pic_id: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createTransaction({
                item_id: Number(formData.item_id),
                type: formData.type as 'MASUK' | 'KELUAR',
                qty: Number(formData.qty),
                date: new Date().toISOString().split('T')[0],
                pic_id: formData.pic_id ? Number(formData.pic_id) : undefined,
            });

            setSuccess(true);
            setFormData({ ...formData, item_id: '', qty: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6">
            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-500 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="text-green-600" />
                    <span className="text-green-800 font-medium">Berhasil!</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Label>Tipe</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                            type="button"
                            variant={formData.type === 'MASUK' ? 'default' : 'outline'}
                            className={formData.type === 'MASUK' ? 'bg-green-600' : ''}
                            onClick={() => setFormData({ ...formData, type: 'MASUK' })}
                        >
                            MASUK
                        </Button>
                        <Button
                            type="button"
                            variant={formData.type === 'KELUAR' ? 'destructive' : 'outline'}
                            onClick={() => setFormData({ ...formData, type: 'KELUAR' })}
                        >
                            KELUAR
                        </Button>
                    </div>
                </div>

                <div>
                    <Label htmlFor="item_id">Barang *</Label>
                    <Select
                        value={formData.item_id}
                        onValueChange={(value) => setFormData({ ...formData, item_id: value })}
                        required
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Pilih..." />
                        </SelectTrigger>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem key={item.id} value={item.id.toString()}>
                                    {item.item_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="qty">Jumlah *</Label>
                    <Input
                        id="qty"
                        type="number"
                        value={formData.qty}
                        onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                        min="1"
                        required
                        className="mt-1 text-lg"
                    />
                </div>

                <div>
                    <Label htmlFor="pic_id">PIC</Label>
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
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#009ce4] hover:bg-[#0088cc] h-12 text-lg"
                >
                    {loading ? 'Menyimpan...' : 'SIMPAN'}
                </Button>
            </form>
        </Card>
    );
}
