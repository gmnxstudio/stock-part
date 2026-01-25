import { getAllStockInfo } from '@/services/stock.service';
import { CariPartClient } from './CariPartClient';

export default async function CariPartPage() {
    const stockInfo = await getAllStockInfo();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">CariPart</h1>
                <p className="text-gray-600 mt-1">Pencarian cepat stok barang</p>
            </div>

            <CariPartClient stockInfo={stockInfo} />
        </div>
    );
}
