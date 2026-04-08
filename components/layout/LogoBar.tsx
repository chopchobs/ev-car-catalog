// คอมโพเนนต์ LogoBar ที่ปรับแก้
export default function LogoBar() {
  // สร้าง Array เก็บข้อมูลโลโก้เพื่อให้โค้ดสะอาดขึ้น (Path ตรงตามที่คุณใช้)
  const brandLogos = [
    { id: 'AUDI', src: '/Logo/AUDi.png' },
    { id: 'BYD', src: '/Logo/BYD.png' },
    { id: 'MG', src: '/Logo/MG.png' },
    { id: 'ORA', src: '/Logo/ORA.png' },
    { id: 'VOLVO', src: '/Logo/VOLVO.png' },
    { id: 'CHANGAN', src: '/Logo/CHANGAN.png' },
    { id: 'NETA', src: '/Logo/NETA.png' },
    { id: 'TESLA', src: '/Logo/TESLA.png' },
  ];

  return (
    // container คลุมยังคง Class CSS สำหรับการจัดวางเหมือนเดิม แต่เอาเอฟเฟกต์ซีดออก
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
      {brandLogos.map((brand) => (
        <img
          key={brand.id}
          src={brand.src}
          alt={`${brand.id} logo`}
          // ย้ายเอฟเฟกต์มาที่นี่: ซีด(opacity-60), สีเทา(grayscale)
          // เพิ่มเอฟเฟกต์ hover: มีสี(grayscale-0), ทึบ(opacity-100), สว่างขึ้น(brightness-110)
          className="h-16 w-auto object-contain transition-all duration-300 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:brightness-150"
        />
      ))}
    </div>
  );
}