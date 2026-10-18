import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Hodný pes: Cesta", description: "Vydej se na cestu se svým psím parťákem. Prozkoumávej svět, trénuj s odměnou a hraj Dog Puller.", applicationName: "Hodný pes: Cesta" };
export const viewport: Viewport = { themeColor: "#17151D", width: "device-width", initialScale: 1, maximumScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="cs"><body>{children}</body></html>; }
