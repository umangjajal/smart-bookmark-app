"use client";

import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-6 text-brand">
          Smart Bookmark
        </h1>

        <button
          onClick={login}
          className="w-full bg-brand text-white py-2 rounded-lg hover:opacity-90"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
