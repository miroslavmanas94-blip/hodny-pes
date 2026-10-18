import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Hodný pes: Psí centrum", description: "Vybuduj své vysněné psí centrum, poznej psí parťáky a objev skutečný svět Hodný pes na hodnypes.cz.", applicationName: "Hodný pes", manifest: "/manifest.webmanifest", appleWebApp: { capable: true, statusBarStyle: "default", title: "Hodný Pes" } };
export const viewport: Viewport = { themeColor: "#365d3c", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="cs"><body>{children}</body></html>; }
