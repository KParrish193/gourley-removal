import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // regular → bold
  variable: "--font-inter",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "700"], // normal & bold for code
  variable: "--font-source-code-pro",
});

export const metadata: Metadata = {
  title: "Gourley Tree Removal LLC",
  description: ""
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={`${inter.variable} ${sourceCodePro.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
