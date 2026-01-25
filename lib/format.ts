// Utilities for formatting dates and currency consistently

/**
 * Format date to Indonesian locale
 * Uses consistent formatting to avoid hydration issues
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    // Use a consistent format that works on both server and client
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value);
}
