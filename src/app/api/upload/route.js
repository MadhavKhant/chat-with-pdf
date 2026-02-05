export const runtime = "nodejs"; // ⭐ required for fs

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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

    // ==============================
    // ✅ create uploads folder
    // ==============================
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // create if not exists
    }

    // ==============================
    // ✅ unique filename (avoid overwrite)
    // ==============================
    const fileName = Date.now() + "-" + file.name; // ⭐ added unique name

    const filePath = path.join(uploadDir, fileName);

    // ==============================
    // ✅ save file
    // ==============================
    fs.writeFileSync(filePath, buffer);

    const { userId } = await auth();
    console.log("USER ID:", userId);
    
    await processPDF(filePath, userId, file.name);

    // ==============================
    // ✅ response
    // ==============================
    return NextResponse.json({
      success: true,
      message: "PDF uploaded successfully",
      fileUrl: `/uploads/${fileName}`,
    });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
