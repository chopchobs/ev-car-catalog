import { jwtVerify, SignJWT } from "jose";

interface SessionPayload {
  id: string;
  email: string;
  role: string;
  name?: string | null;
}

// ฟังก์ชันดึง Secret Key จากตัวแปรแวดล้อม (.env)
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

/**
 * สร้าง JWT Token (สำหรับตอน Login สำเร็จ)
 */
export async function signToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" }) // อัลกอริทึมเข้ารหัส
    .setIssuedAt() // บันทึกเวลาที่สร้าง
    .setExpirationTime("1d") // กำหนดให้บัตร (Token) ใบนี้หมดอายุใน 1 วัน
    .sign(getJwtSecretKey()); // เซ็นรับรองด้วย Secret Key ป้องกันคนปลอมแปลง
}

/**
 * ตรวจสอบและถอดรหัส JWT Token (สำหรับ Middleware ใช้ตรวจก่อนเข้าหน้า Admin)
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as unknown as SessionPayload;
  } catch (error) {
    // หาก Token หมดอายุหรือถูกปลอมแปลง จะเข้าเงื่อนไขนี้และส่งค่า null กลับไป
    return null;
  }
}
