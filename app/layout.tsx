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
