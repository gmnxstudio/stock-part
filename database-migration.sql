-- ============================================
-- STOCK BARANG ULU PLASTIK LATERSIA - DATABASE SCHEMA
-- ============================================
-- Run this script in your Supabase SQL Editor
-- This will create all the necessary tables for the system

-- 1. CATEGORIES TABLE (Kategori Barang)
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STAFF TABLE (Data Pegawai)
CREATE TABLE IF NOT EXISTS staff (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ITEMS TABLE (Data Barang/Sparepart)
CREATE TABLE IF NOT EXISTS items (
  id BIGSERIAL PRIMARY KEY,
  item_code TEXT NOT NULL UNIQUE,
  item_name TEXT NOT NULL,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  unit TEXT NOT NULL,
  min_stock NUMERIC DEFAULT 0,
  buying_price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRANSACTIONS TABLE (Transaksi Masuk/Keluar)
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('MASUK', 'KELUAR')),
  qty NUMERIC NOT NULL CHECK (qty > 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  pic_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  witness_id BIGINT REFERENCES staff(id) ON DELETE SET NULL,
  note_number TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BUDGETS TABLE (Anggaran Belanja)
CREATE TABLE IF NOT EXISTS budgets (
  id BIGSERIAL PRIMARY KEY,
  budget_name TEXT NOT NULL,
  total_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Approved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BUDGET_ITEMS TABLE (Detail Item Anggaran)
CREATE TABLE IF NOT EXISTS budget_items (
  id BIGSERIAL PRIMARY KEY,
  budget_id BIGINT NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  qty NUMERIC NOT NULL CHECK (qty > 0),
  estimated_price NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_transactions_item_id ON transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_item_id ON budget_items(item_id);

-- ============================================
-- INSERT SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Sample Categories
INSERT INTO categories (name) VALUES
  ('ATK'),
  ('Sparepart Mesin'),
  ('Bahan Baku'),
  ('Alat Kebersihan')
ON CONFLICT (name) DO NOTHING;

-- Sample Staff
INSERT INTO staff (name, position) VALUES
  ('Budi Santoso', 'Manager Gudang'),
  ('Siti Rahayu', 'Staff Gudang'),
  ('Ahmad Hidayat', 'Supervisor')
ON CONFLICT DO NOTHING;

-- Sample Items
INSERT INTO items (item_code, item_name, category_id, unit, min_stock, buying_price) VALUES
  ('ATK-001', 'Spidol Whiteboard', 1, 'Pcs', 10, 5000),
  ('SPR-001', 'Bearing 6205', 2, 'Pcs', 5, 50000),
  ('BHN-001', 'Plastik HDPE', 3, 'Kg', 100, 15000)
ON CONFLICT (item_code) DO NOTHING;

-- ============================================
-- DONE! Your database is ready to use.
-- ============================================
