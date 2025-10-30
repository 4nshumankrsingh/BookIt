// src/app/layout.jsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

// -------------------------------------------------
// Font setup
// -------------------------------------------------
const inter = Inter({ subsets: ['latin'] });

// -------------------------------------------------
// Metadata (Next.js 13+ App Router)
// -------------------------------------------------
export const metadata = {
  title: 'BookIt - Book Travel Experiences & Activities',
  description:
    'Discover and book amazing travel experiences, activities, and adventures worldwide with BookIt.',
};

// -------------------------------------------------
// Root layout (plain JS – no TS annotations)
// -------------------------------------------------
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}