// app/layout.js
import "./globals.css";
import AuthProvider from "./components/AuthProvider"; // <-- Impor AuthProvider

export const metadata = {
  title: "Admin Reservasi",
  description: "Panel admin untuk manajemen reservasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}