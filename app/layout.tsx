import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Hodný Pes Academy", description: "Učte se spolu. Roste spolu. Pozitivní výcvik jako dobrodružství.", applicationName: "Hodný Pes Academy", manifest: "/manifest.webmanifest", appleWebApp: { capable: true, statusBarStyle: "default", title: "Hodný Pes" } };
export const viewport: Viewport = { themeColor: "#6A00F4", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="cs"><body>{children}</body></html>; }
