"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Category() {
  const router = useRouter();

  useEffect(() => {
    router.push("/shopping/");
  }, [router]);

  return (
    <div className="flex h-screen items-center text-2xl justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
