import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // እዚህ ጋር ለወደፊቱ ወደ ኢሜይላቸው ሊንክ የሚልክ ኮድ ይገባል
    console.log(`Password reset link requested for: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: "Reset link sent successfully!" 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}