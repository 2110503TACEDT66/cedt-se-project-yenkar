import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { authOptions } from "@/libs/auth";
import { CommandMenu } from "@/components/CommandMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yenkar",
  description: "Yenkar website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nextAuthSession = await getServerSession(authOptions);
  return (
    <html lang="en">
      <NextAuthProvider session={nextAuthSession}>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </NextAuthProvider>
    </html>
  );
}
