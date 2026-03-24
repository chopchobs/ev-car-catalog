"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole, deleteUser } from "@/app/action/user";

export default function UserTableRow({ user, currentUserId }: { user: any, currentUserId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ป้องกันไม้ให้ Admin ระเบิดตัวเอง หรือยึดอำนาจตัวเอง
  const isSelf = user.id === currentUserId;

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    startTransition(async () => {
      await updateUserRole(user.id, newRole);
      router.refresh();
    });
  };

  const handleDelete = async () => {
    if (confirm(`⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้ "${user.name}" ออกจากระบบถาวร?`)) {
      startTransition(async () => {
        await deleteUser(user.id);
        router.refresh();
      });
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // แปะสีและรูปแบบ ตาม Role (ทำให้แยกแยะได้ชัดเจน)
  const isRoleAdmin = user.role === 'ADMIN';

  return (
    <tr className={`hover:bg-gray-50/50 transition-colors ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      
      {/* 1. คอลัมน์ 프로ไฟล์ผู้ใช้ */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md
            ${isRoleAdmin 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20' 
                : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-teal-500/20'}`}
          >
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight truncate max-w-[150px]">{user.name || "Member"}</p>
            {isSelf && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 rounded-full font-bold ml-1 inline-block mt-0.5">ตัวคุณเอง</span>}
          </div>
        </div>
      </td>
      
      {/* 2. อีเมล */}
      <td className="px-6 py-4 font-semibold text-gray-600 tracking-tight">
        {user.email}
      </td>
      
      {/* 3. Dropdown เปลี่ยนยศ (ทันสมัย มินิมอล) */}
      <td className="px-6 py-4">
        {isSelf ? (
           // ข้อมูลตัวเอง ให้โชว์เป็น Badge นิ่งๆ เปลี่ยนไม่ได้
           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm shadow-indigo-100/50">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
             Administrator
           </span>
        ) : (
           // ข้อมูลคนอื่น ให้เป็นปุ่ม Dropdown เปลี่ยนได้ และแสดงผลเป็นสัญลักษณ์สีชัดเจน
           <div className="relative inline-block w-full max-w-[140px]">
             <select 
               value={user.role} 
               onChange={handleRoleChange}
               disabled={isPending}
               className={`w-full appearance-none pl-4 pr-8 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer outline-none shadow-sm
                 ${isRoleAdmin 
                   ? 'bg-indigo-50 text-indigo-700 border-indigo-100/50 hover:border-indigo-200 focus:ring-2 focus:ring-indigo-500 shadow-indigo-100/50' 
                   : 'bg-emerald-50 text-emerald-700 border-emerald-100/50 hover:border-emerald-200 focus:ring-2 focus:ring-emerald-500 shadow-emerald-100/50'}`}
             >
               <option value="USER" className="font-bold">✨ Member</option>
               <option value="ADMIN" className="font-bold">🛡️ Administrator</option>
             </select>
             {/* ไอคอนลูกศร */}
             <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${isRoleAdmin ? 'text-indigo-400' : 'text-emerald-400'}`}>
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
             </div>
           </div>
        )}
      </td>

      {/* 4. วันที่สมัคร */}
      <td className="px-6 py-4 text-xs font-bold text-gray-400">
         {user.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH', {
            year: 'numeric', month: 'short', day: 'numeric'
         }) : "-"}
      </td>

      {/* 5. ปุ่มลบ (จัดการ) */}
      <td className="px-6 py-4 text-center">
        <button 
          onClick={handleDelete}
          disabled={isSelf || isPending}
          className={`p-2 rounded-xl transition-all ${
            isSelf 
              ? 'text-gray-200 cursor-not-allowed' 
              : 'text-gray-400 hover:text-red-600 hover:bg-red-50 focus:ring-4 focus:ring-red-100 block mx-auto'
          }`}
          title={isSelf ? "ไม่สามารถลบตัวเองได้" : "ลบบัญชีผู้ใช้"}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </td>
    </tr>
  );
}
