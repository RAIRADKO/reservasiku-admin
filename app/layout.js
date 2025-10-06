import "./globals.css";
import Sidebar from "./components/sidebar";

export const metadata = {
  title: "Admin Reservasi",
  description: "Panel admin untuk manajemen reservasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </body>
    </html>
  );
}