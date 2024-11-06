import type { Metadata } from "next";
import "./globals.css";
import { Chewy, Sriracha } from "next/font/google";

const chewy = Chewy({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-chewy",
});

const sriracha = Sriracha({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-sriracha",
});

export const metadata: Metadata = {
  title: "I was here",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${chewy.className} ${sriracha.className} antialiased bg-[#d1d5db]`}
      >
        {children}
      </body>
    </html>
  );
}
