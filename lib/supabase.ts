import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '❌ ERROR: Supabase credentials are missing!\n\n' +
        'Please create a .env.local file in the root directory and add:\n' +
        'NEXT_PUBLIC_SUPABASE_URL=your-project-url\n' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n\n' +
        'You can find these values in your Supabase project settings.\n' +
        'Visit: https://supabase.com/dashboard → Your Project → Settings → API'
    );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any, context: string) {
    console.error(`Supabase Error [${context}]:`, error);
    throw new Error(`Database error: ${error.message || 'Unknown error'}`);
}
