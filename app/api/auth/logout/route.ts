import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";
import { AUTH_COOKIE } from "@/lib/cookies";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Not authenticated", 401);
    }

    const response = NextResponse.json(
      { success: true, data: { message: "Logged out successfully" } },
      { status: 200 }
    );

    response.cookies.set(AUTH_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch {
    return errorResponse("Internal server error", 500);
  }
}