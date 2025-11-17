import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code not found" }, { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GITHUB_ID,
      client_secret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
      code,
    }),
  });

  const tokenData = (await tokenRes.json()) as GitHubTokenResponse;
  const accessToken = tokenData.access_token;

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Next.js",
    },
  });

  const user = (await userRes.json()) as GitHubUser;

  (await cookies()).set({
    name: "githubToken",
    value: accessToken,
  });

  (await cookies()).set({
    name: "token",
    value: btoa(JSON.stringify(user)),
  });

  // localStorage.setItem("githubToken", accessToken);
  // localStorage.setItem("token", btoa(JSON.stringify(user)));
  return NextResponse.redirect(new URL("/", req.url));
}
