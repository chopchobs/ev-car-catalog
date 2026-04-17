import Link from "next/link";
import prisma from "@/lib/prisma"; // ดึง prisma แบบ default export ตามไฟล์ที่คุณตั้งค่าไว้
import DeleteButton from "./components/DeleteButton";

export default async function AdminCarsPage() {
  // 1. ดึงข้อมูลรถทั้งหมดจาก Database เรียงจากใหม่ไปเก่า
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* ---------------- Header Section ---------------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            จัดการข้อมูลรถยนต์
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            รายการรถยนต์ทั้งหมดในระบบ (พบ {cars.length} คัน)
          </p>
        </div>
        <Link
          href="/admin/cars/add"
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          เพิ่มรถคันใหม่
        </Link>
      </div>

      {/* ---------------- Table Section ---------------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium text-center w-24">รูปภาพ</th>
                <th className="p-4 font-medium">ยี่ห้อ / รุ่น</th>
                <th className="p-4 font-medium">ปี / เลขไมล์</th>
                <th className="p-4 font-medium">ราคา (บาท)</th>
                <th className="p-4 font-medium text-center">สถานะ</th>
                <th className="p-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* กรณีไม่มีข้อมูลใน Database */}
              {cars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-900">
                        ยังไม่มีข้อมูลรถยนต์
                      </p>
                      <p className="text-sm mt-1">
                        คลิกปุ่ม "เพิ่มรถคันใหม่" ด้านบนเพื่อเริ่มต้น
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* วนลูปแสดงข้อมูลรถ */
                cars.map((car) => (
                  <tr
                    key={car.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* 1. รูปหน้าปก */}
                    <td className="p-4">
                      <div className="w-20 h-14 rounded-md overflow-hidden bg-gray-100 border border-gray-200 mx-auto flex items-center justify-center">
                        {car.coverImage ? (
                          <img
                            src={car.coverImage}
                            alt={car.modelName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            ไม่มีรูป
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 2. ยี่ห้อและรุ่น */}
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">
                        {car.brand}
                      </div>
                      <div className="text-sm text-gray-500">
                        {car.modelName}
                      </div>
                    </td>

                    {/* 3. ปีและเลขไมล์ */}
                    <td className="p-4 text-gray-700">
                      <div>{car.year}</div>
                      <div className="text-sm text-gray-500">
                        {car.mileage.toLocaleString()} กม.
                      </div>
                    </td>

                    {/* 4. ราคา */}
                    <td className="p-4 font-semibold text-gray-900">
                      ฿{car.price.toLocaleString()}
                    </td>

                    {/* 5. สถานะ (เปลี่ยนสีตาม Status) */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                        ${car.status === "AVAILABLE" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        ${car.status === "BOOKED" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                        ${car.status === "SOLD" ? "bg-gray-100 text-gray-600 border-gray-300" : ""}
                      `}
                      >
                        {car.status === "AVAILABLE" && "พร้อมขาย"}
                        {car.status === "BOOKED" && "จองแล้ว"}
                        {car.status === "SOLD" && "ขายแล้ว"}
                      </span>
                    </td>

                    {/* 6. ปุ่มจัดการ (ชั่วคราวยังเป็นแค่ลิงก์) */}
                    <td className="p-4 text-right space-x-3">
                      <Link
                        href={`/admin/cars/edit/${car.id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                      >
                        แก้ไข
                      </Link>
                      <DeleteButton id={car.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
