import { getAllItems, getAllStaff } from '@/services/data.service';
import { DataEntryClient } from './DataEntryClient';

export default async function DataEntryPage() {
    const items = await getAllItems();
    const staff = await getAllStaff();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Entry</h1>
                <p className="text-gray-600 mt-1">Form input transaksi stok masuk/keluar</p>
            </div>

            <DataEntryClient items={items} staff={staff} />
        </div>
    );
}
