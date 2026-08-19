'use server';

import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Item, Category, Staff } from '@/types/database';
import { revalidatePath, revalidateTag } from 'next/cache';
import { unstable_cache } from 'next/cache';
import { itemSchema } from '@/lib/validations';

/**
 * OPTIMIZED DATA SERVICE
 * - Selective column queries (no SELECT *)
 * - Aggressive caching for reference data
 * - Revalidation on mutations
 */

// Get all items with categories (select only needed columns)
export async function getAllItems(): Promise<Item[]> {
    const { data, error } = await supabase
        .from('items')
        .select(
            `
      id,
      item_code,
      item_name,
      category_id,
      unit,
      min_stock,
      buying_price,
      created_at,
      category:categories(id, name)
    `
        )
        .order('item_name');

    if (error) handleSupabaseError(error, 'getAllItems');
    return (data || []) as unknown as Item[];
}

/**
 * Get all categories (cached for 5 minutes)
 * Categories rarely change, so aggressive caching is safe
 */
export const getAllCategories = unstable_cache(
    async (): Promise<Category[]> => {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, created_at')
            .order('name');

        if (error) handleSupabaseError(error, 'getAllCategories');
        return data || [];
    },
    ['categories-all'],
    {
        revalidate: 300, // 5 minutes
        tags: ['categories'],
    }
);

/**
 * Get all staff (cached for 5 minutes)
 * Staff list rarely changes
 */
export const getAllStaff = unstable_cache(
    async (): Promise<Staff[]> => {
        const { data, error } = await supabase
            .from('staff')
            .select('id, name, position, created_at')
            .order('name');

        if (error) handleSupabaseError(error, 'getAllStaff');
        return data || [];
    },
    ['staff-all'],
    {
        revalidate: 300, // 5 minutes
        tags: ['staff'],
    }
);

// Create item
export async function createItem(itemData: Omit<Item, 'id' | 'created_at'>) {
    // Validate inputs
    const validated = itemSchema.parse(itemData);

    const { data, error } = await supabase
        .from('items')
        .insert([validated])
        .select()
        .single();

    if (error) handleSupabaseError(error, 'createItem');

    // Revalidate affected pages and caches
    revalidatePath('/part-master', 'page');
    revalidatePath('/', 'page');
    revalidateTag('stock', 'max');

    return data;
}

// Update item
export async function updateItem(id: number, itemData: Partial<Item>) {
    // Validate updates (partial validation)
    const validated = itemSchema.partial().parse(itemData);

    const { data, error } = await supabase
        .from('items')
        .update(validated)
        .eq('id', id)
        .select()
        .single();

    if (error) handleSupabaseError(error, 'updateItem');

    revalidatePath('/part-master', 'page');
    revalidatePath('/', 'page');
    revalidateTag('stock', 'max');

    return data;
}

// Delete item
export async function deleteItem(id: number) {
    const { error } = await supabase.from('items').delete().eq('id', id);

    if (error) handleSupabaseError(error, 'deleteItem');

    revalidatePath('/part-master', 'page');
    revalidatePath('/', 'page');
    revalidateTag('stock', 'max');
}

// Create category
export async function createCategory(name: string) {
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name }])
        .select()
        .single();

    if (error) handleSupabaseError(error, 'createCategory');

    // Invalidate categories cache
    revalidateTag('categories', 'max');

    return data;
}

// Create staff
export async function createStaff(staffData: Omit<Staff, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('staff')
        .insert([staffData])
        .select()
        .single();

    if (error) handleSupabaseError(error, 'createStaff');

    // Invalidate staff cache
    revalidateTag('staff', 'max');

    return data;
}
