"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/app/action/user"; // re-use admin session checker

export async function submitInquiry(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!firstName || !lastName || !email || !message) {
      return {
        error:
          "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อ, นามสกุล, อีเมล, ข้อความ)",
      };
    }

    await prisma.inquiry.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });

    return {
      success: true,
      message:
        "ข้อความของคุณถูกส่งเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด ขอบคุณครับ!",
    };
  } catch (error) {
    console.error("Submit inquiry error:", error);
    return { error: "เกิดข้อผิดพลาดในการส่งข้อความ โปรดลองใหม่อีกครั้ง" };
  }
}

export async function getInquiries() {
  const admin = await getAdminSession();
  if (!admin) {
    return { error: "ไม่มีสิทธิ์เข้าถึง" };
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, inquiries };
  } catch (error) {
    console.error("Get inquiries error:", error);
    return { error: "เกิดข้อผิดพลาดในการดึงข้อมูลข้อความ" };
  }
}

export async function markAsRead(id: string) {
  const admin = await getAdminSession();
  if (!admin) {
    return { error: "ไม่มีสิทธิ์เข้าถึง" };
  }

  try {
    await prisma.inquiry.update({
      where: { id },
      data: { status: "READ" },
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Mark as read error:", error);
    return { error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" };
  }
}
