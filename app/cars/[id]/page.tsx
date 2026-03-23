import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ImageGallery from "@/components/ui/ImageGallery";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const car = await prisma.car.findUnique({
    where: { id },
    include: { gallery: { orderBy: { order: 'asc' } } }
  });

  if (!car) {
    return notFound();
  }

  // เตรียมชุดรูปภาพ
  const allImages = [
    car.coverImage,
    ...(car.gallery?.map((g) => g.url) || []),
  ].filter(Boolean) as string[];

  const formattedPrice = new Intl.NumberFormat('th-TH').format(car.price);
  const formattedMileage = new Intl.NumberFormat('th-TH').format(car.mileage);

  // ฟังก์ชันเลือกสีป้ายสถานะ
  const getStatusBadge = (status: 'AVAILABLE' | 'BOOKED' | 'SOLD') => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">พร้อมส่งมอบ</span>;
      case 'BOOKED':
        return <span className="bg-orange-100 text-orange-800 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">จองแล้ว</span>;
      case 'SOLD':
        return <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">ขายแล้ว (Sold Out)</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-sm text-gray-500 gap-2 font-medium">
            <Link href="/" className="hover:text-cyan-600 transition-colors">หน้าแรก</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-cyan-600 transition-colors">รถทั้งหมด</Link>
            <span>/</span>
            <span className="text-gray-900">{car.brand}</span>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
              
              {/* ซ้าย: แกลเลอรีรูปภาพ */}
              <div className="relative">
                {car.status === 'SOLD' && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-red-600 text-white px-5 py-2 rounded-lg font-black tracking-widest uppercase shadow-lg transform -rotate-6 inline-block">
                      Sold Out
                    </span>
                  </div>
                )}
                <ImageGallery images={allImages} carName={`${car.brand} ${car.modelName}`} />
              </div>

              {/* ขวา: รายละเอียดสเปค */}
              <div className="flex flex-col">
                
                {/* Brand & Status */}
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-black text-cyan-600 uppercase tracking-widest">{car.brand}</p>
                  {getStatusBadge(car.status)}
                </div>

                {/* Model Name */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                  {car.modelName}
                </h1>

                {/* ราคา */}
                <div className="mb-8">
                  <p className="text-sm text-gray-500 font-medium mb-1">ราคา</p>
                  <p className="text-4xl font-black text-gray-900">฿{formattedPrice}</p>
                </div>

                <hr className="border-gray-100 mb-8" />

                {/* Grid สเปคหลัก */}
                <h3 className="text-lg font-bold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-cyan-200 transition-colors">
                    <p className="text-sm text-gray-500 mb-1">ปีที่ผลิต</p>
                    <p className="text-lg font-bold text-gray-900">{car.year}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-cyan-200 transition-colors">
                    <p className="text-sm text-gray-500 mb-1">เลขไมล์</p>
                    <p className="text-lg font-bold text-gray-900">{formattedMileage} กม.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-cyan-200 transition-colors">
                    <p className="text-sm text-gray-500 mb-1">สีตัวถัง</p>
                    <p className="text-lg font-bold text-gray-900">{car.color || "-"}</p>
                  </div>
                </div>

                {/* รายละเอียดเพิ่มเติม */}
                {car.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">รายละเอียดของรถ</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {car.description}
                    </p>
                  </div>
                )}

                {/* Features (ถ้ามี) */}
                {car.features && car.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">จุดเด่น & ออปชั่น</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {car.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                          <svg className="w-5 h-5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="font-medium">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ปุ่มติดต่อ LINE (Sticky on mobile or bottom of panel) */}
                <div className="mt-auto pt-6">
                  <a 
                    href="https://line.me/ti/p/~@evauto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[#00B900] hover:bg-[#009c00] text-white text-lg font-bold rounded-2xl transition-all shadow-lg shadow-[#00B900]/30 active:scale-95 hover:-translate-y-1"
                  >
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.038 9.608.391.084.922.258 1.057.592.101.254.033.649 0 .899l-.159.948c-.049.297-.241 1.157 1.011.636 1.252-.52 6.777-3.992 9.38-6.945C23.235 14.155 24 12.333 24 10.304z" />
                    </svg>
                    คุยปรึกษาหรือขอรูปเพิ่มเติมทาง LINE
                  </a>
                  <p className="text-center sm:text-left text-sm text-gray-400 mt-4">
                    ติดต่อสอบถามได้ตลอด 24 ชั่วโมง แอดมินใจดี ตอบไวมากค่ะ 😊
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
