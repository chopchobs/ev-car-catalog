import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserTableRow from "./UserTableRow";

export default async function UsersPage() {
  // 1. ตรวจสอบสิทธิ์ Admin (ถ้าทะลุ Middleware มาได้ ก็ตรวจซ้ำอีกทีเพื่อความชัวร์)
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");
  
  const session = await verifyToken(token);
  if (!session || session.role !== "ADMIN") redirect("/login");

  // 2. ดึงข้อมูล User ทั้งหมดจาก Database (ใหม่ล่าสุดขึ้นก่อน)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Header สวยๆ แนว Dashboard สมัยใหม่ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            จัดการผู้ใช้งานในระบบ
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">ตั้งค่าสิทธิ์ กำหนดการเข้าถึง และลบบัญชีผู้ใช้</p>
        </div>
        <div className="bg-white px-5 py-2 border border-gray-100 rounded-full shadow-sm text-sm font-bold text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          มีผู้ใช้งานระบบทั้งหมด {users.length} คน
        </div>
      </div>

      {/* ตารางแสดงผล */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f8fafc] text-gray-500 font-bold border-b border-gray-100/80">
              <tr>
                <th scope="col" className="px-6 py-5 whitespace-nowrap">ข้อมูลสมาชิก</th>
                <th scope="col" className="px-6 py-5 whitespace-nowrap">อีเมล (Email)</th>
                <th scope="col" className="px-6 py-5 whitespace-nowrap">ระดับของบัญชี (Role)</th>
                <th scope="col" className="px-6 py-5 whitespace-nowrap">วันที่เข้าร่วม</th>
                <th scope="col" className="px-6 py-5 text-center whitespace-nowrap">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <UserTableRow key={user.id} user={user} currentUserId={session.id} />
              ))}
            </tbody>
          </table>
          
          {/* กรณีฐานข้อมูลว่าง (เป็นไปได้ยากเพราะต้องมี Admin) */}
          {users.length === 0 && (
             <div className="text-center py-16 text-gray-400 font-bold flex flex-col items-center">
                <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                ยังไม่มีข้อมูลผู้ใช้ในระบบ
             </div>
          )}
        </div>
      </div>
    </div>
  );
}