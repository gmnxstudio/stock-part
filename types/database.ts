// TypeScript types for the Stock Management System
// These match the database schema

export interface Category {
  id: number;
  name: string;
  created_at?: string;
}

export interface Staff {
  id: number;
  name: string;
  position?: string;
  created_at?: string;
}

export interface Item {
  id: number;
  item_code: string;
  item_name: string;
  category_id?: number;
  unit: string;
  min_stock: number;
  buying_price: number;
  created_at?: string;
  // Joined fields
  category?: Category;
}

export interface Transaction {
  id: number;
  item_id: number;
  type: 'MASUK' | 'KELUAR';
  qty: number;
  date: string;
  pic_id?: number;
  witness_id?: number;
  note_number?: string;
  remarks?: string;
  created_at?: string;
  // Joined fields
  item?: Item;
  pic?: Staff;
  witness?: Staff;
}

export interface Budget {
  id: number;
  budget_name: string;
  total_amount: number;
  status: 'Draft' | 'Approved';
  created_at?: string;
}

export interface BudgetItem {
  id: number;
  budget_id: number;
  item_id: number;
  qty: number;
  estimated_price: number;
  created_at?: string;
  // Joined fields
  item?: Item;
}

// Stock calculation result
export interface StockInfo {
  item_id: number;
  item_code: string;
  item_name: string;
  category_name?: string;
  unit: string;
  stock_in: number;
  stock_out: number;
  current_stock: number;
  min_stock: number;
  buying_price: number;
  total_value: number;
  status: 'AMAN' | 'RENDAH' | 'HABIS'; // Green, Yellow, Red
}

// Form types for data entry
export interface TransactionFormData {
  item_id: number;
  type: 'MASUK' | 'KELUAR';
  qty: number;
  date: string;
  pic_id?: number;
  witness_id?: number;
  note_number?: string;
  remarks?: string;
}
