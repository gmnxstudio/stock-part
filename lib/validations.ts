import { z } from 'zod';

export const itemSchema = z.object({
  item_code: z.string().trim().min(1, 'Kode barang tidak boleh kosong'),
  item_name: z.string().trim().min(1, 'Nama barang tidak boleh kosong'),
  category_id: z.number({ message: 'Kategori harus dipilih' }),
  unit: z.string().trim().min(1, 'Satuan tidak boleh kosong'),
  min_stock: z.number({ message: 'Minimal stok harus diisi' }).nonnegative('Minimal stok tidak boleh kurang dari 0'),
  buying_price: z.number({ message: 'Harga beli harus diisi' }).nonnegative('Harga beli tidak boleh kurang dari 0'),
});

export const transactionSchema = z.object({
  item_id: z.number({ message: 'Item ID diperlukan' }),
  type: z.enum(['MASUK', 'KELUAR'], { message: 'Tipe transaksi tidak valid' }),
  qty: z.number().positive('Jumlah harus lebih besar dari 0'),
  date: z.string().min(1, 'Tanggal diperlukan'),
  pic_id: z.number({ message: 'PIC (Penanggung Jawab) wajib dipilih' }),
  witness_id: z.number().nullable().optional(),
  note_number: z.string().trim().nullable().optional(),
  remarks: z.string().trim().nullable().optional(),
});
