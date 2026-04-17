"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero({ showSearch = true }: { showSearch?: boolean }) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchInput)}`);
    } else {
      router.push(`/catalog`);
    }
  };
  const words = ["ค้นหารถยนต์ไฟฟ้า", "รถยนต์ไฟฟ้ามือสอง", "EV Car มือสอง"];
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum,setloopNum] = useState(0);

  useEffect(() => {
    // ฟังก์ชันจัดการการพิมพ์และลบ
    const handleTyping = () => {
      // หาคำปัจจุบัน โดยใช้ loopNum % words.length
      const i = loopNum % words.length;
      const fullText = words[i];
      // 1. ถ้ากำลัง "พิมพ์"
      if (!isDeleting) {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
        
        // ถ้าพิมพ์ครบคำแล้ว ให้หยุดพัก 2 วินาที แล้วเปลี่ยนสถานะเป็น "กำลังลบ"
        if (displayedText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } 
      // 2. ถ้ากำลัง "ลบ"
      else {
        setDisplayedText(fullText.substring(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setloopNum(loopNum + 1);
          setIsDeleting(false);
        }
      }
    };

    // กำหนดความเร็ว: ลบ (50ms) จะเร็วกว่า พิมพ์ (150ms)
    const typingSpeed = isDeleting ? 0 : 150;
    
    // ตั้งเวลาให้ทำงานฟังก์ชัน handleTyping ตามความเร็วที่กำหนด
    const timer = setTimeout(handleTyping, typingSpeed);

    // เคลียร์ timer เมื่อ component ถูกทำลายหรือมีการอัปเดต state
    return () => clearTimeout(timer);
    
  }, [displayedText, isDeleting, loopNum]); // ทำงานใหม่ทุกครั้งที่ข้อความหรือสถานะการลบเปลี่ยนไป

  return (
    <div className={`relative w-full min-h-[40vh] bg-[#f4f8ff] dark:bg-slate-900 flex flex-col items-center justify-center text-center px-4 overflow-hidden py-16 md:py-24 ${!showSearch && 'pb-24 md:pb-32'}`}>
      
      {/* ---------------- Background Glowing Orbs ---------------- */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/50 dark:bg-blue-900/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/50 dark:bg-cyan-900/30 rounded-full blur-[100px] pointer-events-none"></div>

      {/* ---------------- Text Content ---------------- */}
      <h2 className="text-blue-600 dark:text-cyan-400 font-semibold text-xl md:text-2xl mb-4 tracking-widest uppercase">
        ขับเคลื่อนสู่อนาคต
      </h2>
      
      {/* ล็อกความสูงไว้ เพื่อไม่ให้หน้าเว็บขยับขึ้นลงตอนตัวอักษรเปลี่ยน */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white mb-6 flex items-center justify-center min-h-[60px] md:min-h-[80px]">
        {displayedText}
        <span className="animate-pulse ml-2 font-light text-black dark:text-white">|</span>
      </h1>
      
      <p className={`max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed z-10 ${showSearch ? 'mb-12' : 'mb-4'}`}>
        ศูนย์รวม EV Car มือสอง คัดสรรคุณภาพ เพื่อประสบการณ์ขับขี่ที่ดีที่สุดของคุณ
      </p>

      {/* ---------------- Search Bar ---------------- */}
      {showSearch && (
        <form onSubmit={handleSearch} className="w-full max-w-3xl bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 p-[2px] rounded-full shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 transition-all z-10">
          <div className="w-full bg-white dark:bg-slate-900 rounded-full flex items-center px-4 py-3 md:py-4">
            
            <svg className="w-6 h-6 text-blue-500 dark:text-cyan-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.646 3.146a.5.5 0 0 1 .708 0l1.986 1.986 1.986-1.986a.5.5 0 0 1 .708.708l-1.986 1.986 1.986 1.986a.5.5 0 0 1-.708.708l-1.986-1.986-1.986 1.986a.5.5 0 0 1-.708-.708l1.986-1.986-1.986-1.986a.5.5 0 0 1 0-.708zm-7 7a.5.5 0 0 1 .708 0L7.34 12.132l1.986-1.986a.5.5 0 0 1 .708.708l-1.986 1.986 1.986 1.986a.5.5 0 0 1-.708.708l-1.986-1.986-1.986 1.986a.5.5 0 0 1-.708-.708l1.986-1.986-1.986-1.986a.5.5 0 0 1 0-.708zM12 11.5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2a.5.5 0 0 1 .5-.5z" />
            </svg>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="เช่น Tesla Model 3, BYD Atto 3, วิ่งน้อยกว่า 10,000 กม."
              className="flex-1 outline-none text-slate-800 dark:text-slate-100 bg-transparent text-base md:text-lg placeholder-slate-400 dark:placeholder-slate-500 w-full"
            />

            <button type="submit" className="flex items-center text-slate-400 dark:text-slate-400 text-sm md:text-base border-l-2 border-slate-100 dark:border-slate-700 pl-3 md:pl-4 ml-2 flex-shrink-0 group cursor-pointer bg-transparent border-t-0 border-r-0 border-b-0 outline-none">
              <span className="hidden sm:block mr-2 font-medium group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">EV Search</span>
              <div className="bg-blue-50 dark:bg-slate-800 p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-slate-700 transition-colors">
                <svg className="w-5 h-5 text-blue-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </button>

          </div>
        </form>
      )}

    </div>
  );
}