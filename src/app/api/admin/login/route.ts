import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionToken } from "@/lib/adminSession";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin";
  const adminRole = process.env.ADMIN_ROLE || "admin";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminEmail || !adminPassword || !sessionSecret) {
    return NextResponse.json(
      { error: "Admin credentials are not configured" },
      { status: 500 },
    );
  }

  const inputEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const expectedEmail = typeof adminEmail === "string" ? adminEmail.trim().toLowerCase() : "";
  const inputPassword = typeof password === "string" ? password.trim() : "";
  const expectedPassword = typeof adminPassword === "string" ? adminPassword.trim() : "";

  if (inputEmail !== expectedEmail || inputPassword !== expectedPassword) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 },
    );
  }

  const user = {
    id: "admin",
    name: adminName,
    email: adminEmail,
    role: adminRole,
  };

  const token = createAdminSessionToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    sessionSecret,
    24 * 60 * 60,
  );

  const response = NextResponse.json({ user });
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
  return response;
}
