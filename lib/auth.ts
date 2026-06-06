import { cookies } from "next/headers";
import { AUTH_COOKIE } from "./cookies";
import { verifyToken, JwtPayload } from "./jwt";

export async function getCurrentUser(): Promise<JwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<JwtPayload> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}