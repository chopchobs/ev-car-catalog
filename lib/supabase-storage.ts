import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Upload Image
export async function uploadCarImage(
  file: File,
  folder: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  // สร้างชื่อไฟล์ใหม่แบบปลอดภัย ไม่ซ้ำด้วย UUID
  const extension = file.name.split(".").pop();
  const uniqueName = `${crypto.randomUUID()}.${extension}`;
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
}

// Delete Image
export async function deleteCarImage(url: string | null): Promise<void> {
  if (!url) return;
  const parts = url.split("car-images/");
  const path = parts.length > 1 ? parts[1] : null;

  if (path) {
    const { error } = await supabase.storage.from("car-images").remove([path]);
    if (error) {
      console.error("ลบรูปภาพไม่สำเร็จ:", error);
    }
  }
}

// Delete Multiple Images
export async function deleteCarImages(urls: string[]): Promise<void> {
  if (!urls || urls.length === 0) return;

  const filesToDelete: string[] = [];
  urls.forEach((url) => {
    if (!url) return;
    const parts = url.split("car-images/");
    const path = parts.length > 1 ? parts[1] : null;
    if (path) filesToDelete.push(path);
  });

  if (filesToDelete.length > 0) {
    const { error } = await supabase.storage
      .from("car-images")
      .remove(filesToDelete);
    if (error) {
      console.error("ลบรูปภาพไม่สำเร็จ:", error);
    }
  }
}
