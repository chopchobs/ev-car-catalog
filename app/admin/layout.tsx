import Sidebar from '@/components/common/admin/Sidebar';
import AdminNavbar from '@/components/common/admin/Navbar';
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  
  if (!token) redirect("/login");
  
  const user = await verifyToken(token);
  if (!user || user.role !== 'ADMIN') redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar user={user} />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminNavbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
        
      </div>
      
    </div>
  );
}