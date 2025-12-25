import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/redux/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://main.school-management-frontend-66i.pages.dev/"),
  title: "EduDash | All-in-One School Management & Education Platform",
  description: "Transform your institution with EduDash, a modern school management system for tracking student progress, teacher performance, and institutional growth.",
  keywords: ["School Management", "EduDash", "Education Platform", "Student Portal", "Teacher Dashboard"],
  authors: [{ name: "EduDash Team" }],
  openGraph: {
    title: "EduDash | Modern School Management & Education Platform",
    description: "The all-in-one platform for schools to manage students, track performance, and streamline communication.",
    url: "https://main.school-management-frontend-66i.pages.dev/",
    siteName: "EduDash",
    images: [
      {
        url: "/og-image.png", // We should probably generate or suggest this
        width: 1200,
        height: 630,
        alt: "EduDash School Management Platform Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduDash | Modern School Management",
    description: "Modernize your institution with EduDash - the premium education platform.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
      >
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
