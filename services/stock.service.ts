'use server';

import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Item, StockInfo, Transaction } from '@/types/database';

/**
 * CORE BUSINESS LOGIC: Stock Calculation Service
 * 
 * This service calculates current stock levels in real-time.
 * Stock = Total IN - Total OUT (never stored as static value)
 */

// Get current stock for a specific item
export async function getCurrentStock(itemId: number): Promise<number> {
    try {
        // Calculate stock from transactions
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('type, qty')
            .eq('item_id', itemId);

        if (error) handleSupabaseError(error, 'getCurrentStock');

        if (!transactions) return 0;

        const totalIn = transactions
            .filter(t => t.type === 'MASUK')
            .reduce((sum, t) => sum + Number(t.qty), 0);

        const totalOut = transactions
            .filter(t => t.type === 'KELUAR')
            .reduce((sum, t) => sum + Number(t.qty), 0);

        return totalIn - totalOut;
    } catch (error) {
        console.error('Error calculating stock:', error);
        return 0;
    }
}

// Get stock information for all items
export async function getAllStockInfo(): Promise<StockInfo[]> {
    try {
        // Get all items with categories
        const { data: items, error: itemsError } = await supabase
            .from('items')
            .select(`
        id,
        item_code,
        item_name,
        unit,
        min_stock,
        buying_price,
        category:categories(name)
      `)
            .order('item_name');

        if (itemsError) handleSupabaseError(itemsError, 'getAllStockInfo - items');

        // Get all transactions
        const { data: transactions, error: transError } = await supabase
            .from('transactions')
            .select('item_id, type, qty');

        if (transError) handleSupabaseError(transError, 'getAllStockInfo - transactions');

        // Calculate stock for each item
        const stockInfo: StockInfo[] = (items || []).map(item => {
            const itemTransactions = (transactions || []).filter(t => t.item_id === item.id);

            const stockIn = itemTransactions
                .filter(t => t.type === 'MASUK')
                .reduce((sum, t) => sum + Number(t.qty), 0);

            const stockOut = itemTransactions
                .filter(t => t.type === 'KELUAR')
                .reduce((sum, t) => sum + Number(t.qty), 0);

            const currentStock = stockIn - stockOut;
            const totalValue = currentStock * Number(item.buying_price);

            // Determine status: AMAN (green), RENDAH (yellow), HABIS (red)
            let status: 'AMAN' | 'RENDAH' | 'HABIS' = 'AMAN';
            if (currentStock === 0) {
                status = 'HABIS';
            } else if (currentStock <= Number(item.min_stock)) {
                status = 'RENDAH';
            }

            return {
                item_id: item.id,
                item_code: item.item_code,
                item_name: item.item_name,
                category_name: (item.category as any)?.name || '-',
                unit: item.unit,
                stock_in: stockIn,
                stock_out: stockOut,
                current_stock: currentStock,
                min_stock: Number(item.min_stock),
                buying_price: Number(item.buying_price),
                total_value: totalValue,
                status,
            };
        });

        return stockInfo;
    } catch (error) {
        console.error('Error getting stock info:', error);
        return [];
    }
}

// Validate if stock is sufficient for outgoing transaction
export async function validateStockForTransaction(
    itemId: number,
    qtyOut: number
): Promise<{ valid: boolean; message: string; currentStock: number }> {
    const currentStock = await getCurrentStock(itemId);

    if (qtyOut > currentStock) {
        return {
            valid: false,
            message: `❌ Stok tidak cukup! Tersedia: ${currentStock}, diminta: ${qtyOut}`,
            currentStock,
        };
    }

    return {
        valid: true,
        message: '✅ Stok cukup',
        currentStock,
    };
}

// Get dashboard statistics
export async function getDashboardStats() {
    try {
        const stockInfo = await getAllStockInfo();

        const totalValue = stockInfo.reduce((sum, item) => sum + item.total_value, 0);
        const criticalItems = stockInfo.filter(item => item.status === 'HABIS' || item.status === 'RENDAH');
        const outOfStockItems = stockInfo.filter(item => item.status === 'HABIS');
        const lowStockItems = stockInfo.filter(item => item.status === 'RENDAH');

        // Get recent transactions
        const { data: recentTransactions } = await supabase
            .from('transactions')
            .select(`
        id,
        type,
        qty,
        date,
        item:items(item_name),
        pic:staff!transactions_pic_id_fkey(name)
      `)
            .order('created_at', { ascending: false })
            .limit(10);

        return {
            totalValue,
            totalItems: stockInfo.length,
            criticalCount: criticalItems.length,
            outOfStockCount: outOfStockItems.length,
            lowStockCount: lowStockItems.length,
            criticalItems,
            recentTransactions: recentTransactions || [],
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        throw error;
    }
}
