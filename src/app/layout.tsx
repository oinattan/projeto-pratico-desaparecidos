import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "../components/providers";
import { Navbar } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { ScrollToTop } from "../components/ui/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Desaparecidos | Sistema PJC-MT",
  description: "Sistema de consulta e registro de informações sobre pessoas desaparecidas da Polícia Judiciária Civil de Mato Grosso"
};

export default function RootLayout({
  children

}: {children: React.ReactNode;}) {
  return (
  <html lang="pt-BR" suppressHydrationWarning>
  <body className={`${inter.className} antialiased`}>
    <Providers>
      <Navbar />
      <main className="">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </Providers>
  </body>
  </html>);

}