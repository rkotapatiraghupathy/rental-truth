import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentalTruth — Find Hidden Car Hire Restrictions Before You Pay",
  description: "Free AI tool that reads your car hire booking terms and flags hidden restrictions — flight requirements, deposit traps, credit card rules — before you show up at the desk.",
  keywords: "car hire hidden fees, rental car restrictions, airport car hire terms, booking.com car hire problems, Alamo hidden fees, Hertz hidden charges, Enterprise car hire restrictions, car rental deposit hold, car hire credit card requirement, UK car hire consumer rights",
  metadataBase: new URL("https://rentaltruth.co.uk"),
  alternates: { canonical: "https://rentaltruth.co.uk" },
  openGraph: {
    title: "RentalTruth — Find Hidden Car Hire Restrictions Before You Pay",
    description: "Paste your booking confirmation. AI reads the fine print and flags every restriction that could leave you stranded.",
    url: "https://rentaltruth.co.uk",
    siteName: "RentalTruth",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "RentalTruth — No More Hidden Car Hire Restrictions",
    description: "Free AI tool that reads your car hire booking terms and flags hidden restrictions before you show up at the desk.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
