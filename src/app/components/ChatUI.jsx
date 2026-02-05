"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatUI() {

  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);


  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // ==========================================
  // ASK QUESTION
  // ==========================================
  const handleAsk = async () => {

    if (!question.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", text: question }
    ];

    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }), // ⭐ only question
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "ai", text: data.answer }
    ]);

    setLoading(false);
  };


  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* header */}
      <div className="p-4 bg-white shadow flex justify-between">
        <h1 className="font-bold">Chat with PDF</h1>

        <button
          onClick={() => router.push("/")}
          className="text-indigo-600 text-sm"
        >
          Upload another
        </button>
      </div>


      {/* messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[70%] p-3 rounded-xl ${
              m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-white shadow"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="bg-white shadow p-3 rounded-xl w-fit">
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>


      {/* input */}
      <div className="p-4 bg-white border-t mb-15 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask question..."
          className="flex-1 border rounded-lg px-3 py-2 outline-none"
        />

        <button
          onClick={handleAsk}
          className="bg-indigo-600 text-white px-4 rounded-lg"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
