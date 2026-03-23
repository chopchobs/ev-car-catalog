import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                {/* รูปสายฟ้า สื่อถึงพลังงานไฟฟ้า */}
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              EVo Auto Drive
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-md font-medium transition-all hover:bg-blue-50">
              หน้าหลัก
            </Link>
            <Link href="/catalog" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-md font-medium transition-all hover:bg-blue-50">
              รถทั้งหมด
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-md font-medium transition-all hover:bg-blue-50">
              ติดต่อเรา
            </Link>
          </div>

          {/* Action Button (Clean Light Theme) */}
          <div className="flex items-center">
            <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-blue-600 rounded-full group bg-gradient-to-br from-cyan-400 to-blue-600 hover:text-white shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105">
              <span className="relative px-6 py-2 transition-all ease-in duration-75 bg-white rounded-full group-hover:bg-opacity-0">
                เข้าสู่ระบบ
              </span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}