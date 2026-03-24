"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../action/register"; 

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      // เมื่อสมัครใช้งานเสร็จสมบูรณ์ ให้พาไปหน้า Login
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Logo แบบกดกลับไปหน้าแรกได้ */}
        <Link href="/" className="flex justify-center items-center gap-2 group mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </Link>

        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          สร้างบัญชีผู้ใช้งาน
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          หรือ{" "}
          <Link href="/login" className="font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
            เข้าสู่ระบบหากคุณมีบัญชีอยู่แล้ว
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100 sm:px-10">
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 border border-red-100 flex items-center gap-2">
               <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อ - นามสกุล</label>
              <input
                name="name"
                type="text"
                required
                placeholder="สมชาย ใจดี"
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">อีเมล</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">รหัสผ่าน</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-400 tracking-widest"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-gray-50/50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder-gray-400 tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  กำลังสร้างบัญชี...
                </>
              ) : (
                "ลงทะเบียนเปิดบัญชี"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
