// app/layout.jsx
import { Sora } from "next/font/google";
import "./globals.css";
import SidebarWrapper from "./components/SidebarWrapper";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["100","200","300","400","500","600","700","800"],
});

export const metadata = {
  title: "Telygence AI",
  description: "A User Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} antialiased `}>
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  );
}