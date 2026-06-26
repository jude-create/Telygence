import "./globals.css";
import SidebarWrapper from "./components/SidebarWrapper";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Telygence AI",
  description: "A User Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-w-0">
        <ClerkProvider>
          <SidebarWrapper>{children}</SidebarWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
