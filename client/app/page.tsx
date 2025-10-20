"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const isAuth = localStorage.getItem("isAuthenticated");
      if (isAuth === "true") {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return <Loader onComplete={() => {}} />;
}
