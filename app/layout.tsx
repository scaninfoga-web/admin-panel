import Navbar from '@/components/custom/navbar';
import { Toaster } from 'sonner';
import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ProviderUtil } from '@/redux/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scaninfoga Admin-Panel',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProviderUtil>
        <Toaster richColors position="top-right" />
        <Navbar />
        {children}
      </ProviderUtil>
      </body>
    </html>
  );
}