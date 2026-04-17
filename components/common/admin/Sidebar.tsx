"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/app/action/auth";

export default function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const menuItems = [
    { name: "📊 แดชบอร์ด", path: "/admin" },
    { name: "🚗 จัดการรถยนต์", path: "/admin/cars" },
    { name: "👥 จัดการผู้ใช้", path: "/admin/users" },
    { name: "✉️ ข้อความติดต่อ", path: "/admin/inquiries" },
  ];
  return (
    <aside className="w-64 bg-[#0b1120] text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
          EVo Admin
        </h2>
        {user && (
          <p className="text-sm text-gray-400 mt-1.5 truncate font-medium">
            ✨ {user.name}
          </p>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-3 rounded transition-colors ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* ควบคุมการออกจากระบบ และกลับหน้าบ้าน */}
      <div className="p-4 space-y-2 border-t border-gray-800 bg-[#070b16]">
        <Link
          href="/"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-800 text-gray-300 hover:text-white transition-all text-sm font-bold group"
        >
          <svg
            className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          กลับสู่หน้าหลัก
        </Link>

        <form action={logoutUser}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-900/30 text-red-500 hover:text-red-400 transition-all text-sm font-bold text-left group"
          >
            <svg
              className="w-5 h-5 text-red-600/70 group-hover:text-red-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            ออกจากระบบ
          </button>
        </form>
      </div>
    </aside>
  );
}
