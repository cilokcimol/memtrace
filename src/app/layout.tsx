import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "MemTrace | Debug Agent with Permanent Memory",
  description: "The AI debugging assistant that stores every bug fix and architectural decision to Walrus. Never debug the same problem twice.",
  keywords: ["Walrus Memory", "AI debugger", "persistent memory", "developer tool"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
