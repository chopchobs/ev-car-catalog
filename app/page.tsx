import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '@/components/layout/Hero';
import CarCard from '@/components/ui/CarCard';
import prisma from '@/lib/prisma'; // 1. นำเข้า Prisma Client

export default async function Home() {
  // 2. ดึงข้อมูลรถ 4 คันล่าสุดจาก Database (Supabase) ผ่าน Prisma
  const featuredCars = await prisma.car.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      gallery: {
        orderBy: { order: 'asc' }
      }
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 -z-10" />
          <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -z-10" />
          <Hero/>  
        </section>

        {/* Featured Cars Section */}
        <section id="featured-cars" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">รถแนะนำ</h2>
                <p className="mt-2 text-lg text-gray-600">EV Cars คุณภาพดีพร้อมส่งมอบ</p>
              </div>
              <a href="/catalog" className="hidden sm:block text-blue-600 font-medium hover:text-blue-700">
                ดูทั้งหมด &rarr;
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            
            <div className="mt-10 text-center sm:hidden">
              <a href="/catalog" className="text-blue-600 font-medium hover:text-blue-700 text-lg">
                ดูรถทั้งหมด &rarr;
              </a>
            </div>
          </div>
        </section>
        
        {/* Features/Trust Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold mb-2">คุณภาพคัดพิเศษ</h3>
                <p className="text-blue-100">ตรวจสอบสภาพแบตเตอรี่และระบบขับเคลื่อนทุกคัน มั่นใจได้</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold mb-2">ราคาคุ้มค่า</h3>
                <p className="text-blue-100">โปรโมชั่นดอกเบี้ยพิเศษ พร้อมของแถมและประกันภัยชั้น 1</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold mb-2">บริการหลังการขาย</h3>
                <p className="text-blue-100">ดูแลคุณตลอดการใช้งาน ด้วยทีมช่างผู้เชี่ยวชาญด้าน EV</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}