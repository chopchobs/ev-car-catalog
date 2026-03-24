"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/action/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บกระพริบรีเฟรชอัติโนมัติแบบตัวดั้งเดิม
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget); // ดูดตัวแปรจาก <input> มัดรวมกัน
    const result = await loginUser(formData);       // ยิงไปตรวจรหัสแบบ "Server Action" ปลอดภัยหลังบ้าน

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      // Login สำเร็จ ให้เช็คระดับชั้น (Role)
      if (result.role === 'ADMIN') {
        router.push("/admin/cars");
      } else {
        router.push("/"); // ส่วนแอดมินให้มาหน้าจัดการ User ปกติกลับหน้าแรก
      }
      router.refresh(); 
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        
        {/* หัวกระดาษ */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">เข้าสู่ระบบบัญชี</h1>
          <p className="text-gray-500 mt-2 text-sm">เข้าสู่ระบบเพื่อดำเนินการธุรกรรมของคุณ</p>
        </div>

        {/* กล่องแสดงข้อความ Error คืนตัวหนังสือสีแดง */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 border border-red-100 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">อีเมลผู้ใช้งาน</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>
          
          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">รหัสผ่านลับ</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-400 tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 transition-all hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังตรวจสอบข้อมูล...
              </>
            ) : (
               "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <a href="/" className="text-cyan-600 hover:text-cyan-700 font-bold tracking-wide">
            &larr; ออกไปเดินเล่นหน้าเว็บไซต์หลัก
          </a>
        </div>
      </div>
    </div>
  );
}
