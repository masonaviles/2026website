import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://gitaddmason.dev",
  ),
  openGraph: {
    title: "mason.os",
    description: "Mason Aviles · Senior Full-Stack Engineer",
    url: "/",
    siteName: "mason.os",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "mason.os",
    description: "Mason Aviles · Senior Full-Stack Engineer",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c10" },
  ],
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
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
