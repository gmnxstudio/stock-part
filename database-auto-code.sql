-- ==============================================================
-- AUTOMATED ITEM CODE GENERATION & DATABASE MIGRATION SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- ==============================================================

-- 1. MIGRATE EXISTING ITEM CODES TO UNIFORM FORMAT (ATKxxx, MEDxxx, SPRTxxx)
DO $$
DECLARE
  r RECORD;
  v_prefix TEXT;
  v_counter INT;
  v_last_category_id BIGINT := -1;
BEGIN
  -- Iterate over all existing items ordered by category and original ID
  FOR r IN 
    SELECT i.id, i.category_id, c.name AS category_name
    FROM items i
    LEFT JOIN categories c ON i.category_id = c.id
    ORDER BY i.category_id, i.id
  LOOP
    -- Reset counter when moving to a new category
    IF r.category_id IS DISTINCT FROM v_last_category_id THEN
      v_counter := 1;
      v_last_category_id := r.category_id;
    ELSE
      v_counter := v_counter + 1;
    END IF;

    -- Determine Prefix based on Category Name
    IF r.category_name = 'ATK' THEN
      v_prefix := 'ATK';
    ELSIF r.category_name = 'Obat' THEN
      v_prefix := 'MED';
    ELSIF r.category_name = 'Sparepart Mesin' THEN
      v_prefix := 'SPRT';
    ELSE
      -- Fallback for other categories: take first 3 uppercase letters or 'BRG'
      v_prefix := COALESCE(NULLIF(regexp_replace(UPPER(r.category_name), '[^A-Z]', '', 'g'), ''), 'BRG');
      IF length(v_prefix) > 3 THEN
        v_prefix := SUBSTRING(v_prefix FROM 1 FOR 3);
      END IF;
    END IF;

    -- Update item_code with temporary suffix to prevent unique constraint conflict during loop
    UPDATE items 
    SET item_code = v_prefix || LPAD(v_counter::TEXT, 3, '0') || '_temp'
    WHERE id = r.id;
  END LOOP;

  -- Clean up temporary suffix
  UPDATE items 
  SET item_code = REPLACE(item_code, '_temp', '')
  WHERE item_code LIKE '%_temp';

END $$;

-- 2. CREATE TRIGGER FUNCTION FOR AUTOMATIC CODE GENERATION ON NEW INSERTS
CREATE OR REPLACE FUNCTION generate_item_code()
RETURNS TRIGGER AS $$
DECLARE
  v_category_name TEXT;
  v_prefix TEXT;
  v_next_num INT;
  v_new_code TEXT;
BEGIN
  -- Get category name for the inserted item
  IF NEW.category_id IS NOT NULL THEN
    SELECT name INTO v_category_name FROM categories WHERE id = NEW.category_id;
  END IF;

  -- Determine Prefix based on Category Name
  IF v_category_name = 'ATK' THEN
    v_prefix := 'ATK';
  ELSIF v_category_name = 'Obat' THEN
    v_prefix := 'MED';
  ELSIF v_category_name = 'Sparepart Mesin' THEN
    v_prefix := 'SPRT';
  ELSIF v_category_name IS NOT NULL THEN
    v_prefix := COALESCE(NULLIF(regexp_replace(UPPER(v_category_name), '[^A-Z]', '', 'g'), ''), 'BRG');
    IF length(v_prefix) > 3 THEN
      v_prefix := SUBSTRING(v_prefix FROM 1 FOR 3);
    END IF;
  ELSE
    v_prefix := 'BRG';
  END IF;

  -- Lock current items for this prefix to avoid concurrent sequence duplication
  PERFORM id FROM items WHERE item_code ~ ('^' || v_prefix || '[0-9]+$') FOR UPDATE;

  -- Find the highest numeric suffix for this prefix
  SELECT COALESCE(
    MAX(
      NULLIF(regexp_replace(item_code, '^' || v_prefix, ''), '')::INTEGER
    ), 
    0
  ) INTO v_next_num
  FROM items
  WHERE item_code ~ ('^' || v_prefix || '[0-9]+$');

  -- Increment number and format with leading zeros (3 digits)
  v_next_num := v_next_num + 1;
  v_new_code := v_prefix || LPAD(v_next_num::TEXT, 3, '0');

  -- Assign newly generated code
  NEW.item_code := v_new_code;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. BIND TRIGGER TO ITEMS TABLE FOR AUTO-CODE
DROP TRIGGER IF EXISTS trg_generate_item_code ON items;
CREATE TRIGGER trg_generate_item_code
BEFORE INSERT ON items
FOR EACH ROW
EXECUTE FUNCTION generate_item_code();

-- 4. BIND TRIGGER TO ITEMS TABLE FOR REFRESHING STOCK SUMMARY VIEW
-- This ensures new items instantly appear in CariPart and DataEntry
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trigger_refresh_stock_summary') THEN
    DROP TRIGGER IF EXISTS auto_refresh_stock_summary_items ON items;
    CREATE TRIGGER auto_refresh_stock_summary_items
    AFTER INSERT OR UPDATE OR DELETE ON items
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_refresh_stock_summary();
  END IF;
END $$;

