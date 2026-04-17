"use client";

import { useState } from "react";
import Link from "next/link";
import { addCar } from "@/app/action/car"; // Server Action มาใช้งาน

export default function AdminCarsAddPage() {
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันนี้จะทำงานตอนเรากดปุ่ม "บันทึกข้อมูล"
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // รวบรวมข้อมูลทั้งหมดจากฟอร์ม
      const formData = new FormData(e.currentTarget);

      // ส่งข้อมูลไปให้ Server Action จัดการ (บันทึกลง DB)
      await addCar(formData);

      // หมายเหตุ: ไม่ต้องเขียน router.push() เพราะใน addCar มีคำสั่ง redirect แล้ว
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ---------------- Header Section ---------------- */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/cars"
          className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            เพิ่มรถยนต์คันใหม่
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            กรอกข้อมูลรายละเอียดรถยนต์ให้ครบถ้วน
          </p>
        </div>
      </div>

      {/* ---------------- Form Section ---------------- */}
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
                defaultValue={new Date().getFullYear()}
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
                defaultValue={0}
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
                defaultValue={0}
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
                defaultValue="AVAILABLE"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-white"
              >
                <option value="AVAILABLE">พร้อมขาย (Available)</option>
                <option value="BOOKED">จองแล้ว (Booked)</option>
                <option value="SOLD">ขายแล้ว (Sold)</option>
              </select>
            </div>
          </div>

          {/* ส่วนอัปโหลดรูปภาพ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* รูปภาพปก */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อัปโหลดรูปภาพปก (Cover Image)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-white"
              />
              <p className="text-xs text-gray-500 mt-2">
                รูปหลักที่จะแสดงบนหน้าแสดงรายการรถ
              </p>
            </div>

            {/* แกลเลอรีหลายรูป */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อัปโหลดรูปภาพเพิ่มเติม (Gallery)
              </label>
              <input
                type="file"
                name="gallery"
                multiple
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-white"
              />
              <p className="text-xs text-gray-500 mt-2">
                รองรับการเลือกหลายไฟล์พร้อมกัน (เลือกได้ 10 รูปรอบคันรถ)
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
                ${isLoading ? "bg-cyan-400 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700 shadow-sm hover:shadow-md"}
              `}
            >
              {isLoading ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูลรถยนต์"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
