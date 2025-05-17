import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Global Recipe Finder - Smart Search Portal',
  description: 'Discover recipes from around the world with our AI-powered search engine. Find recipes by name, cuisine, or ingredients. Free, secure, and privacy-focused recipe search.',
  keywords: 'recipes, cooking, food search, global cuisine, AI search, recipe finder, international recipes, cooking search, meal finder, recipe database',
  authors: [{ name: 'Global Recipe Finder Team' }],
  creator: 'Global Recipe Finder',
  publisher: 'Global Recipe Finder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://global-recipe-finder.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Global Recipe Finder - Smart Search Portal',
    description: 'Discover recipes from around the world with our AI-powered search engine. Find recipes by name, cuisine, or ingredients.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Global Recipe Finder',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Global Recipe Finder - Smart Search Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Recipe Finder - Smart Search Portal',
    description: 'Discover recipes from around the world with our AI-powered search engine.',
    images: ['/twitter-image.jpg'],
    creator: '@globalrecipefinder',
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
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    bing: 'your-bing-verification',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  category: 'food',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Global Recipe Finder",
              "description": "AI-powered recipe search engine",
              "applicationCategory": "FoodApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              },
              "featureList": [
                "AI-powered semantic search",
                "Global cuisine database",
                "Privacy-focused",
                "No user tracking",
                "Free to use"
              ],
              "screenshot": [
                {
                  "@type": "ImageObject",
                  "url": "/screenshot1.jpg",
                  "caption": "Recipe search interface"
                }
              ],
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "permissions": "none"
            })
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
