"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * สลับสถานะรายการโปรด (กดหัวใจ)
 * ถ้ายังไม่บันทึกจะบันทึก, ถ้าบันทึกแล้วจะลบออก
 */
export async function toggleFavorite(carId: string) {
  try {
    const token = (await cookies()).get("session")?.value;
    if (!token) {
      return { error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" };
    }

    const session = await verifyToken(token);
    if (!session) {
      return { error: "เซสชันไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่" };
    }

    const userId = session.id;

    // เช็คว่าเคยบันทึกไว้หรือยัง
    const existingFavorite = await prisma.savedCar.findUnique({
      where: {
        userId_carId: {
          userId,
          carId,
        },
      },
    });

    if (existingFavorite) {
      // ถ้ามีแล้ว ให้เลิกบันทึก
      await prisma.savedCar.delete({
        where: {
          userId_carId: {
            userId,
            carId,
          },
        },
      });
      revalidatePath("/catalog");
      revalidatePath("/profile/favorites");
      revalidatePath("/");
      return { success: true, isFavorite: false };
    } else {
      // ถ้ายังไม่มี ให้บันทึก
      await prisma.savedCar.create({
        data: {
          userId,
          carId,
        },
      });
      revalidatePath("/catalog");
      revalidatePath("/profile/favorites");
      revalidatePath("/");
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error("Favorite toggle error:", error);
    return { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }
}

/**
 * ดึงรายการ ID ของรถที่ผู้ใช้บันทึกไว้
 * (เอาไว้เช็คสถานะรูปหัวใจตอนโหลดหน้าเว็บ)
 */
export async function getSavedCarIds(): Promise<string[]> {
  try {
    const token = (await cookies()).get("session")?.value;
    if (!token) return [];

    const session = await verifyToken(token);
    if (!session) return [];

    const savedCars = await prisma.savedCar.findMany({
      where: { userId: session.id },
      select: { carId: true },
    });

    return savedCars.map((s: { carId: string }) => s.carId);
  } catch (error) {
    console.error("Get saved cars error:", error);
    return [];
  }
}
