import { getInquiries, markAsRead } from "@/app/action/inquiry";

export default async function InquiriesPage() {
  const result = await getInquiries();

  if (result.error) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-red-100 mt-6">
        <p className="text-red-500 font-bold">{result.error}</p>
      </div>
    );
  }

  const inquiries = result.inquiries || [];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header section */}
      <div className="mb-8 bg-white p-6 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">ข้อความติดต่อ & นัดหมาย</h1>
          <p className="text-gray-500 font-medium mt-2">
            รายการข้อความจากลูกค้าที่ติดต่อเข้ามาทางหน้าเว็บไซต์
          </p>
        </div>
        <div className="bg-blue-50 px-5 py-3 rounded-xl border border-blue-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xl">{inquiries.filter((i) => i.status === "UNREAD").length}</span>
          </div>
          <span className="text-blue-800 font-semibold">ข้อความใหม่ยังไม่ได้อ่าน</span>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-auto p-2">
          {inquiries.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider rounded-tl-xl whitespace-nowrap">
                    วันที่ส่ง
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    ชื่อลูกค้า
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    ข้อมูลติดต่อ
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    ข้อความ
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    สถานะ
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider rounded-tr-xl text-right">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inquiry) => (
                  <tr 
                    key={inquiry.id} 
                    className={`hover:bg-blue-50/30 transition-colors ${inquiry.status === "UNREAD" ? "bg-amber-50/20" : ""}`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(inquiry.createdAt).toLocaleDateString("th-TH")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        {new Date(inquiry.createdAt).toLocaleTimeString("th-TH")}
                      </p>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${inquiry.status === "UNREAD" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                          {inquiry.firstName[0]}
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {inquiry.firstName} {inquiry.lastName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
                        <span className="text-gray-400">📧</span> {inquiry.email}
                      </p>
                      {inquiry.phone && (
                        <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                          <span className="text-gray-400">📱</span> {inquiry.phone}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-5 min-w-[300px]">
                      {inquiry.subject && (
                        <p className="text-sm font-bold text-gray-900 mb-1">เรื่อง: {inquiry.subject}</p>
                      )}
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-2">
                        {inquiry.message}
                      </p>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      {inquiry.status === "UNREAD" ? (
                        <span className="inline-flex items-center bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                          🔴 ยังไม่อ่าน
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                          ✅ อ่านแล้ว
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      {inquiry.status === "UNREAD" && (
                        <form action={async () => {
                          "use server";
                          await markAsRead(inquiry.id);
                        }}>
                          <button 
                            type="submit"
                            className="bg-gray-900 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors shadow-sm"
                          >
                            รับทราบ
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📭</span>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">ไม่มีความเคลื่อนไหว</p>
              <p className="text-gray-500">ขณะนี้ยังไม่มีข้อความติดต่อจากลูกค้า</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
