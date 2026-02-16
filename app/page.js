"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };

    checkUser();
  }, [router]);

  return null;
}
