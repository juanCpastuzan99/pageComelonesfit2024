import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Buscar from "@/components/Buscar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Comelonesfit",
  description: "Catalogo de productos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href ="https://bootswatch.com/5/cosmo/bootstrap.min.css" />
        


      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Buscar/>
        <Navbar/>
      <div className="container p-4">
      {children}
      </div>
        
      </body>
    </html>
  );
}
