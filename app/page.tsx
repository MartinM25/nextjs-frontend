"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from 'lucide-react';

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  const expirationTime = localStorage.getItem("token_expiration");

  if (!token || !expirationTime) {
    return false;
  }

  return Date.now() < Number(expirationTime);
};

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isTokenValid()) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiration");
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-12 w-12" />
  </div>
  );
};

export default Page;
