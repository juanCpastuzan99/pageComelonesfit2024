import localFont from "next/font/local";
import './globals.css';
import { Providers } from './providers';
import WhatsappButton from './components/WhatsappButton';
import AppClientLayout from "./AppClientLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata = {
  title: "Comelonesfit",
  description: "Catálogo de productos Comelonesfit",
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link 
          rel="stylesheet"
          href="https://bootswatch.com/5/cosmo/bootstrap.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen overflow-x-hidden`}>
        <Providers>
          <AppClientLayout>
            <main className="w-full">
              {children}
            </main>
          </AppClientLayout>
        </Providers>
        <WhatsappButton />
      </body>
    </html>
  );
}