import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Admin Reservasi",
  description: "Panel admin untuk manajemen reservasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}