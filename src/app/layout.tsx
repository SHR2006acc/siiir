import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Header, Footer, AiFab } from "@/components/Layout";
import { AppProvider } from "@/components/AppProvider";

export const metadata: Metadata = {
  title: "SIR — Explore Morocco",
  description: "Compare trains, coaches, flights and combined journeys across Morocco.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <AppProvider>
          <Header />
          {children}
          <AiFab />
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
