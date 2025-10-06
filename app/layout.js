// app/layout.js
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

export const metadata = {
  title: "ReservasiKu - Admin Panel",
  description: "Panel admin untuk manajemen reservasi restoran",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}