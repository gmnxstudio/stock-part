-- ==============================================================
-- DATABASE SECURITY & INTEGRITY FIXES
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- ==============================================================

-- 1. ADD NON-NEGATIVE CONSTRAINTS TO ITEMS TABLE
-- This prevents negative values for stock limit and buying price
ALTER TABLE items ADD CONSTRAINT check_min_stock_non_negative CHECK (min_stock >= 0);
ALTER TABLE items ADD CONSTRAINT check_buying_price_non_negative CHECK (buying_price >= 0);

-- 2. CREATE A TRIGGER FUNCTION TO PREVENT STOCK RACE CONDITIONS
-- This locks the item row and verifies stock availability before insertion
CREATE OR REPLACE FUNCTION check_stock_before_transaction()
RETURNS TRIGGER AS $$
DECLARE
  v_current_stock NUMERIC;
  v_stock_in NUMERIC;
  v_stock_out NUMERIC;
BEGIN
  -- Lock the item row in the items table. 
  -- This serializes all concurrent operations for this specific item.
  PERFORM id FROM items WHERE id = NEW.item_id FOR UPDATE;

  -- Calculate current stock, excluding the current transaction row (useful during UPDATE)
  SELECT COALESCE(SUM(qty), 0) INTO v_stock_in 
  FROM transactions 
  WHERE item_id = NEW.item_id AND type = 'MASUK' AND (TG_OP = 'INSERT' OR id != NEW.id);
  
  SELECT COALESCE(SUM(qty), 0) INTO v_stock_out 
  FROM transactions 
  WHERE item_id = NEW.item_id AND type = 'KELUAR' AND (TG_OP = 'INSERT' OR id != NEW.id);
  
  v_current_stock := v_stock_in - v_stock_out;

  -- If this is an outgoing transaction, ensure we have enough stock
  IF NEW.type = 'KELUAR' THEN
    IF NEW.qty > v_current_stock THEN
      RAISE EXCEPTION 'Stok tidak mencukupi! Tersedia: %, diminta: %', v_current_stock, NEW.qty;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to the transactions table
DROP TRIGGER IF EXISTS trg_check_stock_before_transaction ON transactions;
CREATE TRIGGER trg_check_stock_before_transaction
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION check_stock_before_transaction();

-- 3. ACTIVATE ROW LEVEL SECURITY (RLS) FOR DEFENSE-IN-DEPTH
-- This is optional but highly recommended to prevent direct API manipulation.
-- Uncomment the lines below if you wish to enforce RLS and restrict public access:
--
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
--
-- -- Example policy: Anyone can read items (SELECT)
-- CREATE POLICY "Allow read access to anyone" ON items FOR SELECT USING (true);
--
-- -- Example policy: Only authenticated service role can insert/update/delete
-- CREATE POLICY "Restrict write to Service Role" ON items FOR ALL USING (auth.role() = 'service_role');
