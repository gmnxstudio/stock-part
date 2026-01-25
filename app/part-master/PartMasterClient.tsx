'use client';

import { useState } from 'react';
import { Item, Category } from '@/types/database';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { ItemFormDialog } from '@/components/ItemFormDialog';
import { createItem, updateItem, deleteItem } from '@/services/data.service';

interface PartMasterClientProps {
    initialItems: Item[];
    categories: Category[];
}

export function PartMasterClient({ initialItems, categories }: PartMasterClientProps) {
    const [items, setItems] = useState(initialItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const filteredItems = items.filter(
        (item) =>
            item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.item_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedItem(null);
        setDialogOpen(true);
    };

    const handleEdit = (item: Item) => {
        setSelectedItem(item);
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus barang ini?')) return;

        try {
            await deleteItem(id);
            setItems(items.filter((item) => item.id !== id));
        } catch (error) {
            alert('Error menghapus data');
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            if (selectedItem) {
                // Update
                const updated = await updateItem(selectedItem.id, data);
                setItems(items.map((item) => (item.id === selectedItem.id ? updated : item)));
            } else {
                // Create
                const newItem = await createItem(data);
                setItems([...items, newItem]);
            }
            setDialogOpen(false);
        } catch (error: any) {
            throw error;
        }
    };

    return (
        <>
            <Card>
                <div className="p-4 md:p-6">
                    {/* Search and Add Button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Cari berdasarkan nama atau kode barang..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            onClick={handleCreate}
                            className="bg-[#009ce4] hover:bg-[#0088cc] w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Tambah Barang</span>
                            <span className="sm:hidden">Tambah</span>
                        </Button>
                    </div>

                    {/* Items Table - Responsive wrapper */}
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                        <div className="inline-block min-w-full align-middle px-4 md:px-0">
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="whitespace-nowrap">Kode</TableHead>
                                            <TableHead className="whitespace-nowrap">Nama Barang</TableHead>
                                            <TableHead className="whitespace-nowrap">Kategori</TableHead>
                                            <TableHead className="whitespace-nowrap">Satuan</TableHead>
                                            <TableHead className="text-right whitespace-nowrap">Min. Stok</TableHead>
                                            <TableHead className="text-right whitespace-nowrap">Harga Beli</TableHead>
                                            <TableHead className="text-center whitespace-nowrap">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                    {searchTerm ? 'Tidak ada data yang cocok' : 'Belum ada data barang'}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredItems.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-mono text-sm whitespace-nowrap">
                                                        {item.item_code}
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.item_name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="whitespace-nowrap">
                                                            {(item.category as any)?.name || '-'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{item.unit}</TableCell>
                                                    <TableCell className="text-right">{item.min_stock}</TableCell>
                                                    <TableCell className="text-right whitespace-nowrap">
                                                        {formatCurrency(item.buying_price)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleEdit(item)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(item.id)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                        Menampilkan {filteredItems.length} dari {items.length} barang
                    </div>
                </div>
            </Card>

            <ItemFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                item={selectedItem}
                categories={categories}
                onSubmit={handleSubmit}
            />
        </>
    );
}
