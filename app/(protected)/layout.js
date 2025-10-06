// app/(protected)/layout.js
import Sidebar from "../components/sidebar"; // Path ../ karena kita berada satu level lebih dalam

export default function ProtectedLayout({ children }) {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}