import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hodný pes: Psí dobrodružství",
  description: "Prozkoumej psí výcvikový areál, trénuj s respektem, pečuj o své psí parťáky a objevuj Dog Puller i čichací výzvy.",
  applicationName: "Hodný pes: Psí dobrodružství",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Psí dobrodružství" },
};

export const viewport: Viewport = {
  themeColor: "#284c35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="cs"><body>{children}</body></html>;
}
