import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function AdminDashboardPage() {
  // 1. ตรวจสอบสิทธิ์ Admin
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");
  
  const session = await verifyToken(token);
  if (!session || session.role !== "ADMIN") redirect("/login");

  // 2. ดึงข้อมูลสถิติจาก Database แบบขนาน (Parallel) เพื่อความรวดเร็ว
  const [
    totalCars,
    soldCars,
    totalUsers,
    adminUsers,
    recentCars,
    recentUsers
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: "SOLD" } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.car.findMany({ 
      take: 4, 
      orderBy: { createdAt: "desc" },
      select: { id: true, brand: true, modelName: true, price: true, coverImage: true, status: true, slug: true }
    }),
    prisma.user.findMany({ 
      take: 5, 
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    })
  ]);

  const availableCars = totalCars - soldCars;
  const memberUsers = totalUsers - adminUsers;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* -----------------------------
          1. Header & Welcome Section 
      ------------------------------ */}
      <div className="bg-gradient-to-r from-gray-900 to-[#0b1120] rounded-[2rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Decorative Graphic */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">ยินดีต้อนรับกลับ, <span className="text-cyan-400">{session.name}</span> 👋</h1>
            <p className="text-gray-400 font-medium">ภาพรวมระบบและข้อมูลล่าสุดของเว็บไซต์ {new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}</p>
          </div>
          <Link 
            href="/admin/cars" 
            className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
          >
            ไปหน้าจัดการรถยนต์
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>

      {/* -----------------------------
          2. Stat Cards Section 
      ------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Card 1: ผู้ใช้งานระบบ */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm shadow-gray-200/50 flex flex-col hover:border-purple-200 transition-colors">
           <div className="flex items-center justify-between mb-4">
             <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-[1.25rem] flex items-center justify-center">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
             </div>
             <Link href="/admin/users" className="text-sm font-bold text-gray-400 hover:text-purple-600">จัดการข้อมูล &rarr;</Link>
           </div>
           <div>
             <p className="text-gray-500 text-sm font-bold mb-1">สมาชิกผู้ใช้ทั้งหมดในระบบ</p>
             <h3 className="text-4xl font-black text-gray-900">{totalUsers} <span className="text-lg font-bold text-gray-400">บัญชี</span></h3>
           </div>
           <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-semibold">
             <div className="flex items-center gap-2 text-purple-600">
               <span className="w-2 h-2 rounded-full bg-purple-500"></span>
               ผู้ดูแลระบบ: {adminUsers}
             </div>
             <div className="flex items-center gap-2 text-gray-500">
               <span className="w-2 h-2 rounded-full bg-gray-300"></span>
               ผู้ใช้ทั่วไป: {memberUsers}
             </div>
           </div>
        </div>

        {/* Card 2: รถยนต์ทั้งหมด */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm shadow-gray-200/50 flex flex-col hover:border-cyan-200 transition-colors">
           <div className="flex items-center justify-between mb-4">
             <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-[1.25rem] flex items-center justify-center">
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <Link href="/admin/cars" className="text-sm font-bold text-gray-400 hover:text-cyan-600">ดูแคตตาล็อก &rarr;</Link>
           </div>
           <div>
             <p className="text-gray-500 text-sm font-bold mb-1">รถยนต์ EV ทั้งหมดของคุณ</p>
             <h3 className="text-4xl font-black text-gray-900">{totalCars} <span className="text-lg font-bold text-gray-400">คัน</span></h3>
           </div>
           <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-sm font-semibold">
             <div className="flex items-center gap-2 text-emerald-600">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               พร้อมขาย: {availableCars}
             </div>
             <div className="flex items-center gap-2 text-gray-400">
               <span className="w-2 h-2 rounded-full bg-gray-300"></span>
               ขายไปแล้ว: {soldCars}
             </div>
           </div>
        </div>
      </div>

      {/* -----------------------------
          3. ล่าสุด (Recent Updates)
      ------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ผู้ใช้ล่าสุด */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm shadow-gray-200/50 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              สมาชิกใหม่ล่าสุด
            </h2>
            <Link href="/admin/users" className="text-sm font-bold text-cyan-600 hover:text-cyan-700">ลานผู้ใช้ &rarr;</Link>
          </div>
          <div className="space-y-4">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${u.role === 'ADMIN' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20' : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-teal-500/20'}`}>
                  {(u.name?.charAt(0) || "U").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{u.name || "Member"}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{u.email}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100/50' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && <p className="text-sm text-gray-500 font-medium text-center py-4">ยังไม่มีผู้ใช้งาน</p>}
          </div>
        </div>

        {/* รถยนต์ล่าสุด */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm shadow-gray-200/50 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
              เพิ่มสต๊อกล่าสุด
            </h2>
            <Link href="/admin/cars" className="text-sm font-bold text-cyan-600 hover:text-cyan-700">ดูแคตตาล็อก &rarr;</Link>
          </div>
          <div className="space-y-4">
            {recentCars.map((car) => (
              <div key={car.id} className="group flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                {/* Image Cover */}
                <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {car.coverImage ? (
                    <Image src={car.coverImage} fill alt={car.modelName} className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate group-hover:text-cyan-600 transition-colors">{car.brand} {car.modelName}</p>
                  <p className="text-xs text-cyan-600 font-semibold mt-0.5">฿{car.price.toLocaleString()}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full border shadow-sm ${car.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {car.status === 'AVAILABLE' ? 'พร้อมขาย' : 'ขายแล้ว'}
                  </span>
                </div>
              </div>
            ))}
            {recentCars.length === 0 && <p className="text-sm text-gray-500 font-medium text-center py-4">ยังไม่มีรถในสต๊อก</p>}
          </div>
        </div>

      </div>

    </div>
  );
}