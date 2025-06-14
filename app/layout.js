import localFont from "next/font/local";
import Navbar from "../components/Navbar.jsx";
import { Providers } from "./providers";
import './globals.css';

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://bootswatch.com/5/cosmo/bootstrap.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}>
        <Providers>
          <div className="app-container d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <div className="container p-4">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
