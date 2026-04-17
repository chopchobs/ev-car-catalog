"use client";

import { useTransition, useState } from "react";
import { submitInquiry } from "@/app/action/inquiry";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setStatus(null);
    startTransition(async () => {
      const result = await submitInquiry(formData);
      if (result.error) {
        setStatus({ success: false, message: result.error });
      } else {
        setStatus({ success: true, message: result.message });
        // รีเซ็ตฟอร์ม
        const form = document.getElementById("contactForm") as HTMLFormElement;
        if (form) form.reset();
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">
      <h2 className="text-xl font-medium text-neutral-900 mb-6">
        ส่งข้อความถึงเรา
      </h2>

      {status && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium ${status.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}
        >
          {status.message}
        </div>
      )}

      <form id="contactForm" action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* firstName */}
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-neutral-700"
            >
              ชื่อจริง <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="ชื่อของคุณ"
            />
          </div>
          {/* lastName */}
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-neutral-700"
            >
              นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="นามสกุล"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700"
            >
              อีเมล <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="อีเมลสำหรับติดต่อกลับ"
            />
          </div>
          {/* phone */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-neutral-700"
            >
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="08X-XXX-XXXX"
            />
          </div>
        </div>

        {/* subject */}
        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-neutral-700"
          >
            หัวข้อเรื่อง (เช่น จองทดลองขับ / สอบถามรุ่นรถ)
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200"
            placeholder="เรื่องที่ต้องการติดต่อ"
          />
        </div>

        {/* message */}
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-neutral-700"
          >
            ข้อความ <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
            placeholder="โปรดระบุรายละเอียดรถที่สนใจ หรือคำถามของคุณ..."
          ></textarea>
        </div>
        {/* submit button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group ${isPending ? "bg-neutral-400 cursor-not-allowed" : "bg-neutral-900 hover:bg-neutral-800"}`}
        >
          {/* submit button text */}
          <span>{isPending ? "กำลังส่งข้อความ..." : "ส่งข้อความ"}</span>
          {/* submit button icon */}
          {!isPending && (
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
