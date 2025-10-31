// src/app/layout.jsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

// -------------------------------------------------
// Font setup
// -------------------------------------------------
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

// -------------------------------------------------
// Metadata (Next.js 13+ App Router)
// -------------------------------------------------
export const metadata = {
  title: 'BookIt - Book Travel Experiences & Activities in India',
  description: 'Discover and book amazing travel experiences, adventures, and activities across India with BookIt. Secure booking, best prices, and unforgettable memories.',
  keywords: 'travel, booking, experiences, india, adventures, activities, tours',
  authors: [{ name: 'BookIt Team' }],
  creator: 'BookIt',
  publisher: 'BookIt',
  metadataBase: new URL('https://bookit.in'),
  openGraph: {
    title: 'BookIt - Travel Experiences Booking Platform',
    description: 'Book amazing travel experiences and activities across India',
    type: 'website',
    locale: 'en_IN',
    siteName: 'BookIt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookIt - Travel Experiences Booking Platform',
    description: 'Book amazing travel experiences and activities across India',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

// -------------------------------------------------
// Root layout
// -------------------------------------------------
export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-white antialiased">
        {children}
        <Toaster 
          position="top-right"
          duration={4000}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}