import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layouts from "@/layouts";
import { getCategories, getCountries } from "@/actions";

const cherry = Inter();

export const metadata: Metadata = {
  title: "MoViGo - Movies & TV Shows",
  description: "Discover and watch your favorite movies and TV shows online",
};

export const dynamic = "force-dynamic"; // Force dynamic rendering for this layout

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, countries] = await Promise.all([
    getCategories(),
    getCountries(),
  ]);

  return (
    <html lang="en">
      <body className={`${cherry.className} antialiased`}>
        <Layouts
          categories={categories?.data?.items || []}
          countries={countries?.data?.items || []}
        >
          {children}
        </Layouts>
      </body>
    </html>
  );
}
