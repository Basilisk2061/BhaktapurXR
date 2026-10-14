import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BhaktapurXR", template: "%s | BhaktapurXR" },
  description: "Explore Bhaktapur Durbar Square in an interactive browser-based 3D reconstruction.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
