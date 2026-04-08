import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CarCard from "@/components/ui/CarCard";

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">รถคันโปรดของคุณ ❤️</h1>
            <p className="text-gray-500 font-medium mt-1">คอลเล็กชันรถที่คุณสนใจ บันทึกไว้เพื่อไม่ให้พลาด.</p>
          </div>

          {savedCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {savedCars.map((car) => (
                <CarCard key={car.id} car={{ ...car, isFavorite: true }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ยังไม่มีรถคันโปรด</h3>
              <p className="text-gray-500 text-lg mb-6">คุณสามารถกดหัวใจที่การ์ดรถยนต์เพื่อบันทึกไว้ดูภายหลังได้</p>
              <a href="/catalog" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-all shadow-sm">
                ไปเลือกรถกันเลย
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
