"use server";

import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// เช็คสิทธิ์และดึงข้อมูลของ Admin ที่กำลังล็อกอินอยู่
async function getAdminSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  const session = await verifyToken(token);
  if (session?.role !== 'ADMIN') return null;
  return session;
}

export async function updateUserRole(userId: string, newRole: string) {
  const admin = await getAdminSession();
  if (!admin) return { error: "ไม่มีสิทธิ์เข้าถึง" };
  if (admin.id === userId) return { error: "ไม่สามารถปรับลดสิทธิ์ของตัวเองได้" };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as "USER" | "ADMIN" }
    });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "เกิดข้อผิดพลาดในการอัปเดตสิทธิ์" };
  }
}

export async function deleteUser(userId: string) {
  const admin = await getAdminSession();
  if (!admin) return { error: "ไม่มีสิทธิ์เข้าถึง" };
  if (admin.id === userId) return { error: "ไม่สามารถลบบัญชีหลักของตัวเองได้" };

  try {
    // Note: หากผูก Foreign Key หลายตาราง (เช่น ตารางจองรถ) ควรลบ หรือ cascade ให้ดีๆ
    // ในที่นี้เน้นระบบ User ง่ายๆ จึงลบได้เลย
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "เกิดข้อผิดพลาดในการลบผู้ใช้งาน (อาจมีข้อมูลอ้างอิงอยู่)" };
  }
}
