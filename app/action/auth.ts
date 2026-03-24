"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน" };
  }

  try {
    // 1. ค้นหาอีเมลในฐานข้อมูลว่ามีตัวตนจริงไหม
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return { error: "อีเมลไม่ถูกต้อง หรือไม่พบบัญชีผู้ใช้นี้ในระบบ" };
    }

    // 2. เอารหัสผ่านที่พิมพ์ลงในฟอร์ม ไปย้อนกระบวนการเทียบกับ Hash ที่เก็บใน DB ว่าตรงกันหรือไม่
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return { error: "รหัสผ่านไม่ถูกต้อง รบกวนตรวจสอบอีกครั้ง" };
    }

    // 3. เอาเงื่อนไขที่บังคับเฉพาะ ADMIN ออก เพื่ออนุญาตสมาชิกล็อกอินได้
    // if (user.role !== "ADMIN") { ... }

    // 4. สร้างการ์ดอัจฉริยะ (JWT Token) อายุการใช้งาน 1 วัน
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name, // พกชื่อใส่การ์ดไปด้วย
    });

    // 5. บันทึกตั๋ว (Token) ฝังลงไปใน Cookie แบบลับ
    (await cookies()).set("session", token, { // เปลี่ยนชื่อจาก admin_session เป็น session กลาง
      httpOnly: true,     
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",          
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "เกิดข้อผิดพลาดคอขวดบนเซิร์ฟเวอร์ โปรดลองใหม่" };
  }
}

export async function logoutUser() {
  (await cookies()).delete("session");
  redirect("/login");
}
