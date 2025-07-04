'use client';
import Link from 'next/link';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between">
      <Link href="/admin" className="text-xl font-bold">Admin Dashboard</Link>
      <div className="space-x-4">
        {session ? (
          <>
            <span>Welcome, {session.user?.name}</span>
            <button onClick={() => signOut()} className="btn">Logout</button>
          </>
        ) : (
          <Link href="/login" className="btn">Login</Link>
        )}
      </div>
    </nav>
  );
}