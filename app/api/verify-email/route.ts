import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const code = req.nextUrl.searchParams.get("code");
    if (!email || !code) {
      return NextResponse.redirect(new URL("/sign-up?error=invalid", req.url));
    }

    const user = await prisma.user.findFirst({
      where: { email, verificationCode: code },
    });
    if (!user) {
      return NextResponse.redirect(
        new URL("/sign-up?error=invalid-code", req.url),
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
      },
    });

    return NextResponse.redirect(new URL("/sign-in?verified=1", req.url));
  } catch (error) {
    return new NextResponse(`verify-email error: ${String(error)}`, {
      status: 500,
    });
  }
}
