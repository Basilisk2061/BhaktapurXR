import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BhaktapurXR", template: "%s | BhaktapurXR" },
  description: "An interactive 3D digital heritage experience of Bhaktapur Durbar Square, Nepal. In early development.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
