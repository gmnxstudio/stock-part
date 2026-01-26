'use server';

import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Transaction, TransactionFormData } from '@/types/database';
import { validateStockForTransaction } from './stock.service';
import { revalidatePath } from 'next/cache';

// Create transaction
export async function createTransaction(transData: TransactionFormData) {
    // Validate stock for outgoing transactions
    if (transData.type === 'KELUAR') {
        const validation = await validateStockForTransaction(
            transData.item_id,
            transData.qty
        );

        if (!validation.valid) {
            throw new Error(validation.message);
        }
    }

    const { data, error } = await supabase
        .from('transactions')
        .insert([transData])
        .select()
        .single();

    if (error) handleSupabaseError(error, 'createTransaction');

    revalidatePath('/', 'page');
    revalidatePath('/riwayat', 'page');
    revalidatePath('/data-entry', 'page');
    return data;
}

// Get all transactions with joins
export async function getAllTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
        .from('transactions')
        .select(`
      *,
      item:items(*),
      pic:staff!transactions_pic_id_fkey(*),
      witness:staff!transactions_witness_id_fkey(*)
    `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) handleSupabaseError(error, 'getAllTransactions');
    return (data || []) as Transaction[];
}

// Get transactions by date range
export async function getTransactionsByDateRange(
    startDate: string,
    endDate: string
): Promise<Transaction[]> {
    const { data, error } = await supabase
        .from('transactions')
        .select(`
      *,
      item:items(*),
      pic:staff!transactions_pic_id_fkey(*),
      witness:staff!transactions_witness_id_fkey(*)
    `)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

    if (error) handleSupabaseError(error, 'getTransactionsByDateRange');
    return (data || []) as Transaction[];
}
