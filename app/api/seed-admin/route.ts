import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1. ใช้ bcrypt เพื่อทำแฮช (บดความลับการจัดวาง) รหัสผ่าน 'password123' ให้กลายเป็นตัวอักษรขยะแบบสุ่ม
    // สุ่มเกลือ (Salt) ความเข้ม 10 ระดับ
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // 2. เช็คกันเหนียวว่า แอดมินคนนี้เคยถูกกดแอดไว้อยู่แล้วหรือยัง ป้องกันการเพิ่มข้อมูลซ้ำเออร์เร่อ
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@evauto.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "พบบัญชีส่วนของ Admin ใน Database นี้อยู่แล้วครับผม!" });
    }

    // 3. ทำการ Insert ข้อมูลคนแรกเข้าสู่ตาราง User แสนสะอาดของเรา
    const newAdmin = await prisma.user.create({
      data: {
        email: "admin@evauto.com",
        password: hashedPassword, // เราเก็บรหัสที่ผ่านการทุบทำเละแล้วแบบนี้! (ตัวหนังสือแปลกๆ)
        name: "Super Admin",
        role: "ADMIN",
      },
    });

    return NextResponse.json({ 
      message: "🎉 สร้างบัญชีผู้ดูแลระบบ (Admin) คนแรกเข้าฐานข้อมูลเสร็จเรียบร้อยแล้ว!",
      test_email: newAdmin.email, 
      test_password: "password123" 
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to seed admin", details: error.message }, { status: 500 });
  }
}
