import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/components/UserProvider";

export const metadata: Metadata = {
  title: "InReal Job Portal",
  description: "Search your dream job using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <Navbar />
            <ToastContainer position="top-center" />
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
