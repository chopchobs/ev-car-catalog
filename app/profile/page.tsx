import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileForm from "@/components/ui/ProfileForm";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  
  if (!token) {
    redirect("/login");
  }

  const session = await verifyToken(token);
  if (!session) {
    redirect("/login");
  }

  // ดึงข้อมูล User จาก Database ให้สดใหม่เสมอ
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, role: true }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
           
           <div className="mb-8">
             <h1 className="text-3xl font-black text-gray-900 tracking-tight">ตั้งค่าบัญชีส่วนตัว</h1>
             <p className="text-gray-500 font-medium mt-1">อัปเดตข้อมูลส่วนตัวของคุณและรหัสผ่านเพื่อความปลอดภัย</p>
           </div>

           {/* ฟอร์มแก้ไขข้อมูลซึ่งเป็น Client Component */}
           <ProfileForm initialName={user.name || ""} email={user.email} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
