import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  // รับค่า ids จาก searchParams
  const { ids } = await searchParams;
  // ถ้าไม่มี ids ให้แสดงข้อความว่าไม่มีรถที่เลือกเปรียบเทียบ
  if (!ids) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ไม่มีรถที่เลือกเปรียบเทียบ
          </h1>
          <Link href="/catalog" className="text-blue-600 hover:underline">
            กลับไปหน้ารายการรถ
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  // แยกค่า ids ออกเป็น array และจำกัดแค่ 3 คัน
  const carIdsArray = ids.split(",").slice(0, 3); // จำกัดแค่ 3 คัน
  // ดึงข้อมูลรถจาก database
  const cars = await prisma.car.findMany({
    where: {
      id: { in: carIdsArray },
    },
  });

  // เรียงลำดับรถให้ตรงกับที่เลือกมา
  const sortedCars = carIdsArray
    .map((id) => cars.find((c) => c.id === id))
    .filter(Boolean) as typeof cars;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-16 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            เปรียบเทียบสเปค
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl font-medium">
            ข้อมูลเชิงลึกเปรียบเทียบสเปครถยนต์ไฟฟ้าที่คุณสนใจ
            เพื่อการตัดสินใจที่ดีที่สุด
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-6 max-w-7xl py-12 pb-32">
        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              {/* ตารางส่วนหัว (รูปรถ, ชื่อ, ราคา) */}
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="w-48 p-6 bg-gray-50 align-bottom">
                    <p className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-2">
                      รุ่นที่เลือก
                    </p>
                    <p className="text-3xl font-black text-gray-900">
                      {sortedCars.length} คัน
                    </p>
                  </th>
                  {sortedCars.map((car, index) => (
                    <th key={car.id} className="p-6 align-top w-1/3">
                      <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-gray-100 mb-4 ring-1 ring-black/5">
                        <img
                          src={car.coverImage}
                          alt={car.modelName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">
                        {car.brand}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                        {car.modelName}
                      </h3>
                      <p className="text-2xl font-black text-gray-900 mb-4">
                        ฿{new Intl.NumberFormat("th-TH").format(car.price)}
                      </p>
                      <Link
                        href={`/cars/${car.id}`}
                        className="block w-full text-center py-2.5 px-4 bg-gray-900 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        ดูรายละเอียด
                      </Link>
                    </th>
                  ))}
                  {/* กรอบเปล่าสำหรับช่องที่ว่าง */}
                  {Array.from({ length: 3 - sortedCars.length }).map((_, i) => (
                    <th
                      key={`empty-th-${i}`}
                      className="p-6 align-top w-1/3 opacity-50"
                    >
                      <div className="aspect-4/3 w-full border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50">
                        <span className="text-gray-400 font-medium">
                          เพิ่มรถเพื่อเปรียบเทียบ
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* ตารางส่วนสเปค */}
              <tbody className="divide-y divide-gray-100">
                {/* แถว: ปีผลิต */}
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/50">
                    ปีที่ผลิต / Year
                  </td>
                  {sortedCars.map((car) => (
                    <td
                      key={`year-${car.id}`}
                      className="p-6 font-medium text-gray-600"
                    >
                      {car.year}
                    </td>
                  ))}
                  {Array.from({ length: 3 - sortedCars.length }).map((_, i) => (
                    <td
                      key={`year-empty-${i}`}
                      className="p-6 bg-gray-50/20"
                    ></td>
                  ))}
                </tr>

                {/* แถว: เลขไมล์ */}
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/50">
                    เลขไมล์ / Mileage
                  </td>
                  {sortedCars.map((car) => (
                    <td
                      key={`mileage-${car.id}`}
                      className="p-6 font-medium text-gray-600"
                    >
                      {new Intl.NumberFormat("th-TH").format(car.mileage)} กม.
                    </td>
                  ))}
                  {Array.from({ length: 3 - sortedCars.length }).map((_, i) => (
                    <td
                      key={`mile-empty-${i}`}
                      className="p-6 bg-gray-50/20"
                    ></td>
                  ))}
                </tr>

                {/* แถว: สีรถ */}
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/50">
                    สีภายนอก / Color
                  </td>
                  {sortedCars.map((car) => (
                    <td
                      key={`color-${car.id}`}
                      className="p-6 font-medium text-gray-600"
                    >
                      {car.color || "-"}
                    </td>
                  ))}
                  {Array.from({ length: 3 - sortedCars.length }).map((_, i) => (
                    <td
                      key={`col-empty-${i}`}
                      className="p-6 bg-gray-50/20"
                    ></td>
                  ))}
                </tr>

                {/* แถว: ฟีเจอร์เด่น */}
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-semibold text-gray-900 bg-gray-50/50 align-top">
                    ฟีเจอร์เด่น
                    <br />
                    <span className="text-gray-400 text-sm font-normal">
                      Features
                    </span>
                  </td>
                  {sortedCars.map((car) => (
                    <td key={`feat-${car.id}`} className="p-6 align-top">
                      <ul className="space-y-2">
                        {car.features.slice(0, 5).map((feat, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-blue-500 mt-0.5">•</span>
                            {feat}
                          </li>
                        ))}
                        {car.features.length > 5 && (
                          <li className="text-sm text-gray-400 italic">
                            ...และอื่นๆ
                          </li>
                        )}
                      </ul>
                    </td>
                  ))}
                  {Array.from({ length: 3 - sortedCars.length }).map((_, i) => (
                    <td
                      key={`feat-empty-${i}`}
                      className="p-6 bg-gray-50/20"
                    ></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
