import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'طمانينة - التوعية بسرطان الثدي',
    short_name: 'طمانينة',
    description: 'تطبيق شامل للتوعية بسرطان الثدي والكشف المبكر',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#db2777',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
