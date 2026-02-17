"use client";

export default function Navbar({ onLogout }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">My Bookmarks</h2>

      <button
        onClick={onLogout}
        className="text-sm font-medium text-red-500 hover:text-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
