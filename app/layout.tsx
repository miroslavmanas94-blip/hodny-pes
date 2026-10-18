import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hodný pes: Psí svět",
  description: "Vydej se se svým psím parťákem na dobrodružství, trénuj a objevuj svět Hodného psa.",
  applicationName: "Hodný pes: Psí svět",
};
export const viewport: Viewport = { themeColor: "#17132b", width: "device-width", initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="cs"><body>{children}</body></html>;
}
