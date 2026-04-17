"use client";

import { useState } from "react";
import { updateProfile } from "@/app/action/profile";
import { useRouter } from "next/navigation";

interface ClientProfileFormProps {
  initialName: string;
  email: string;
}

export default function ProfileForm({
  initialName,
  email,
}: ClientProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.message || "อัปเดตข้อมูลสำเร็จ");
      // ล้างช่องป้อนรหัสผ่านให้ว่างเปล่า
      const form = e.target as HTMLFormElement;
      form.currentPassword.value = "";
      form.newPassword.value = "";
      form.confirmNewPassword.value = "";
      router.refresh();
    }
    setIsLoading(false);
  }

  return (
    <div className="bg-white rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10 mb-8 overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-[60px] pointer-events-none" />

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl mb-8 border border-red-100 flex items-start gap-3 relative z-10">
          <svg
            className="w-5 h-5 shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-bold">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-700 text-sm p-4 rounded-2xl mb-8 border border-emerald-100 flex items-start gap-3 relative z-10">
          <svg
            className="w-5 h-5 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="font-bold">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        {/* ข้อมูลพื้นฐาน */}
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-cyan-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            ข้อมูลทั่วไป
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                อีเมลเข้าสู่ระบบ (ระบบล็อกไว้)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 px-4 py-3.5 rounded-xl outline-none cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ชื่อ - นามสกุลที่แสดงผล
              </label>
              <input
                name="name"
                type="text"
                defaultValue={initialName}
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* อัปเดตรหัสผ่าน */}
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2 mt-10">
            <svg
              className="w-5 h-5 text-cyan-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            ส่วนของความปลอดภัย (เปลี่ยนรหัสผ่าน)
          </h3>
          <p className="text-sm text-gray-500 font-medium mb-6 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
            💡 หากคุณต้องการแก้ไขแค่ชื่อนามสกุล
            ไม่จำเป็นต้องกรอกฟอร์มด้านล่างนี้ ปล่อยให้ว่างไว้ได้เลยครับ
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                รหัสผ่านปัจจุบัน{" "}
                <span className="text-gray-400 font-normal">
                  (เพื่อยืนยันตัวตน)
                </span>
              </label>
              <input
                name="currentPassword"
                type="password"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all tracking-widest placeholder-gray-300"
                placeholder="••••••••"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  รหัสผ่านใหม่
                </label>
                <input
                  name="newPassword"
                  type="password"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all tracking-widest placeholder-gray-300"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  name="confirmNewPassword"
                  type="password"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all tracking-widest placeholder-gray-300"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ปุ่ม Submit */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5bg-linear-to-r from-gray-900 to-gray-800 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                กำลังอัปเดตข้อมูล...
              </>
            ) : (
              "บันทึกการแก้ไข"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
