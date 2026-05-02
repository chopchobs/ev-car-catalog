"use server"; // <-- คำสั่งศักดิ์สิทธิ์ บังคับรันบน Server เท่านั้น!

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  uploadCarImage,
  deleteCarImage,
  deleteCarImages,
} from "@/lib/supabase-storage";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const carFormSchema = z.object({
  brand: z.string().min(1, "กรุณาระบุแบรนด์"),
  modelName: z.string().min(1, "กรุณาระบุรุ่น"),
  year: z.coerce.number().positive("ปีต้องเป็นตัวเลขบวก"),
  mileage: z.coerce.number().nonnegative("ระยะทางต้องไม่ติดลบ"),
  price: z.coerce.number().positive("ราคาต้องมากกว่า 0"),
  status: z.enum(["AVAILABLE", "BOOKED", "SOLD"], {
    message: "สถานะไม่ถูกต้อง",
  }),
});

// Add new car
export async function addCar(formData: FormData) {
  // Authentication & RBAC Check
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  // Zod Validation
  const parsed = carFormSchema.safeParse({
    brand: formData.get("brand"),
    modelName: formData.get("modelName"),
    year: formData.get("year"),
    mileage: formData.get("mileage"),
    price: formData.get("price"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "ข้อมูลไม่ถูกต้อง",
      errors: parsed.error.flatten(),
    };
  }

  const { brand, modelName, year, mileage, price, status } = parsed.data;

  // ดึงข้อมูล *ไฟล์* ออกจากฟอร์ม
  const coverImageFile = formData.get("coverImage") as File | null;
  const galleryFiles = formData.getAll("gallery") as File[];

  // File Upload Validation [coverImageFile, galleryFiles] (Security)
  if (coverImageFile && coverImageFile.size > 0) {
    if (!coverImageFile.type.startsWith("image/")) {
      return {
        success: false,
        message: "กรุณาเลือกไฟล์รูปภาพสำหรับหน้าปก",
      };
    }
    if (coverImageFile.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: "ไฟล์รูปปกต้องมีขนาดไม่เกิน 5MB",
      };
    }
  }

  if (galleryFiles && galleryFiles.length > 0) {
    for (const file of galleryFiles) {
      if (file.size > 0) {
        if (!file.type.startsWith("image/")) {
          return {
            success: false,
            message: "ไฟล์ในแกลเลอรีต้องเป็นรูปภาพเท่านั้น",
          };
        }
        if (file.size > 5 * 1024 * 1024) {
          return {
            success: false,
            message: "รูปภาพแกลเลอรีแต่ละรูปต้องมีขนาดไม่เกิน 5MB",
          };
        }
      }
    }
  }

  // อัปโหลดรูปปก (Cover Image)
  let coverImageUrl = "";
  if (coverImageFile && coverImageFile.size > 0) {
    const uploadedUrl = await uploadCarImage(coverImageFile, "covers");
    if (uploadedUrl) coverImageUrl = uploadedUrl;
  }

  // อัปโหลดรูปแกลเลอรี (Gallery)
  const uploadedGalleryUrls: string[] = [];
  if (galleryFiles && galleryFiles.length > 0) {
    const validFiles = galleryFiles.filter((f) => f.size > 0);
    const uploadPromises = validFiles.map((file) =>
      uploadCarImage(file, "gallery"),
    );
    const results = await Promise.all(uploadPromises);

    results.forEach((url) => {
      if (url) uploadedGalleryUrls.push(url);
    });
  }

  // URL Slug (SEO Friendly)
  const slug = `${brand}-${modelName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  // Rollback Mechanism
  try {
    // บันทึกข้อมูลรถ และรูปแกลเลอรี
    await prisma.car.create({
      data: {
        slug,
        brand,
        modelName,
        year,
        mileage,
        price,
        coverImage: coverImageUrl,
        status,
        // บันทึกรูปรอบคันลงในตาราง CarImage อัตโนมัติ
        gallery: {
          create: uploadedGalleryUrls.map((url, index) => ({
            url,
            order: index, // เก็บค่าการจัดเรียงรูปภาพตามตอนที่อัปโหลดมา
          })),
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);

    // Rollback uploaded files
    if (coverImageUrl) await deleteCarImage(coverImageUrl);
    if (uploadedGalleryUrls.length > 0)
      await deleteCarImages(uploadedGalleryUrls);

    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
    };
  }

  // ล้างแคชหน้าต่างๆ เพื่อให้แสดงข้อมูลใหม่ทันที
  revalidatePath("/admin/cars");
  revalidatePath("/");
  redirect("/admin/cars");
}

// Delete Car
export async function deleteCar(id: string) {
  // Authentication & RBAC Check
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  // ดึงข้อมูลรถและรูปรถที่ผูกไว้ เพื่อเอา URL ไปลบออกจาก Supabase Storage
  const car = await prisma.car.findUnique({
    where: { id },
    include: { gallery: true },
  });

  if (!car) {
    return { success: false, message: "หาข้อมูลรถไม่พบ" };
  }

  try {
    // ลบรถออกจาก Database
    await prisma.car.delete({
      where: { id },
    });

    // ถ้าลบใน DB สำเร็จ ค่อยลบรูปภาพ เพื่อป้องกันการเกิด Orphan Records ถ้า DB มีปัญหา
    if (car.coverImage) {
      await deleteCarImage(car.coverImage);
    }
    if (car.gallery.length > 0) {
      await deleteCarImages(car.gallery.map((img) => img.url));
    }
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "ลบข้อมูลไม่สำเร็จ" };
  }

  revalidatePath("/admin/cars");
  revalidatePath("/");
  redirect("/admin/cars");
}

// Update Car
export async function updateCar(id: string, formData: FormData) {
  // Authentication & RBAC Check
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  // Zod Validation
  const parsed = carFormSchema.safeParse({
    brand: formData.get("brand"),
    modelName: formData.get("modelName"),
    year: formData.get("year"),
    mileage: formData.get("mileage"),
    price: formData.get("price"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "ข้อมูลไม่ถูกต้อง",
      errors: parsed.error.flatten(),
    };
  }

  const { brand, modelName, year, mileage, price, status } = parsed.data;

  const coverImageFile = formData.get("coverImage") as File | null;
  const galleryFiles = formData.getAll("gallery") as File[];

  // File Upload Validation [coverImageFile, galleryFiles] (Security)
  if (coverImageFile && coverImageFile.size > 0) {
    if (!coverImageFile.type.startsWith("image/")) {
      return {
        success: false,
        message: "กรุณาเลือกไฟล์รูปภาพสำหรับหน้าปก",
      };
    }
    if (coverImageFile.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: "ไฟล์รูปปกต้องมีขนาดไม่เกิน 5MB",
      };
    }
  }

  if (galleryFiles && galleryFiles.length > 0) {
    for (const file of galleryFiles) {
      if (file.size > 0) {
        if (!file.type.startsWith("image/")) {
          return {
            success: false,
            message: "ไฟล์ในแกลเลอรีต้องเป็นรูปภาพเท่านั้น",
          };
        }
        if (file.size > 5 * 1024 * 1024) {
          return {
            success: false,
            message: "รูปภาพแกลเลอรีแต่ละรูปต้องมีขนาดไม่เกิน 5MB",
          };
        }
      }
    }
  }

  const car = await prisma.car.findUnique({
    where: { id },
    include: { gallery: true },
  });

  if (!car) return { success: false, message: "หาข้อมูลรถไม่พบ" };

  let coverImageUrl = car.coverImage;
  let newlyUploadedCoverUrl: string | null = null;

  // ถ้ามีการอัปโหลด Cover Image รูปใหม่เข้ามา อัปโหลดก่อน
  if (coverImageFile && coverImageFile.size > 0) {
    const uploadedUrl = await uploadCarImage(coverImageFile, "covers");
    if (uploadedUrl) {
      coverImageUrl = uploadedUrl;
      newlyUploadedCoverUrl = uploadedUrl;
    }
  }

  // แกลเลอรี: ในระบบเบื้องต้นจะอัปโหลด "เพิ่ม/ต่อท้าย" ของเดิม (Append)
  const newlyUploadedGalleryUrls: string[] = [];
  if (galleryFiles && galleryFiles.length > 0) {
    const validFiles = galleryFiles.filter((f) => f.size > 0);
    const uploadPromises = validFiles.map((file) =>
      uploadCarImage(file, "gallery"),
    );
    const results = await Promise.all(uploadPromises);
    results.forEach((url) => {
      if (url) newlyUploadedGalleryUrls.push(url);
    });
  }

  const slug = `${brand}-${modelName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  // Rollback Mechanism
  try {
    await prisma.car.update({
      where: { id },
      data: {
        slug,
        brand,
        modelName,
        year,
        mileage,
        price,
        coverImage: coverImageUrl,
        status,
        gallery:
          newlyUploadedGalleryUrls.length > 0
            ? {
                create: newlyUploadedGalleryUrls.map((url, index) => ({
                  url,
                  order: car.gallery.length + index,
                })),
              }
            : undefined,
      },
    });

    // ลบรูปหน้าปกเก่าทิ้ง ถ้ามีการอัปโหลดใหม่และบันทึกลง DB สำเร็จแล้ว
    if (newlyUploadedCoverUrl && car.coverImage) {
      await deleteCarImage(car.coverImage);
    }
  } catch (error) {
    console.error("Update Database Error:", error);

    // Rollback newly uploaded images
    if (newlyUploadedCoverUrl) await deleteCarImage(newlyUploadedCoverUrl);
    if (newlyUploadedGalleryUrls.length > 0)
      await deleteCarImages(newlyUploadedGalleryUrls);

    return { success: false, message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" };
  }

  revalidatePath("/admin/cars");
  revalidatePath(`/cars/${id}`);
  revalidatePath("/");
  redirect("/admin/cars");
}
