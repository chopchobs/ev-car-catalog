"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export default function CatalogFilter({ brands }: { brands: string[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentBrand = searchParams.get("brand") || "ALL";
  const currentStatus = searchParams.get("status") || "ALL";
  const currentSearchUrl = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearchUrl);

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Always reset to page 1 if pagination existed, but we don't have it yet.
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateUrl("search", searchTerm);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 mb-8 shadow-xl border border-gray-100 relative shadow-gray-200/50">
      {/* Loading overlay for smooth transition */}
      {isPending && (
        <div className="absolute inset-0 bg-white/50 z-20 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* ค้นหาข้อมูลง่ายๆ */}
        <div className="md:col-span-5 lg:col-span-6">
          <label className="block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">ค้นหารถยนต์</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหา ยี่ห้อ หรือ รุ่น..."
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 outline-none transition-colors"
            />
            <button 
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-cyan-600 rounded-xl border border-cyan-600 hover:bg-cyan-700 focus:ring-2 focus:outline-none focus:ring-cyan-300 transition-all shadow-sm"
            >
              ค้นหา
            </button>
          </form>
        </div>

        {/* ยี่ห้อรถ */}
        <div className="md:col-span-4 lg:col-span-3">
          <label className="block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">แบรนด์</label>
          <select
            value={currentBrand}
            onChange={(e) => updateUrl("brand", e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 outline-none transition-colors cursor-pointer appearance-none"
            style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
          >
            <option value="ALL">ทุกแบรนด์ (All)</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* สถานะ */}
        <div className="md:col-span-3 lg:col-span-3">
          <label className="block text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">สถานะ</label>
          <select
            value={currentStatus}
            onChange={(e) => updateUrl("status", e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 outline-none transition-colors cursor-pointer appearance-none"
            style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
          >
            <option value="ALL">ทุกสถานะ (All)</option>
            <option value="AVAILABLE">พร้อมขาย (Available)</option>
            <option value="BOOKED">จองแล้ว (Booked)</option>
            <option value="SOLD">ขายแล้ว (Sold Out)</option>
          </select>
        </div>

      </div>
    </div>
  );
}
