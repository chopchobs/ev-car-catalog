"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// สร้าง Context เพื่อให้ทั่วทั้งแอพเข้าถึงรายการเปรียบเทียบนี้ได้
interface CompareContextType {
  selectedCarIds: string[];
  toggleCompare: (carId: string) => void;
  clearCompare: () => void;
  isMaxReached: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);
// สร้าง Provider Component
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);
  const MAX_COMPARE = 3;

  // โหลดจาก LocalStorage ตอนเปิดเวบ
  useEffect(() => {
    const saved = localStorage.getItem("compareCarIds");
    if (saved) {
      try {
        setSelectedCarIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse compareCarIds from localStorage");
      }
    }
  }, []);

  // เซฟลง LocalStorage ทุกครั้งที่ ค่า selectedCarIds เปลี่ยน
  useEffect(() => {
    localStorage.setItem("compareCarIds", JSON.stringify(selectedCarIds));
  }, [selectedCarIds]);

  const toggleCompare = (carId: string) => {
    setSelectedCarIds((prev) => {
      // ถ้ามีอยู่แล้วให้เอาออก
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId);
      }
      // ถ้ายังไม่มี และยังไม่เกินโควต้า ให้เพิ่มเข้าไป
      if (prev.length < MAX_COMPARE) {
        return [...prev, carId];
      }
      // ถ้าเกิน 3 คัน จะไม่ให้เพิ่ม (โชว์ Alert)
      alert(`คุณเลือกเปรียบเทียบได้สูงสุด ${MAX_COMPARE} คันเท่านั้นครับ`);
      return prev;
    });
  };

  const clearCompare = () => {
    setSelectedCarIds([]);
  };

  const isMaxReached = selectedCarIds.length >= MAX_COMPARE;

  return (
    <CompareContext.Provider
      value={{ selectedCarIds, toggleCompare, clearCompare, isMaxReached }}
    >
      {children}
    </CompareContext.Provider>
  );
}

// Custom Hook เพื่อความสะดวกในการเรียกใช้ Context
export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
