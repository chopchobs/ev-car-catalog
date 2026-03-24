import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  // ดึง Path ที่ผู้ใช้พยายามจะเข้าถึง (เช่น "/admin/cars")
  const { pathname } = request.nextUrl;

  // กฎข้อที่ 1: ถ้าผู้ใช้พยายามเข้าโฟลเดอร์ /admin ยามจะทำงานทันที
  if (pathname.startsWith('/admin')) {
    
    // ขอดูบัตร (ดึงคุกกี้ที่บันทึกไว้ตอน Login สำเร็จ)
    const token = request.cookies.get('session')?.value;

    // ถ้าไม่มีบัตรเลย (แอบเข้าตรงๆ ไม่ผ่านหน้าล็อคอิน) => ย้อนกลับไปหน้า /login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ถ้ามีบัตร ให้เอาเข้าเครื่องสแกน
    const verifiedToken = await verifyToken(token);
    
    // กฎพิเศษ: ถ้าเข้าหน้า Admin ต้องเป็นบัตรที่ role === 'ADMIN' เท่านั้น!
    if (!verifiedToken || verifiedToken.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ถ้าผ่านหมด ยินดีต้อนรับเข้าสูประตูลับ /admin อย่างปลอดภัย!
    return NextResponse.next();
  }

  // สำหรับหน้าอื่นๆ (เช่น หน้าแคตตาล็อก หน้าแรก) ปล่อยให้เดินผ่านฉลุย
  return NextResponse.next();
}

// กำหนดขอบเขตให้ยามคนนี้เฝ้าเฉพาะเส้นทางที่กำหนด (ช่วยประหยัดทรัพยากรเซิร์ฟเวอร์มหาศาล)
// ถ้าไม่ใส่ config นี้ ยามจะวิ่งสแกนภาพและสคริปต์ทุกครั้ง ทำให้เว็บหน่วงได้ครับ
export const config = {
  matcher: [
    /*
     * สแกนทุกหน้า ยอมเว้นจำพวกหน้าไฟล์จัดการระบบ (api, _next, รูปภาพต่างๆ)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
