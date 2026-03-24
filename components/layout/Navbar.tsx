import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import ProfileDropdown from '@/components/ui/ProfileDropdown';

export default async function Navbar() {
  // ดึง Session เพื่อเช็คว่า User ล็อกอินอยู่หรือไม่
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const user = token ? await verifyToken(token) : null;

  // ฟังก์ชันดึงตัวอักษรแรกของชื่อ
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo (Left) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {/* รูปสายฟ้า สื่อถึงพลังงานไฟฟ้า */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:to-cyan-600 transition-all duration-300">
                EVo Auto
              </span>
            </Link>
          </div>

          {/* 2. Navigation & Actions (Right) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            
            {/* Main Links */}
            <div className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-cyan-600 text-sm font-bold tracking-wide transition-colors duration-200">
                หน้าหลัก
              </Link>
              <Link href="/catalog" className="text-gray-600 hover:text-cyan-600 text-sm font-bold tracking-wide transition-colors duration-200">
                รถทั้งหมด
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-cyan-600 text-sm font-bold tracking-wide transition-colors duration-200">
                ติดต่อเรา
              </Link>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200"></div>

            {/* Auth Buttons หรือ User Profile Dropdown */}
            {user ? (
              <ProfileDropdown user={{ name: user.name || null, email: user.email, role: user.role }} />
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-cyan-600 text-sm font-bold tracking-wide transition-colors duration-200"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gray-900 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-cyan-500/25 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button  */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-cyan-600 transition-colors p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}