import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo"
});

export const metadata: Metadata = {
  title: "طمانينة - التوعية بسرطان الثدي",
  description: "تطبيق شامل للتوعية بسرطان الثدي والكشف المبكر - Comprehensive breast cancer awareness and early detection app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <PublicHeader />
          <main className="flex-grow">
            {children}
          </main>
          <PublicFooter />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
