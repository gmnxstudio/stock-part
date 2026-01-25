'use server';

import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Item, Category, Staff } from '@/types/database';
import { revalidatePath } from 'next/cache';

// Get all items with categories
export async function getAllItems(): Promise<Item[]> {
    const { data, error } = await supabase
        .from('items')
        .select(`
      *,
      category:categories(*)
    `)
        .order('item_name');

    if (error) handleSupabaseError(error, 'getAllItems');
    return (data || []) as Item[];
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) handleSupabaseError(error, 'getAllCategories');
    return data || [];
}

// Get all staff
export async function getAllStaff(): Promise<Staff[]> {
    const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name');

    if (error) handleSupabaseError(error, 'getAllStaff');
    return data || [];
}

// Create item
export async function createItem(itemData: Omit<Item, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('items')
        .insert([itemData])
        .select()
        .single();

    if (error) handleSupabaseError(error, 'createItem');

    revalidatePath('/part-master');
    revalidatePath('/');
    return data;
}

// Update item
export async function updateItem(id: number, itemData: Partial<Item>) {
    const { data, error } = await supabase
        .from('items')
        .update(itemData)
        .eq('id', id)
        .select()
        .single();

    if (error) handleSupabaseError(error, 'updateItem');

    revalidatePath('/part-master');
    revalidatePath('/');
    return data;
}

// Delete item
export async function deleteItem(id: number) {
    const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

    if (error) handleSupabaseError(error, 'deleteItem');

    revalidatePath('/part-master');
    revalidatePath('/');
}

// Create category
export async function createCategory(name: string) {
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name }])
        .select()
        .single();

    if (error) handleSupabaseError(error, 'createCategory');
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
    return data;
}
