import { getAllTransactions } from '@/services/transaction.service';
import { RiwayatClient } from './RiwayatClient';

export default async function RiwayatPage() {
    const transactions = await getAllTransactions();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Riwayat & Laporan</h1>
                <p className="text-gray-600 mt-1">Daftar transaksi dan filter laporan</p>
            </div>

            <RiwayatClient initialTransactions={transactions} />
        </div>
    );
}
