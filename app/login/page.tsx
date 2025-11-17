/* eslint-disable @next/next/no-img-element */
"use client";

import { Github } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GITHUB_ID as string;
  const redirectUri = process.env.NEXT_PUBLIC_NEXTAUTH_URL as string;

  const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`;

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: Integrasikan dengan NextAuth atau OAuth handler Anda
      window.location.href = githubLoginUrl;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20"></div>
          <div
            className="relative bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl"
            style={{ paddingBottom: "60px" }}
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-slate-700 rounded-full">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://avatars.githubusercontent.com/oa/3250646?s=240&u=73e536744a6e3c74c4adc50a15b7fe811b999019&v=4"
                    alt="GitHub Logo"
                  />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Login GitRepo
              </h1>
              <p className="text-slate-400">Sign in with your GitHub account</p>
            </div>

            {/* Login Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGithubLogin();
              }}
              className="space-y-4"
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-white hover:bg-slate-100 disabled:bg-slate-600 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:cursor-not-allowed"
              >
                <Github className="w-5 h-5" />
                {isLoading ? "Connecting..." : "Sign in with GitHub"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
