import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EditCarForm from "./EditCarForm";

export default async function EditCarPage({
  params,
}: {
  params: { id: string };
}) {
  // รองรับ Next.js 15+ (params.id เป็น Promise) ตามมาตรฐานใหม่
  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id },
    include: { gallery: true },
  });

  if (!car) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ---------------- Header Section ---------------- */}
      <div className="flex items-center gap-4">
        <a
          href="/admin/cars"
          className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-full transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </a>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            แก้ไขข้อมูลรถยนต์
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            อัปเดตข้อมูลของ {car.brand} {car.modelName}
          </p>
        </div>
      </div>

      <EditCarForm car={car} />
    </div>
  );
}
