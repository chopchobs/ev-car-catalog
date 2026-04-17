import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '@/components/layout/Hero';
import CarCard from '@/components/ui/CarCard';
import prisma from '@/lib/prisma';
import LogoBar from '@/components/layout/LogoBar';
import { getSavedCarIds } from '@/app/action/favorite';

export default async function Home() {
  const savedCarIds = await getSavedCarIds();

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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="grow">
        {/* 1. Hero Section (Includes Quick Search) */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-900">
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-900 -z-10" />
          <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl -z-10" />
          <Hero />  
        </section>

        {/* 2. Trusted Brands Section */}
        <section className="py-10 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-medium text-gray-400 dark:text-slate-500 tracking-wider uppercase mb-6">
              แบรนด์ชั้นนำที่ลูกค้าไว้วางใจ
            </p>
            <LogoBar />
          </div>
        </section>

        {/* 3. Featured Cars Section */}
        <section id="featured-cars" className="py-24 bg-gray-50 dark:bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div className="max-w-2xl">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium tracking-wide mb-4 border border-blue-100/50 dark:border-blue-800/50">
                  ✨ FEATURED COLLECTION
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-slate-200 dark:to-slate-400 tracking-tight mb-3">
                  รถแนะนำ
                </h2>
                <p className="text-lg sm:text-xl text-gray-500 dark:text-slate-400 font-light">
                  EV Cars คุณภาพดีพร้อมส่งมอบ คัดสรรมาเพื่อคุณโดยเฉพาะ
                </p>
              </div>
              <a href="/catalog" className="hidden sm:flex items-center space-x-2 text-gray-500 dark:text-slate-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group pb-2">
                <span>ดูทั้งหมด</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={{ ...car, isFavorite: savedCarIds.includes(car.id) }} />
              ))}
            </div>
            
            <div className="mt-10 text-center sm:hidden">
              <a href="/catalog" className="inline-flex items-center space-x-2 text-gray-600 dark:text-slate-300 font-medium hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <span>ดูรถทั้งหมด</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </div>
          </div>
        </section>

        {/* 4. Browse by Lifestyle */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">เลือกรถตามไลฟ์สไตล์</h2>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-light">ค้นหารถที่ตอบโจทย์การใช้ชีวิตของคุณ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category 1 */}
              <a href="/catalog?search=SUV" className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-br from-blue-900 to-indigo-900 transition-transform duration-500 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">Family SUV</h3>
                  <p className="text-blue-100 font-light">กว้างขวาง นั่งสบาย สำหรับครอบครัว</p>
                </div>
              </a>
              {/* Category 2 */}
              <a href="/catalog?search=City" className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-600 to-teal-800 transition-transform duration-500 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">City Commuter</h3>
                  <p className="text-emerald-100 font-light">คล่องตัว ขับในเมือง หาที่จอดง่าย</p>
                </div>
              </a>
              {/* Category 3 */}
              <a href="/catalog?search=Long+Range" className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-br from-purple-700 to-pink-800 transition-transform duration-500 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">Long Range</h3>
                  <p className="text-purple-100 font-light">วิ่งไกลกว่า 500 กม. ไม่ต้องชาร์จบ่อย</p>
                </div>
              </a>
            </div>
          </div>
        </section>
        
        {/* 5. Why Choose Us (Premium Features) */}
        <section className="bg-gray-900 dark:bg-slate-950 py-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">ทำไมต้องซื้อ EV กับเรา?</h2>
              <p className="text-lg text-gray-400 dark:text-slate-400 font-light">เรามอบความมั่นใจสูงสุดด้วยมาตรฐานและบริการหลังการขาย</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: "🔋", title: "แถมฟรี Wallbox", desc: "พร้อมติดตั้งฟรีที่บ้าน" },
                { icon: "🛡️", title: "ตรวจเช็ก 150 จุด", desc: "รับประกันสภาพรถและแบตเตอรี่" },
                { icon: "📉", title: "ดอกเบี้ยพิเศษ", desc: "เริ่มต้นเพียง 1.XX% ต่อปี" },
                { icon: "👨‍🔧", title: "ศูนย์บริการ EV", desc: "ช่างผู้เชี่ยวชาญดูแลตลอดการใช้งาน" }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-800/50 dark:bg-slate-900/50 backdrop-blur border border-gray-700/50 dark:border-slate-800/50 rounded-3xl p-8 hover:bg-gray-800 dark:hover:bg-slate-900 transition-colors duration-300">
                  <div className="w-16 h-16 bg-gray-700/50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 font-light">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Testimonials */}
        <section className="py-24 bg-gray-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">ความประทับใจจากลูกค้า</h2>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-light">เสียงตอบรับจากผู้ใช้จริงที่ออกรถกับเรา</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "คุณเอกพันธ์", car: "Tesla Model 3", quote: "รถสภาพใหม่มาก แบตเช็กแล้วสมบูรณ์ 100% บริการหลังการขายดีเยี่ยม อุ่นใจครับ" },
                { name: "คุณรวิสรา", car: "BYD Atto 3", quote: "ตัดสินใจไม่ผิดเลยค่ะ มีทีมงานอธิบายเรื่องการชาร์จให้ฟังอย่างละเอียด น้องเซลล์น่ารักมาก" },
                { name: "คุณกฤษฎา", car: "MG EP", quote: "ได้ดอกเบี้ยถูกกว่าที่อื่น แถม Wallbox ให้ด้วย จบครบในที่เดียว แนะนำเลยครับ" }
              ].map((review, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 relative">
                  <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
                  <p className="text-gray-700 dark:text-slate-300 font-light leading-relaxed mb-6">"{review.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-500 dark:text-slate-300 font-bold">
                      {review.name[3]}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{review.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">ออกรถ {review.car}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CTA / Line Registration */}
        <section className="py-20 bg-blue-600 dark:bg-blue-900 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight">
              ยังตัดสินใจไม่ได้? ปรึกษาผู้เชี่ยวชาญฟรี
            </h2>
            <p className="text-xl text-blue-100 font-light mb-10 max-w-2xl mx-auto">
              ทักแชทพูดคุยกับทีมงานของเราผ่าน LINE เพื่อรับคำแนะนำเลือกรถ EV ที่เหมาะกับคุณ
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#" className="w-full sm:w-auto px-8 py-4 bg-[#00B900] hover:bg-[#00A000] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.21,11.39C22.21,6.56,17.65,2.6,12,2.6S1.79,6.56,1.79,11.39c0,4.3,3.61,7.92,8.44,8.68c.32.07.76.22.87.51c.1.26.03.66,0,.92l-.17,1.01c-.05.31-.24,1.25,1.08.68c1.33-.57,7.18-4.23,9.08-6.72A8.19,8.19,0,0,0,22.21,11.39Z"/>
                </svg>
                <span>Add LINE Official</span>
              </a>
              <a href="/contact" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 font-bold rounded-xl transition-all shadow-lg text-lg">
                นัดหมายทดลองขับ
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}