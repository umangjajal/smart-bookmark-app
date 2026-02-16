"use client";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">My Bookmarks</h2>
      <button
        onClick={() => supabase.auth.signOut()}
        className="text-sm text-red-500"
      >
        Logout
      </button>
    </div>
  );
}
