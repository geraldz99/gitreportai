/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const res = await fetch("/api/auth/get-token?tokenParams=token");
        const data = await res.json();
        setToken(data?.token || null);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (!isLoading && !token) {
      window.location.href = "/login";
    }
  }, [token, isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <nav className="border-border bg-white text-black shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/projects" className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full"
                src="https://avatars.githubusercontent.com/oa/3250646?s=240&u=73e536744a6e3c74c4adc50a15b7fe811b999019&v=4"
                alt="GitHub Logo"
              />
              <span className="text-xl font-bold text-black">GitRepo</span>
            </Link>
          </div>

          <Link href="/logout" className="cursor-pointer">
            <Button variant="ghost" size="sm" className="gap-2">
              <LogOut className="h-4 w-4 cursor-pointer" />
              Logout
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
