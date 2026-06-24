import "./globals.css";

export const metadata = {
  title: "CardPulse",
  description: "CardPulse storefront is under maintenance while we prepare the next version.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
