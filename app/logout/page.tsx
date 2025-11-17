"use client"; // jika ini file page di Next.js 13+ App Router

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // 2️⃣ Hapus token dari cookie (opsional)
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "githubToken=; path=/; max-age=0";

    // 3️⃣ Redirect ke login
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Logging out...</p>
    </div>
  );
}
