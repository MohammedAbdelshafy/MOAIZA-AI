import React from 'react';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MOAIZA AI - Construction Bidding Platform',
  description: 'AI-powered platform for construction tender analysis, BOQ extraction, and bid optimization',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0066CC" />
        <meta name="description" content={metadata.description as string} />
      </head>
      <body className="bg-light dark:bg-dark text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
