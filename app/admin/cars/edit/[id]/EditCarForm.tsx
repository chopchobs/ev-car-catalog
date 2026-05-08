"use client";

import { useState } from "react";
import Link from "next/link";
import { updateCar } from "@/app/action/car";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// สร้าง Type สำหรับ Client Form (รับมาจาก Prisma แต่ไม่ต้อง strict ทั้งหมดเพราะเป็น View)
export default function EditCarForm({ car }: { car: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // ส่งข้อมูลไปอัปเดต (อิงตาม ID เดิมเพื่อจัดการ Relational DB)
      const result = await updateCar(car.id, formData);
      // เช็คสถานะที่ตอบกลับมาจาก Server Action
      if (result?.success) {
        toast.success("อัปเดตข้อมูลสำเร็จ", {
          description: "ระบบได้ทำการบันทึกการเปลี่ยนแปลงเข้าสู่ฐานข้อมูลแล้ว",
        });

        // หมายเหตุ: หน้า Edit ไม่ควร reset() ฟอร์ม เพราะผู้ใช้ควรเห็นค่าล่าสุดที่เพิ่งแก้ไป

        // หน่วงเวลาให้ผู้ใช้เห็น Toast 1.5 วินาที แล้วค่อยเปลี่ยนหน้า
        setTimeout(() => {
          router.push("/admin/cars");
          router.refresh(); // รีเฟรชข้อมูลให้ตารางอัปเดต
        }, 1500);
      } else {
        // ถ้าฝั่ง Server ส่ง success: false กลับมา
        throw new Error(result?.message || "บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("บันทึกข้อมูลไม่สำเร็จ", {
        description: "กรุณาตรวจสอบความถูกต้องของข้อมูลแล้วลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* ยี่ห้อรถ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ยี่ห้อ (Brand)
            </label>
            <input
              type="text"
              name="brand"
              required
              defaultValue={car.brand}
              placeholder="เช่น Tesla, BYD, ORA"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>

          {/* รุ่นรถ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รุ่น (Model)
            </label>
            <input
              type="text"
              name="modelName"
              required
              defaultValue={car.modelName}
              placeholder="เช่น Model 3, Seal, Good Cat"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>

          {/* ปีที่ผลิต */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ปีที่ผลิต (Year)
            </label>
            <input
              type="number"
              name="year"
              required
              defaultValue={car.year}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>

          {/* เลขไมล์ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลขไมล์ (กม.)
            </label>
            <input
              type="number"
              name="mileage"
              required
              defaultValue={car.mileage}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>

          {/* ราคา */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ราคา (บาท)
            </label>
            <input
              type="number"
              name="price"
              required
              defaultValue={car.price}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            />
          </div>

          {/* สถานะ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะรถยนต์
            </label>
            <select
              name="status"
              defaultValue={car.status}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-white"
            >
              <option value="AVAILABLE">พร้อมขาย (Available)</option>
              <option value="BOOKED">จองแล้ว (Booked)</option>
              <option value="SOLD">ขายแล้ว (Sold)</option>
            </select>
          </div>
        </div>

        {/* ส่วนอัปโหลดรูปภาพภาพใหม่แบบทับของเดิม */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              อัปเดตรูปภาพปก (Cover Image)
            </label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-white"
            />
            <p className="text-xs text-gray-500 mt-2">
              ถ้าไม่ต้องการเปลี่ยน ไม่ต้องอัปโหลดใดๆ
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เพิ่มรูปภาพแกลเลอรี (Gallery เพิ่มเติม)
            </label>
            <input
              type="file"
              name="gallery"
              multiple
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-white"
            />
            <p className="text-xs text-gray-500 mt-2">
              รูปภาพที่เพิ่มใหม่ จะไปต่อท้ายรูปล่าสุดที่มีอยู่แล้ว
            </p>
          </div>
        </div>

        {/* ปุ่ม Action */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Link
            href="/admin/cars"
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all flex items-center gap-2
              ${isLoading ? "bg-orange-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 shadow-sm hover:shadow-md"}
            `}
          >
            {isLoading ? "กำลังบันทึกข้อมูล..." : "อัปเดตข้อมูลรถ"}
          </button>
        </div>
      </form>
    </div>
  );
}
