"use client";

import { useTransition } from "react";
import { deleteCar } from "@/app/action/car";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรถคันนี้?\n⚠️ การกระทำนี้ไม่สามารถย้อนกลับได้ รูปภาพประกอบทั้งหมดจะถูกลบทิ้งถาวรด้วย")) {
      startTransition(async () => {
        try {
          await deleteCar(id);
        } catch (error) {
          alert("ไม่สามารถลบรถได้: " + (error as Error).message);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`font-medium text-sm transition-colors ${
        isPending ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-900"
      }`}
    >
      {isPending ? "กำลังลบ..." : "ลบ"}
    </button>
  );
}
