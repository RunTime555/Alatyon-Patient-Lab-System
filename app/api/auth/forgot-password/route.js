import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      return NextResponse.json({ error: "This email is not registered." }, { status: 404 });
    }

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?email=${email}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Alatyon Hospital" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h3>Click below to reset your password:</h3>
          <a href="${resetLink}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you didn't request this, you can ignore this email.</p>
        </div>`
    });

    return NextResponse.json({ success: true, message: "Reset link sent to your email!" });

  } catch (error) {
    // Log the FULL error so we can see exactly what's failing (auth, connection, etc.)
    console.error("FORGOT_PASSWORD_EMAIL_ERROR:", error);
    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
  }
}