"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const menuItems = [
    { name: '📊 แดชบอร์ด', path: '/admin' },
    { name: '🚗 จัดการรถยนต์', path: '/admin/cars' },
    { name: '👥 จัดการผู้ใช้', path: '/admin/users' },
  ];
  return (
    <aside className="w-64 bg-[#0b1120] text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-cyan-400">EVo Admin</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`block px-4 py-3 rounded transition-colors ${
                isActive ? 'bg-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-sm">
        <button className="w-full text-left px-4 py-2 rounded hover:bg-red-900/50 text-red-400 transition-colors">
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}