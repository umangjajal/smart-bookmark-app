"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BookmarkList({ user }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookmarks for current user
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setBookmarks(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookmarks();

    // Realtime subscription (only react to own changes)
    const channel = supabase
      .channel(`bookmarks-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks(); // 🔥 auto refresh on add/delete
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  const removeBookmark = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    // No manual refresh needed — realtime handles it
  };

  // Loading state
  if (loading) {
    return <p className="text-center text-gray-500">Loading bookmarks...</p>;
  }

  // Empty state
  if (bookmarks.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No bookmarks yet. Add your first one 🚀
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition"
        >
          <div className="flex flex-col">
            <a
              href={b.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              {b.title}
            </a>
            <span className="text-xs text-gray-400 break-all">
              {b.url}
            </span>
          </div>

          <button
            onClick={() => removeBookmark(b.id)}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
