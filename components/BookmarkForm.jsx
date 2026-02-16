"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BookmarkForm({ user, onRefresh }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Normalize URL (auto add https)
  const normalizeUrl = (value) => {
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      return `https://${value}`;
    }
    return value;
  };

  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const addBookmark = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !url.trim()) {
      setError("Title and URL are required");
      return;
    }

    const formattedUrl = normalizeUrl(url.trim());

    if (!isValidUrl(formattedUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase.from("bookmarks").insert({
      title: title.trim(),
      url: formattedUrl,
      user_id: user.id, // RLS-safe
    });

    setLoading(false);

    if (insertError) {
      setError("Failed to add bookmark. Try again.");
      return;
    }

    // Reset inputs
    setTitle("");
    setUrl("");

    // 🔥 SAFE refresh trigger
    if (typeof onRefresh === "function") {
      onRefresh();
    }
  };

  return (
    <div className="mb-6">
      <form
        onSubmit={addBookmark}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="Bookmark title"
          className="border rounded-lg px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-brand"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <input
          type="text"
          placeholder="https://example.com"
          className="border rounded-lg px-3 py-2 w-full flex-1 focus:outline-none focus:ring-2 focus:ring-brand"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-brand text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
