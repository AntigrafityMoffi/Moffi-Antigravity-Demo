import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { SocialProvider } from "@/context/SocialContext";
import { AuthProvider } from "@/context/AuthContext";
import { ShopProvider } from "@/context/ShopContext";
import { PetProvider } from "@/context/PetContext";

import { FloatingControls } from "@/components/common/FloatingControls";
import { GlobalAIWidget } from "@/components/ai/GlobalAIWidget";

const poppins = Poppins({
  weight: ['400', '600', '700', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "MoffiPet",
  description: "Super App for Pets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} font-sans antialiased`}
      >
        <PetProvider> {/* Added PetProvider wrapper */}
          <SocialProvider>
            <AuthProvider>
              <ShopProvider>
                {children}
                <FloatingControls />
                <GlobalAIWidget />
              </ShopProvider>
            </AuthProvider>
          </SocialProvider>
        </PetProvider> {/* Closed PetProvider wrapper */}
      </body>
    </html>
  );
}
