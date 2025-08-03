import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScalePadi for Business",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} lg:w-[1440px] lg:max-w-[1440px] lg:mx-auto w-screen`}>
        <div className="flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
