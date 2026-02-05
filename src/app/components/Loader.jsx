"use client";

import { useEffect, useState } from "react";

export default function Loader({ text = "Processing PDF..." }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // ⭐ fake progress animation while backend works
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p; // stop at 95 until done
        return p + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10 gap-4">
      <p className="font-medium text-gray-700">{text}</p>

      <div className="w-72 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-gray-500">{progress}%</p>
    </div>
  );
}
