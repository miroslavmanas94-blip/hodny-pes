import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hodný pes: Psí dobrodružství",
  description: "Vydej se se svým psem na dobrodružství, uč se povely a trénuj Dog Puller.",
  applicationName: "Hodný pes"
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#10251f" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="cs"><body>{children}</body></html>;
}
