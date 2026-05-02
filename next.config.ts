import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // เพิ่มขนาด limit สำหรับการอัปโหลดไฟล์
    },
  },
  images: { 
    remotePatterns: [ // อนุญาตให้แสดงรูปภาพจาก Supabase
      {
        protocol: "https",
        hostname: "qcaoytixhlkraefskrpm.supabase.co", 
      },
    ],
  },
};

export default nextConfig;
