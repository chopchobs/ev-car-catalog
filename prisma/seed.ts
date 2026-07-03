import "dotenv/config";
import { PrismaClient } from "@prisma/client/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// สร้าง Prisma Client แบบ stand-alone สำหรับสคริปต์ seed (ไม่ผ่าน lib/prisma ที่ผูก server-only)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ใช้ bcrypt แฮชรหัสผ่านเริ่มต้นของ Admin คนแรก
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  // กันสร้างซ้ำหากมี Admin คนนี้อยู่แล้ว
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@evauto.com" },
  });

  if (existingAdmin) {
    console.log("Admin already exists — skipping seed.");
    return;
  }

  const newAdmin = await prisma.user.create({
    data: {
      email: "admin@evauto.com",
      password: hashedPassword,
      name: "Super Admin",
      role: "ADMIN",
    },
  });

  console.log(`Seeded first admin user: ${newAdmin.email}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
