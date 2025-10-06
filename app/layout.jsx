import { Sora } from "next/font/google";
import "./globals.css";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

// Load the Sora font from Google Fonts
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"], // Include the weights you need
});

export const metadata = {
  title: "Telygence AI",
  description: "A User Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content=" initial-scale=1.0, user-scalable=yes"
        />
        <title>Telygence AI</title>
        <meta name="description" content="A User Dashboard" />
      </head>
      <body className={` flex ${sora.variable} antialiased`}>
        {/* Sidebar */}
        <div className="w-1/6">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="w-5/6 flex flex-col">
          <Header />

          <div className="w-full bg-[#EDEDED] text-[#000000]">{children}</div>
        </div>
      </body>
    </html>
  );
}


