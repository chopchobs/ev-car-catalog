"use server"; // <-- คำสั่งศักดิ์สิทธิ์ บังคับรันบน Server เท่านั้น!

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase Client สำหรับอัปโหลดรูปด้วย ANON KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function addCar(formData: FormData) {
  // 1. ดึงข้อมูลตัวอักษรจากฟอร์ม
  const brand = formData.get("brand") as string;
  const modelName = formData.get("modelName") as string;
  const year = Number(formData.get("year"));
  const mileage = Number(formData.get("mileage"));
  const price = Number(formData.get("price"));
  const status = formData.get("status") as "AVAILABLE" | "BOOKED" | "SOLD";

  // ดึงข้อมูล *ไฟล์* ออกจากฟอร์ม
  const coverImageFile = formData.get("coverImage") as File | null;
  const galleryFiles = formData.getAll("gallery") as File[];

  // 2. ฟังก์ชันช่วยอัปโหลดไฟล์ไปที่ Supabase Storage
  const uploadImage = async (file: File, folder: string) => {
    if (!file || file.size === 0) return null;

    // สร้างชื่อไฟล์ใหม่ให้ไม่มีช่องว่าง หรือชื่อซ้ำ
    const extension = file.name.split(".").pop();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    const filePath = `${folder}/${uniqueName}`;

    // สั่งอัปโหลดไฟล์เข้า Bucket "car-images"
    const { data, error } = await supabase.storage
      .from("car-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(
        "อัปโหลดรูปภาพไม่สำเร็จ กรุณาตรวจสอบว่าสร้าง Bucket (car-images) เป็น Public แล้ว",
      );
    }

    // ดึง Public URL ของไฟล์นั้นออกมา
    const { data: publicUrlData } = supabase.storage
      .from("car-images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  // 3. อัปโหลดรูปปก (Cover Image)
  let coverImageUrl = "";
  if (coverImageFile && coverImageFile.size > 0) {
    const uploadedUrl = await uploadImage(coverImageFile, "covers");
    if (uploadedUrl) coverImageUrl = uploadedUrl;
  }

  // 4. อัปโหลดรูปแกลเลอรี (Gallery) แบบ Upload พร้อมกันหลายรูปให้ประหยัดเวลา
  const uploadedGalleryUrls: string[] = [];
  if (galleryFiles && galleryFiles.length > 0) {
    // กรองเอาเฉพาะไฟล์ที่มีขนาดมากกว่า 0 (คือมีไฟล์เข้ามาจริงๆ)
    const validFiles = galleryFiles.filter((f) => f.size > 0);
    const uploadPromises = validFiles.map((file) =>
      uploadImage(file, "gallery"),
    );
    const results = await Promise.all(uploadPromises);

    results.forEach((url) => {
      if (url) uploadedGalleryUrls.push(url);
    });
  }

  // 5. การสร้าง slug อัตโนมัติ
  const slugText = `${brand}-${modelName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const slug = `${slugText}-${Date.now()}`;

  // 6. สั่ง Prisma บันทึกข้อมูลรถ และรูปแกลเลอรีทั้งหมดพร้อมกัน (Nested Write)
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
      // บันทึกลิงก์รูปรอบคันลงในตาราง CarImage อัตโนมัติ (1-to-Many)
      gallery: {
        create: uploadedGalleryUrls.map((url, index) => ({
          url,
          order: index, // เก็บค่าการจัดเรียงรูปภาพตามตอนที่อัปโหลดมา
        })),
      },
    },
  });

  // 7. ล้างแคชหน้าต่างๆ เพื่อให้แสดงข้อมูลใหม่ทันที
  revalidatePath("/admin/cars");
  revalidatePath("/");
  redirect("/admin/cars");
}

export async function deleteCar(id: string) {
  // ดึงข้อมูลรถและรูปรถที่ผูกไว้ เพื่อเอา URL ไปลบออกจาก Supabase Storage
  const car = await prisma.car.findUnique({
    where: { id },
    include: { gallery: true },
  });

  if (!car) {
    throw new Error("หาข้อมูลรถไม่พบ");
  }

  // ดึงชื่อไฟล์จาก URL (หลังคำว่า car-images/)
  const getPathFromUrl = (url: string) => {
    if (!url) return null;
    const parts = url.split("car-images/");
    return parts.length > 1 ? parts[1] : null;
  };

  const filesToDelete: string[] = [];

  if (car.coverImage) {
    const p = getPathFromUrl(car.coverImage);
    if (p) filesToDelete.push(p);
  }

  car.gallery.forEach((img) => {
    const p = getPathFromUrl(img.url);
    if (p) filesToDelete.push(p);
  });

  if (filesToDelete.length > 0) {
    const { error } = await supabase.storage
      .from("car-images")
      .remove(filesToDelete);
    if (error) {
      console.error("Failed to delete images from Supabase Storage:", error);
      // ไม่หยุดทำงาน ให้ลบข้อมูลใน DB ต่อเลยเผื่อ Storage ลบไม่ได้จริงๆ จะได้ขยะไม่ค้างในเว็บ
    }
  }

  // ลบรถออกจาก Database (ตาราง gallery จะถูกลบออโต้ ถ้าตั้ง M:N onDelete: Cascade ไว้)
  await prisma.car.delete({
    where: { id },
  });

  revalidatePath("/admin/cars");
  revalidatePath("/");
}

export async function updateCar(id: string, formData: FormData) {
  const brand = formData.get("brand") as string;
  const modelName = formData.get("modelName") as string;
  const year = Number(formData.get("year"));
  const mileage = Number(formData.get("mileage"));
  const price = Number(formData.get("price"));
  const status = formData.get("status") as "AVAILABLE" | "BOOKED" | "SOLD";

  const coverImageFile = formData.get("coverImage") as File | null;
  const galleryFiles = formData.getAll("gallery") as File[];

  const car = await prisma.car.findUnique({
    where: { id },
    include: { gallery: true },
  });

  if (!car) throw new Error("หาข้อมูลรถไม่พบ");

  const getPathFromUrl = (url: string) => {
    if (!url) return null;
    const parts = url.split("car-images/");
    return parts.length > 1 ? parts[1] : null;
  };

  const uploadImage = async (file: File, folder: string) => {
    if (!file || file.size === 0) return null;
    const extension = file.name.split(".").pop();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    const filePath = `${folder}/${uniqueName}`;
    const { error } = await supabase.storage
      .from("car-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (error) {
      console.error("Upload error:", error);
      throw new Error("อัปโหลดรูปภาพไม่สำเร็จ");
    }
    const { data: publicUrlData } = supabase.storage
      .from("car-images")
      .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  let coverImageUrl = car.coverImage;

  // ถ้ามีการอัปโหลด Cover Image รูปใหม่เข้ามา ลบของเก่าทิ้งและอัปโหลดอันใหม่แทน
  if (coverImageFile && coverImageFile.size > 0) {
    if (car.coverImage) {
      const oldPath = getPathFromUrl(car.coverImage);
      if (oldPath) await supabase.storage.from("car-images").remove([oldPath]);
    }
    const uploadedUrl = await uploadImage(coverImageFile, "covers");
    if (uploadedUrl) coverImageUrl = uploadedUrl;
  }

  // แกลเลอรี: ในระบบเบื้องต้นจะอัปโหลด "เพิ่ม/ต่อท้าย" ของเดิม (Append)
  const uploadedGalleryUrls: string[] = [];
  if (galleryFiles && galleryFiles.length > 0) {
    const validFiles = galleryFiles.filter((f) => f.size > 0);
    const uploadPromises = validFiles.map((file) =>
      uploadImage(file, "gallery"),
    );
    const results = await Promise.all(uploadPromises);
    results.forEach((url) => {
      if (url) uploadedGalleryUrls.push(url);
    });
  }

  const slugText = `${brand}-${modelName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const slug = `${slugText}-${Date.now()}`;

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
      // บันทึกลิงก์รูปรอบคันลงในตาราง CarImage อัตโนมัติ โดยให้ order เรียงต่อจากของเดิม
      gallery:
        uploadedGalleryUrls.length > 0
          ? {
              create: uploadedGalleryUrls.map((url, index) => ({
                url,
                order: car.gallery.length + index,
              })),
            }
          : undefined,
    },
  });

  revalidatePath("/admin/cars");
  revalidatePath(`/cars/${id}`);
  revalidatePath("/");
  redirect("/admin/cars");
}
