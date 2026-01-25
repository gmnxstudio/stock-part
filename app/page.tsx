import { getDashboardStats } from '@/services/stock.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Package,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Ringkasan stok dan transaksi terbaru
        </p>
      </div>

      {/* Critical Stock Alerts */}
      {stats.criticalCount > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Perhatian!</strong> Ada {stats.criticalCount} barang dengan
            stok kritis yang memerlukan perhatian segera.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Asset Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Nilai Aset
            </CardTitle>
            <DollarSign className="h-5 w-5 text-[#009ce4]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalValue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Dari {stats.totalItems} jenis barang
            </p>
          </CardContent>
        </Card>

        {/* Out of Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Stok Habis
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.outOfStockCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">Perlu segera dibeli</p>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Stok Rendah
            </CardTitle>
            <Package className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.lowStockCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Di bawah minimum stock
            </p>
          </CardContent>
        </Card>

        {/* Total Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Barang
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-[#7eb93e]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalItems}
            </div>
            <p className="text-xs text-gray-500 mt-1">Jenis barang aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Critical Stock Items */}
        <Card>
          <CardHeader>
            <CardTitle>Barang Kritis</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.criticalItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                ✅ Semua stok dalam kondisi aman
              </p>
            ) : (
              <div className="space-y-3">
                {stats.criticalItems.slice(0, 5).map((item) => (
                  <div
                    key={item.item_id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.item_name}</p>
                      <p className="text-xs text-gray-500">
                        Kode: {item.item_code} • {item.category_name}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <Badge
                        variant={
                          item.status === 'HABIS' ? 'destructive' : 'default'
                        }
                        className={
                          item.status === 'RENDAH'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : ''
                        }
                      >
                        {item.current_stock} {item.unit}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Min: {item.min_stock}
                      </p>
                    </div>
                  </div>
                ))}
                {stats.criticalItems.length > 5 && (
                  <p className="text-xs text-center text-gray-500 pt-2">
                    +{stats.criticalItems.length - 5} barang lainnya
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada transaksi
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentTransactions.map((trans: any) => (
                  <div
                    key={trans.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {trans.item?.item_name || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {trans.pic?.name || 'N/A'} •{' '}
                        {formatDate(trans.date)}
                      </p>
                    </div>
                    <Badge
                      variant={trans.type === 'MASUK' ? 'default' : 'secondary'}
                      className={
                        trans.type === 'MASUK'
                          ? 'bg-[#7eb93e] hover:bg-[#6da32e]'
                          : ''
                      }
                    >
                      {trans.type === 'MASUK' ? '+' : '-'} {trans.qty}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
