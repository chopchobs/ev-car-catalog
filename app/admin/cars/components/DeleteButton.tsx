"use client";

import { useTransition } from "react";
import { deleteCar } from "@/app/action/car";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "sonner";

const MySwal = withReactContent(Swal);

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    MySwal.fire({
      title: "ยืนยันการลบข้อมูล?",
      text: "การกระทำนี้ไม่สามารถย้อนกลับได้ รูปภาพประกอบทั้งหมดจะถูกลบทิ้งถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
      background: "rgba(255, 255, 255, 0.85)",
      customClass: {
        popup:
          "backdrop-blur-md dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xl",
        title: "text-gray-900 dark:text-white font-bold",
        htmlContainer: "text-gray-600 dark:text-gray-300",
        confirmButton:
          "rounded-lg px-5 py-2.5 font-medium shadow-sm transition-colors",
        cancelButton: "rounded-lg px-5 py-2.5 font-medium transition-colors",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          try {
            await deleteCar(id);
            toast.success("ลบข้อมูลสำเร็จ", {
              description: "ข้อมูลรถคันนี้ถูกนำออกจากระบบแล้ว",
            });
          } catch (error) {
            toast.error("ไม่สามารถลบรถได้", {
              description:
                (error as Error).message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
            });
          }
        });
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`font-medium text-sm transition-colors ${
        isPending
          ? "text-gray-400 cursor-not-allowed"
          : "text-red-600 hover:text-red-900"
      }`}
    >
      {isPending ? "กำลังลบ..." : "ลบ"}
    </button>
  );
}
