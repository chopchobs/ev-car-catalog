"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  // ดึงค่า Token จาก Cookie
  const token = (await cookies()).get("session")?.value;
  if (!token) return { error: "ไม่พบเซสชัน กรุณาล็อกอินใหม่" };
  // ตรวจสอบ Token
  const userSession = await verifyToken(token);
  if (!userSession) return { error: "เซสชันหมดอายุ กรุณาล็อกอินใหม่" };
  // ดึงข้อมูลจากฟอร์ม
  const name = formData.get("name") as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;
  // ตรวจสอบว่ากรอกชื่อหรือไม่
  if (!name || !name.trim()) {
    return { error: "กรุณาระบุชื่อของคุณด้วยครับ" };
  }
  // ตรวจสอบว่ากรอกรหัสผ่านปัจจุบันหรือไม่
  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const userInDb = await prisma.user.findUnique({
      where: { id: userSession.id },
    });

    if (!userInDb) return { error: "ไม่พบบัญชีผู้ใช้งานในระบบ" };
    // สร้างตัวแปร updateData เพื่อเก็บข้อมูลที่จะอัปเดต
    const updateData: any = { name: name.trim() };

    // กรณีที่ 2: ถ้าผู้ใช้กรอกข้อมูลรหัสผ่านมาด้วย (แสดงว่าต้องการเปลี่ยนรหัสผ่าน)
    if (newPassword || currentPassword) {
      if (!currentPassword)
        return {
          error:
            "กรุณากรอก 'รหัสผ่านปัจจุบัน' เพื่อยืนยันตัวตนว่าคุณเป็นเจ้าของบัญชีจริง",
        };

      const isMatch = await bcrypt.compare(currentPassword, userInDb.password);
      if (!isMatch) return { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง โปรดลองใหม่" };

      if (newPassword !== confirmNewPassword)
        return { error: "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน" };
      if (newPassword.length < 6)
        return { error: "รหัสผ่านใหม่ต้องมีความยาว 6 ตัวอักษรขึ้นไป" };

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }
    // อัปเดตข้อมูลผู้ใช้
    await prisma.user.update({
      where: { id: userSession.id },
      data: updateData,
    });

    // สั่งให้ Next.js รีโหลด Navbar และหน้าต่างๆ ใหม่ เพื่อดึงชื่อใหม่แสดงผล
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "อัปเดตข้อมูลส่วนตัวเสร็จสมบูรณ์เรียบร้อยแล้ว!",
    };
  } catch (error) {
    console.error(error);
    return { error: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล โปรดลองใหม่" };
  }
}
