// this is the base of the webpage, where everything is a part of chilren.

"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProviderTempo } from "./Providers";
import { Toaster, toast } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviderTempo>{children}</AuthProviderTempo>
        <Toaster position="top-center" richColors/>
      </body>
    </html>
  );
}