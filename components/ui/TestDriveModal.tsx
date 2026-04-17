"use client";

import { useState, useTransition } from "react";
import { submitInquiry } from "@/app/action/inquiry";

interface Props {
  carName: string;
}

export default function TestDriveModal({ carName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setStatus(null);
    // เพิ่ม Subject อัตโนมัติเป็นชื่อรถ
    formData.set("subject", `สนใจนัดทดลองขับ: ${carName}`);

    startTransition(async () => {
      const result = await submitInquiry(formData);
      if (result.error) {
        setStatus({ success: false, message: result.error });
      } else {
        setStatus({ success: true, message: result.message });
        // รอ 2 วินาทีแล้วปิด Modal เอง
        setTimeout(() => setIsOpen(false), 2000);
      }
    });
  };

  return (
    <>
      {/* ปุ่มเปิด Modal */}
      <button
        onClick={() => {
          setIsOpen(true);
          setStatus(null);
        }}
        className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-slate-100 hover:bg-cyan-600 dark:hover:bg-cyan-500 text-white dark:text-gray-900 text-lg font-bold rounded-2xl transition-all shadow-lg active:scale-95 hover:-translate-y-1"
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        นัดหมายทดลองขับ
      </button>

      {/* Modal Overlay และ ตัวกล่อง Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-cyan-600 dark:text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                จองคิวทดลองขับ
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 dark:bg-slate-800 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                คุณกำลังนัดหมายสำหรับรถ{" "}
                <strong className="text-cyan-600 dark:text-cyan-400 text-base">
                  {carName}
                </strong>
                <br />
                กรุณากรอกข้อมูลของคุณเพื่อให้ทีมงานติดต่อกลับ
              </p>

              {status && (
                <div
                  className={`mb-6 p-4 rounded-xl text-sm font-medium ${status.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50" : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50"}`}
                >
                  {status.message}
                </div>
              )}

              <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                      ชื่อจริง *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                      นามสกุล *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                      อีเมล *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                    วันที่สะดวกหรือข้อความเพิ่มเติม *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={3}
                    placeholder="เช่น วันเสาร์ช่วงบ่าย เข้าไปดูที่นัดหมาย..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all dark:text-white resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3.5 text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-all"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-2 py-3.5 text-white bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-700 dark:hover:bg-cyan-600 rounded-xl font-bold shadow-lg shadow-cyan-600/20 transition-all disabled:bg-cyan-400 dark:disabled:bg-cyan-800"
                  >
                    {isPending ? "กำลังบันทึก..." : "ยืนยันการจอง"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
