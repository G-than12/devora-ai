import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Devora AI - AI Pair Programmer',
  description: 'Your AI Pair Programmer, Available Anytime.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900 h-full`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
