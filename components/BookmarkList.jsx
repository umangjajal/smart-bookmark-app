"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BookmarkList({ user }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setBookmarks(data || []);
      setLoading(false);
    };

    fetchBookmarks();

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
        fetchBookmarks
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user.id]);

  const deleteBookmark = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    // realtime updates UI
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading bookmarks...</p>;
  }

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
          className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
        >
          <div>
            <a
              href={b.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-medium"
            >
              {b.title}
            </a>
            <p className="text-xs text-gray-400 break-all">{b.url}</p>
          </div>

          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
