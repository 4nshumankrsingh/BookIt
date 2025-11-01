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
  variable: '--font-inter',
});

// -------------------------------------------------
// Metadata (Next.js 13+ App Router)
// -------------------------------------------------
export const metadata = {
  title: {
    default: 'Nexis - Discover & Book Travel Experiences Worldwide',
    template: '%s | Nexis'
  },
  description: 'Discover and book amazing travel experiences, adventures, and activities worldwide with Nexis. Secure booking, best prices, and unforgettable memories at iconic landmarks.',
  keywords: 'travel, booking, experiences, adventures, activities, tours, landmarks, taj mahal, eiffel tower, colosseum, flights, destinations',
  authors: [{ name: 'Nexis Team' }],
  creator: 'Nexis',
  publisher: 'Nexis',
  metadataBase: new URL('https://nexis.com'),
  openGraph: {
    title: 'Nexis - Travel Experiences & Flight Booking Platform',
    description: 'Book amazing travel experiences and flights to iconic destinations worldwide',
    type: 'website',
    locale: 'en_US',
    siteName: 'Nexis',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nexis - Travel Experiences & Flights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexis - Travel Experiences & Flight Booking Platform',
    description: 'Book amazing travel experiences and flights to iconic destinations worldwide',
    creator: '@nexis',
    images: ['/twitter-image.jpg'],
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
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

// -------------------------------------------------
// Root layout
// -------------------------------------------------
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Performance optimizations */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Nexis",
              "description": "Travel Experiences & Flight Booking Platform",
              "url": "https://nexis.com",
              "logo": "https://nexis.com/logo.png",
              "sameAs": [
                "https://twitter.com/nexis",
                "https://facebook.com/nexis",
                "https://instagram.com/nexis"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster 
          position="top-right"
          duration={4000}
          richColors
          closeButton
          expand={false}
          theme="light"
        />
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Simple performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                    console.log('Page load time:', loadTime + 'ms');
                  }, 0);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}