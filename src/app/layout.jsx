import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BookIt - Book Travel Experiences & Activities',
  description: 'Discover and book amazing travel experiences, activities, and adventures worldwide with BookIt.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}