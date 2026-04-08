"use client";

import { useState } from 'react';
import Link from 'next/link';
import FavoriteButton from './FavoriteButton';

// กำหนด Type ให้ตรงกับข้อมูลที่ดึงมาจาก Prisma
interface Car {
  id: string | number;
  brand: string;
  modelName: string;
  year: number;
  mileage: number;
  price: number;
  coverImage: string | null;
  status: 'AVAILABLE' | 'BOOKED' | 'SOLD';
  gallery?: { id: string; url: string; order: number }[];
  isFavorite?: boolean;
}

export default function CarCard({ car }: { car: Car }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // แปลงตัวเลขให้มีลูกน้ำ
  const formattedPrice = new Intl.NumberFormat('th-TH').format(car.price);
  const formattedMileage = new Intl.NumberFormat('th-TH').format(car.mileage);

  // รวมรูปภาพหน้าปกและภาพแกลเลอรีเข้าด้วยกัน
  const allImages = [
    car.coverImage,
    ...(car.gallery?.map((g) => g.url) || []),
  ].filter(Boolean) as string[];

  const hasImages = allImages.length > 0;

  // ฟังก์ชันเลื่อนรูประเบียง
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  // ฟังก์ชันเลือกสีป้ายสถานะ
  const getStatusBadge = (status: Car['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm tracking-wide">พร้อมขาย</span>;
      case 'BOOKED':
        return <span className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm tracking-wide">จองแล้ว</span>;
      case 'SOLD':
        return <span className="bg-gray-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm tracking-wide">ขายแล้ว</span>;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      
      {/* ---------------- รูปภาพ (Carousel) ---------------- */}
      <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden group/gallery">
        {/* ปุ่ม Favorite มุมซ้ายบน */}
        <FavoriteButton carId={String(car.id)} initialIsFavorite={car.isFavorite} />
        {hasImages ? (
          <>
            <img 
              src={allImages[currentImageIndex]} 
              alt={`${car.brand} ${car.modelName}`}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />
            {allImages.length > 1 && (
              <>
                {/* ปุ่มเลื่อนซ้าย */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-cyan-700 opacity-0 group-hover/gallery:opacity-100 hover:bg-white transition-all shadow-sm z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {/* ปุ่มเลื่อนขวา */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-cyan-700 opacity-0 group-hover/gallery:opacity-100 hover:bg-white transition-all shadow-sm z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                {/* จุดบอกตำแหน่ง (Indicators) */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {allImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex ? "w-4 bg-cyan-600 shadow-sm" : "w-1.5 bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* ป้ายสถานะ (ลอยอยู่บนรูป) */}
        <div className="absolute top-3 right-3 z-20">
          {getStatusBadge(car.status)}
        </div>

        {/* Overlay Sold Out ทับรูปภาพ */}
        {car.status === 'SOLD' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="px-6 py-3 border-4 border-white/80 rounded-xl transform -rotate-12 bg-gray-900/60 shadow-2xl">
              <span className="text-4xl font-black text-white tracking-widest uppercase drop-shadow-md">
                Sold Out
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- ข้อมูลรถ ---------------- */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* ยี่ห้อ และ รุ่น */}
        <div className="mb-3">
          <p className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">{car.brand}</p>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-cyan-700 transition-colors">
            {car.modelName}
          </h3>
        </div>

        {/* สเปค (ปี และ ไมล์) */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-5 font-medium">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {car.year}
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {formattedMileage} กม.
          </div>
        </div>

        {/* ราคา และ ปุ่มกด */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-0.5 font-medium">ราคา</p>
              <p className="text-xl font-bold text-gray-900">
                ฿{formattedPrice}
              </p>
            </div>
            <Link 
              href={`/cars/${car.id}`} 
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-cyan-600 hover:shadow-md hover:shadow-cyan-500/20 transition-all active:scale-95"
            >
              ดูสเปคเต็ม
            </Link>
          </div>

          {/* ปุ่ม Line OA (สไตล์มินิมอล ฟ้า-ขาว) */}
          <a 
            href="https://line.me/ti/p/~@evauto"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-700 text-sm font-semibold rounded-xl border border-cyan-100 transition-all active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.038 9.608.391.084.922.258 1.057.592.101.254.033.649 0 .899l-.159.948c-.049.297-.241 1.157 1.011.636 1.252-.52 6.777-3.992 9.38-6.945C23.235 14.155 24 12.333 24 10.304z" />
            </svg>
            ทักสอบถามผ่าน LINE
          </a>
        </div>
        
      </div>
    </div>
  );
}