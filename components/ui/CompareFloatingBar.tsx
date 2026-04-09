"use client";

import { useCompare } from "@/providers/CompareProvider";
import Link from "next/link";

export default function CompareFloatingBar() {
  const { selectedCarIds, clearCompare } = useCompare();

  if (selectedCarIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto bg-gray-900/95 backdrop-blur shadow-2xl rounded-2xl flex items-center justify-between p-4 px-6 border border-gray-800">
        <div className="flex items-center gap-4 text-white">
          <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
            {selectedCarIds.length}
          </div>
          <div>
            <p className="font-semibold text-sm">เลือกรถเปรียบเทียบ</p>
            <p className="text-xs text-gray-400">เลือกได้สูงสุด 3 คัน ({selectedCarIds.length}/3)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={clearCompare}
            className="text-sm font-medium text-gray-400 hover:text-white px-3 py-2 transition-colors"
          >
            ล้างทั้งหมด
          </button>
          
          <Link 
            href={`/compare?ids=${selectedCarIds.join(",")}`}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              selectedCarIds.length > 1 
                ? "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20" 
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
            onClick={(e) => {
              if (selectedCarIds.length < 2) {
                e.preventDefault();
                alert("กรุณาเลือกรถตัั้งแต่ 2 คันขึ้นไป เพื่อเปรียบเทียบครับ");
              }
            }}
          >
            👉 เปรียบเทียบเลย
          </Link>
        </div>
      </div>
    </div>
  );
}
