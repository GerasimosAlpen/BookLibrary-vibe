import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { signToken } from "@/lib/jwt";
import { errorResponse } from "@/lib/api-response";
import { AUTH_COOKIE, COOKIE_OPTIONS } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
        },
      },
      { status: 200 }
    );

    response.cookies.set(AUTH_COOKIE, token, COOKIE_OPTIONS);
    return response;
  } catch {
    return errorResponse("Internal server error", 500);
  }
}