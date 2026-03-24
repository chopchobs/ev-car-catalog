"use client";
import { usePathname } from 'next/navigation';

export default function AdminNavbar({ user }: { user?: any }) {
  const pathname = usePathname();

  // สร้างฟังก์ชันง่ายๆ แปลง Path เป็นชื่อหน้าเว็บ เพื่อโชว์บน Navbar
  const getPageTitle = () => {
    if (pathname === '/admin') return 'ภาพรวมระบบ (Dashboard)';
    if (pathname.includes('/admin/cars')) return 'จัดการข้อมูลรถยนต์';
    if (pathname.includes('/admin/users')) return 'จัดการผู้ใช้งาน';
    return 'ระบบจัดการหลังบ้าน';
  };

  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      
      {/* ฝั่งซ้าย: ชื่อหน้าปัจจุบัน และปุ่มแฮมเบอร์เกอร์สำหรับมือถือ (ซ่อนในจอใหญ่) */}
      <div className="flex items-center gap-4">
        {/* ปุ่มเมนูสำหรับมือถือ (Mobile Menu Button) */}
        <button className="md:hidden p-2 text-gray-500 hover:text-cyan-600 rounded-md">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* ชื่อหน้าปัจจุบัน มีเส้นคั่นสีฟ้าเท่ๆ */}
        <h1 className="text-xl font-semibold text-gray-800 border-l-4 border-cyan-500 pl-3">
          {getPageTitle()}
        </h1>
      </div>

      {/* ฝั่งขวา: แจ้งเตือน และ โปรไฟล์แอดมิน */}
      <div className="flex items-center gap-6">
        
        {/* ไอคอนแจ้งเตือน */}
        <button className="relative p-2 text-gray-400 hover:text-cyan-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* จุดแดงแจ้งเตือน */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* เส้นคั่นแนวตั้ง */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* โปรไฟล์ผู้ใช้งาน */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">{user?.name || "Admin"}</p>
            <p className="text-xs text-cyan-600 font-semibold mt-0.5">ผู้ดูแลระบบ</p>
          </div>
          {/* รูปโปรไฟล์ */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-200 text-white flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
            {getInitials(user?.name)}
          </div>
        </div>

      </div>
    </header>
  );
}