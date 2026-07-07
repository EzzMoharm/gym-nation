import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/layout/header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gym Nation — Premium Fitness Platform",
    template: "%s | Gym Nation",
  },
  description:
    "Premium nutrition store and training plan marketplace. Fuel your fitness journey with top-quality supplements and expert-designed programs.",
  keywords: [
    "fitness",
    "supplements",
    "nutrition",
    "training plans",
    "protein",
    "workout",
    "gym",
    "health",
  ],
  authors: [{ name: "Gym Nation" }],
  creator: "Gym Nation",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gymnation.com",
    siteName: "Gym Nation",
    title: "Gym Nation — Premium Fitness Platform",
    description:
      "Premium nutrition store and training plan marketplace. Fuel your fitness journey with top-quality supplements and expert-designed programs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gym Nation — Premium Fitness Platform",
    description:
      "Premium nutrition store and training plan marketplace.",
    creator: "@gymnation",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col antialiased">
        <AuthProvider>
          <QueryProvider>
            <TooltipProvider>
              <Header />
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className: "border border-border bg-card text-card-foreground",
                }}
                richColors
                closeButton
              />
            </TooltipProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
