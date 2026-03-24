"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logoutUser } from "@/app/action/auth";

interface UserProfile {
  name: string | null;
  email: string;
  role: string;
}

export default function ProfileDropdown({ user }: { user: UserProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ปิด Dropdown อัตโนมัติเวลาเอาเมาส์คลิกด้านนอกกล่อง
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* ปุ่มกด Profile */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
          {getInitials(user.name)}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-bold text-gray-900 leading-none">{user.name || "Member"}</p>
          <p className="text-xs text-cyan-600 font-semibold mt-1">{user.role === 'ADMIN' ? 'Administrator' : 'Member'}</p>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {/* เมนู Dropdown ลอยลงมา (Glassmorphism Effect) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          
          {/* ข้อมูลสรุป */}
          <div className="px-4 py-3 border-b border-gray-100/70 mb-1">
            <p className="text-sm font-bold text-gray-900 truncate tracking-wide">{user.name}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
          </div>

          <div className="p-2 space-y-1">
            
            <Link 
              href="/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-all font-semibold"
            >
              <div className="bg-gray-100 p-1.5 rounded-lg text-gray-500 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              แก้ไขข้อมูลส่วนตัว
            </Link>

            {user.role === 'ADMIN' && (
              <Link 
                href="/admin/cars" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-all font-semibold"
              >
                <div className="bg-gray-100 p-1.5 rounded-lg text-gray-500 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                ระบบจัดการหลังบ้าน
              </Link>
            )}
          </div>

          <div className="p-2 border-t border-gray-100/70 mt-1">
            <form action={logoutUser}>
              <button 
                type="submit" 
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold text-left group"
              >
                <div className="bg-red-50 p-1.5 rounded-lg text-red-500 group-hover:bg-red-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </div>
                ออกจากระบบ
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
