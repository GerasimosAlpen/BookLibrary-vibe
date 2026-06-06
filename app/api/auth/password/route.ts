import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { updatePasswordSchema } from "@/lib/validations/auth";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await requireAuth();

    const body = await req.json();
    const parsed = updatePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: currentUser.userId } });
    if (!user) {
      return errorResponse("User not found", 404);
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return errorResponse("Current password is incorrect", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return successResponse({ message: "Password updated successfully" });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return errorResponse("Not authenticated", 401);
    }
    return errorResponse("Internal server error", 500);
  }
}