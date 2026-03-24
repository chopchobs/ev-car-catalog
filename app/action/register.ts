"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email || !password) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  if (password !== confirmPassword) {
    return { error: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน" };
  }

  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" };
  }

  try {
    // เช็คว่าอีเมลนี้ถูกใช้สมัครไปหรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "อีเมลนี้มีผู้ใช้งานแล้ว โปรดใช้อีเมลอื่น หรือเข้าสู่ระบบ" };
    }

    // ทำการเข้ารหัส Password อย่างระมัดระวัง
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้างข้อมูลลงตาราง User ใหม่
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // ค่าเริ่มต้นให้ตั้งเป็นแค่ USER ธรรมดาก่อน ห้ามตั้งเป็น ADMIN 
        role: "USER", 
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Register error:", error);
    return { error: "เกิดข้อผิดพลาดในการสมัครสมาชิก โปรดลองใหม่อีกครั้ง" };
  }
}
