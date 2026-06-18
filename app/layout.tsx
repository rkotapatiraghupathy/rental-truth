import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentalTruth — Find Hidden Car Hire Restrictions Before You Pay",
  description: "Paste your car hire booking confirmation and instantly discover hidden restrictions that could leave you stranded at the desk. Built by a consumer who got burned.",
  keywords: "car hire hidden fees, rental car restrictions, booking.com car hire, airport only car rental, consumer protection travel",
  openGraph: {
    title: "RentalTruth — No More Hidden Restrictions",
    description: "Find the fine-print traps before you show up at the desk.",
    url: "https://rentaltruth.co.uk",
    siteName: "RentalTruth",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
