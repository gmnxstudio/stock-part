import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'STOK BARANG ULU PLASTIK LATERSIA',
    short_name: 'Stok UPL',
    description: 'Sistem Manajemen Stok Barang - PT Ulu Plastik Latersia',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#009ce4',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
