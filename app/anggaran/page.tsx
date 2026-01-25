import { getAllStockInfo } from '@/services/stock.service';
import { AnggaranClient } from './AnggaranClient';

export default async function AnggaranPage() {
    const stockInfo = await getAllStockInfo();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Anggaran Belanja</h1>
                <p className="text-gray-600 mt-1">Perencanaan pembelian barang yang stok rendah</p>
            </div>

            <AnggaranClient stockInfo={stockInfo} />
        </div>
    );
}
