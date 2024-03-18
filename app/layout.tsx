import { Navbar } from "@/components/navbar";
import { SearchCommand } from "@/components/search-command";
import { Toaster } from "@/components/ui/sonner";
import ConvexClientProvider from "@/providers/convex-client-provider";
import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from "@/providers/theme-providers";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostIT",
  description: "A reddit inspired web application",
  metadataBase: new URL("https://postit-omega.vercel.app"),
  openGraph: {
    title: "PostIT - Share with your group and the world",
    description: "A fullstack web application for Convex Zero to One hackathon",
    url: "https://postit-omega.vercel.app",
    siteName: "postit-omega.vercel.app",
    images: ["https://postit-omega.vercel.app/og.png"],
  },
  twitter: {
    title: "PostIT - Share with your group and the world",
    card: "summary_large_image",
    images: ["https://postit-omega.vercel.app/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `https://postit-omega.vercel.app/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className=" mt-12 antialiased">
        <SessionProvider>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SearchCommand />
              <Toaster />
              <ModalProvider />
              <Navbar />
              <div className="container max-w-7xl mx-auto h-full pt-12">
                {children}
              </div>
            </ThemeProvider>
          </ConvexClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
