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
    default: 'BookIt - Discover & Book Travel Experiences Worldwide',
    template: '%s | BookIt'
  },
  description: 'Discover and book amazing travel experiences, adventures, and activities worldwide with BookIt. Secure booking, best prices, and unforgettable memories at iconic landmarks.',
  keywords: 'travel, booking, experiences, adventures, activities, tours, landmarks, taj mahal, eiffel tower, colosseum',
  authors: [{ name: 'BookIt Team' }],
  creator: 'BookIt',
  publisher: 'BookIt',
  metadataBase: new URL('https://bookit.com'),
  openGraph: {
    title: 'BookIt - Travel Experiences Booking Platform',
    description: 'Book amazing travel experiences and activities at iconic landmarks worldwide',
    type: 'website',
    locale: 'en_US',
    siteName: 'BookIt',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BookIt - Travel Experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookIt - Travel Experiences Booking Platform',
    description: 'Book amazing travel experiences and activities at iconic landmarks worldwide',
    creator: '@bookit',
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
              "name": "BookIt",
              "description": "Travel Experiences Booking Platform",
              "url": "https://bookit.com",
              "logo": "https://bookit.com/logo.png",
              "sameAs": [
                "https://twitter.com/bookit",
                "https://facebook.com/bookit",
                "https://instagram.com/bookit"
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