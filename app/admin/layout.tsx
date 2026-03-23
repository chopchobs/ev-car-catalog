import Sidebar from '@/components/common/admin/Sidebar';
import AdminNavbar from '@/components/common/admin/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
        
      </div>
      
    </div>
  );
}