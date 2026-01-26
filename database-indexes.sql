-- =====================================================
-- PERFORMANCE OPTIMIZATION: DATABASE INDEXES
-- Stock Management System - PT Ulu Plastik Latersia
-- =====================================================
-- Execute this in Supabase SQL Editor
-- Estimated execution time: 30-60 seconds
-- =====================================================

-- 1. ITEMS TABLE INDEXES
-- Accelerate item searches by code and name
CREATE INDEX IF NOT EXISTS idx_items_code ON items(item_code);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(item_name);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);

-- Composite index for combined search (code + name)
CREATE INDEX IF NOT EXISTS idx_items_code_name ON items(item_code, item_name);

-- Full-text search index for item names (optional, for advanced search)
CREATE INDEX IF NOT EXISTS idx_items_name_text ON items USING GIN (to_tsvector('indonesian', item_name));

-- 2. TRANSACTIONS TABLE INDEXES
-- Accelerate transaction history queries
CREATE INDEX IF NOT EXISTS idx_transactions_item ON transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);

-- Composite index for item stock calculation (most important!)
CREATE INDEX IF NOT EXISTS idx_transactions_item_date ON transactions(item_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_item_type ON transactions(item_id, type);

-- 3. STAFF RELATIONSHIPS
-- Speed up JOIN operations
CREATE INDEX IF NOT EXISTS idx_transactions_pic ON transactions(pic_id);
CREATE INDEX IF NOT EXISTS idx_transactions_witness ON transactions(witness_id);

-- 4. BUDGET ITEMS
-- Accelerate budget reports
CREATE INDEX IF NOT EXISTS idx_budget_items_budget ON budget_items(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_item ON budget_items(item_id);

-- 5. CATEGORIES TABLE
-- Simple name index for dropdown/autocomplete
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- =====================================================
-- UPDATE TABLE STATISTICS FOR QUERY PLANNER
-- =====================================================
ANALYZE items;
ANALYZE transactions;
ANALYZE budget_items;
ANALYZE categories;
ANALYZE staff;

-- =====================================================
-- VERIFICATION QUERIES
-- Run these to verify indexes were created
-- =====================================================
-- SELECT 
--     schemaname,
--     tablename,
--     indexname,
--     indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;
