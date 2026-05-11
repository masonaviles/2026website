import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "mason.os — Mason Aviles · Senior Full-Stack Engineer",
  description:
    "Senior full-stack engineer with 12+ years building React-based products. Shipped at Apple (AKQA, Level Studios), Smartsheet, Amperity, Uptime.com.",
  metadataBase: new URL("https://gitaddmason.dev"),
  openGraph: {
    title: "mason.os",
    description: "Mason Aviles · Senior Full-Stack Engineer",
    url: "https://gitaddmason.dev",
    siteName: "mason.os",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
