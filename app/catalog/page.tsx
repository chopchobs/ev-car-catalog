import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CarCard from "@/components/ui/CarCard";
import CatalogFilter from "@/components/ui/CatalogFilter";
import Hero from "@/components/layout/Hero";
import { getSavedCarIds } from "@/app/action/favorite";

// Next.js 15 requires searchParams to be awaited as a Promise
export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const brand = typeof resolvedParams.brand === "string" ? resolvedParams.brand : "ALL";
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : "ALL";
  // สร้างเงื่อนไข Prisma แบบ Dynamic
  // ถ้าพารามิเตอร์มาเป็น ALL ให้ข้ามไป (ไม่ใส่เงื่อนไข)
  const whereClause: any = {};

  if (brand && brand !== "ALL") {
    whereClause.brand = brand; // Match exact brand
  }

  if (status && status !== "ALL") {
    whereClause.status = status; // Match exact status mapped to string implicitly compatible with enum in Prisma
  }

  if (search) {
    whereClause.OR = [
      { brand: { contains: search, mode: "insensitive" } },
      { modelName: { contains: search, mode: "insensitive" } },
    ];
  }

  // ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกัน (ไม่ต้องรอให้เสร็จทีละอัน ประหยัดเวลา)
  const [cars, distinctBrands, savedCarIds] = await Promise.all([
    // 1. ดึงรูปรถบวกเงื่อนไขตัวกรอง
    prisma.car.findMany({
      where: whereClause,
      include: { gallery: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    // 2. ดึงยี่ห้อแบบยูนีคทั้งหมดจาก DB ไปทำตัวเลือก Dropdown
    prisma.car.findMany({
      select: { brand: true },
      distinct: ["brand"],
    }),
    // 3. ดึงรถที่ถูกใจของผู้ใช้
    getSavedCarIds(),
  ]);
  // สกัดเอาเฉพาะ string ชื่อแบรนด์และเรียงตัวอักษร A-Z
  const uniqueBrands = distinctBrands.map(item => item.brand).sort();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero เล็กๆ สำหรับหน้านี้ */}
      <Hero showSearch={false} />

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ส่วนของตัวกรองค้นหา Client Component */}
          <div className="-mt-20 relative z-20">
            <CatalogFilter brands={uniqueBrands} />
          </div>

          {/* สรุปจำนวนรถ */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              พบรถยนต์ทั้งหมด <span className="text-cyan-600 px-2">{cars.length}</span> คัน
            </h2>
          </div>

          {/* Grid แสดงรูป */}
          {cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {cars.map((car) => (
                <CarCard key={car.id} car={{ ...car, isFavorite: savedCarIds.includes(car.id) }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบรถยนต์ที่คุณค้นหา</h3>
              <p className="text-gray-500 text-lg">ลองเปลี่ยนการตั้งค่าตัวกรอง หรือค้นหาด้วยชื่อรุ่นอื่นดูนะครับ</p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}