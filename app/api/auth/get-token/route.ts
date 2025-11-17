import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tokens = searchParams.get("tokenParams");
  const cookieStore = cookies();
  const token = (await cookieStore).get(tokens as string) || null;

  return Response.json({ token });
}
