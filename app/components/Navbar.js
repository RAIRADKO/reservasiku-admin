import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="font-bold text-xl">
          Admin Panel
        </Link>
        <div className="flex gap-4">
          <Link href="/users">Users</Link>
          <Link href="/tables">Meja</Link>
          <Link href="/reservations">Reservasi</Link>
        </div>
      </div>
    </nav>
  );
}