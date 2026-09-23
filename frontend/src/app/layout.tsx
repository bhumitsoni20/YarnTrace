import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "../store/StoreProvider";
import QueryProvider from "../lib/QueryProvider";

export const metadata: Metadata = {
  title: "YarnTrace — Yarn Inventory & Production Traceability System",
  description:
    "Enterprise platform for end-to-end yarn traceability, real-time stock balances in KG, production lot allocations, and dispatch tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full antialiased font-sans text-slate-900 bg-slate-50">
        <StoreProvider>
          <QueryProvider>{children}</QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
