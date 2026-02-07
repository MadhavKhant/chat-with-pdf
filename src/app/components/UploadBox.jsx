"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

export default function UploadBox() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  const openFilePicker = () => {
    fileRef.current.click();
  };

  // ==========================================
  // UPLOAD PDF
  // ==========================================
  const handleUpload = async () => {
    if (!file) return alert("Select file first");

    setLoading(true); // ⭐ show loader

    const formData = new FormData();
    formData.append("pdf", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("upload pdf response: ", data);

    // ⭐ after success → go to chat page
    router.push("/chat");
  };

  // ==========================================
  // LOADER
  // ==========================================
  if (loading) {
    return <Loader text="Parsing PDF & generating embeddings..." />;
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="bg-slate-200 p-8 rounded-2xl h-fit shadow-xl w-96 text-center">
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg absolute left-10 top-3"
        onClick={() => router.push("/chat")} // ✅ navigate to /chat page
      >
        Chat
      </button>

      <h1 className="text-2xl font-bold mb-6">Upload PDF</h1>

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="hidden"
      />

      <div
        onClick={openFilePicker}
        className="cursor-pointer border-2 border-dashed border-indigo-400 rounded-xl p-8 hover:bg-indigo-50"
      >
        <Upload size={40} className="mx-auto text-indigo-600 mb-3" />
        <p>Click to upload PDF</p>

        {file && <p className="text-green-600 text-sm mt-2">✓ {file.name}</p>}
      </div>

      <button
        onClick={handleUpload}
        className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-lg"
      >
        Upload
      </button>
    </div>
  );
}
