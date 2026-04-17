import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CarCard from "@/components/ui/CarCard";
import Link from "next/link";

export default async function FavoritesPage() {
  const token = (await cookies()).get("session")?.value;
  if (!token) {
    redirect("/login");
  }

  const session = await verifyToken(token);
  if (!session) {
    redirect("/login");
  }

  // ดึงข้อมูลรถที่ผู้ใช้กด Favorite พร้อมดึงภาพแกลเลอรี
  const savedCarsData = await prisma.savedCar.findMany({
    where: { userId: session.id },
    include: {
      car: {
        include: {
          gallery: { orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const savedCars = savedCarsData.map((sc) => sc.car);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-16 bg-white dark:bg-slate-900 border-b border-neutral-200 dark:border-slate-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight flex items-center gap-4">
            <span className="text-red-500 drop-shadow-sm">
              <svg className="w-10 h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </span>
            รถคันโปรดของฉัน
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl font-medium">
            คอลเล็กชันรถยนต์ไฟฟ้าที่คุณสนใจและบันทึกเก็บไว้ เพื่อการตัดสินใจที่ง่ายขึ้น
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-6 max-w-7xl py-12 pb-32">
        {savedCars.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                คุณมีรถที่บันทึกไว้ <span className="text-red-500 px-1">{savedCars.length}</span> คัน
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {savedCars.map((car) => (
                <CarCard key={car.id} car={{ ...car, isFavorite: true }} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm mt-8">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">ยังไม่มีรถคันโปรด</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 text-center max-w-md leading-relaxed">
              กดปุ่ม <span className="inline-flex items-center justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full p-1 mx-1 shadow-sm"><svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></span> ที่มุมรูปภาพบนรถคันที่คุณชอบ เพื่อบันทึกเก็บไว้ดูย้อนหลังหรือเปรียบเทียบได้ง่ายขึ้น</p>
            <Link 
              href="/catalog" 
              className="px-8 py-3.5 bg-gray-900 dark:bg-slate-100 hover:bg-cyan-600 dark:hover:bg-cyan-500 text-white dark:text-slate-900 rounded-xl font-bold shadow-lg shadow-cyan-600/20 dark:shadow-cyan-400/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              ค้นหารถที่ใช่เลย
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
