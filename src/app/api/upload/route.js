export const runtime = "nodejs";


import { NextResponse } from "next/server";
import { processPDF } from "@/app/lib/processPDF";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    // ==============================
    // ✅ get form data
    // ==============================
    const formData = await req.formData();

    const file = formData.get("pdf"); // must match frontend

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 },
      );
    }

    // ==============================
    // ✅ convert file → buffer
    // ==============================
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { userId } = await auth();
    console.log("USER ID:", userId);
    
    await processPDF(buffer, userId, file.name);

    // ==============================
    // ✅ response
    // ==============================
    return NextResponse.json({
      success: true,
      message: "PDF uploaded successfully",
      fileUrl: `/uploads/${file.name}`,
    });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
