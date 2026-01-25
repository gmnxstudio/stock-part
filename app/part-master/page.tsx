import { getAllItems, getAllCategories, createItem, updateItem, deleteItem } from '@/services/data.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { PartMasterClient } from './PartMasterClient';

export default async function PartMasterPage() {
    const items = await getAllItems();
    const categories = await getAllCategories();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Part Master</h1>
                    <p className="text-gray-600 mt-1">Kelola data barang dan harga beli</p>
                </div>
            </div>

            <PartMasterClient
                initialItems={items}
                categories={categories}
            />
        </div>
    );
}
