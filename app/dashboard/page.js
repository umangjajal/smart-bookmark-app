"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/Navbar";
import BookmarkForm from "../../components/BookmarkForm";
import BookmarkList from "../../components/BookmarkList";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Navbar />
      {/* No refresh prop needed */}
      <BookmarkForm user={user} />
      <BookmarkList user={user} />
    </div>
  );
}
