import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HiringHero",
  description:
    "Unveil exceptional talents and streamline your recruitment journey.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //<ClerkProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    //</ClerkProvider>
  );
}
