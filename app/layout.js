import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "Admin Reservasi",
  description: "Panel admin untuk manajemen reservasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-100">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}