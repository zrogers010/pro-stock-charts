import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProStockCharts — Stock Charts & Financial Data",
  description:
    "Professional stock charts, financial data, and market news at prostockcharts.com. Simple, fast, and free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
