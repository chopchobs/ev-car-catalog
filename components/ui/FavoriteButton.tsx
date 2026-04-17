"use client";

import { useTransition, useState } from "react";
import { toggleFavorite } from "@/app/action/favorite";
import { useRouter } from "next/navigation";

export default function FavoriteButton({
  carId,
  initialIsFavorite = false,
}: {
  carId: string;
  initialIsFavorite?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent triggering any parent Link component

    // Optimistic Update: Switch UI first before server response
    const previousState = isFavorite;
    setIsFavorite(!isFavorite);

    startTransition(async () => {
      const result = await toggleFavorite(carId);

      if (result.error) {
        // Revert on error
        setIsFavorite(previousState);
        alert(result.error);
        if (result.error.includes("เข้าสู่ระบบ")) {
          router.push("/login");
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`absolute top-3 left-3 z-30 p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-110 active:scale-90 ${
        isFavorite
          ? "bg-white/90 text-red-500 hover:bg-white"
          : "bg-black/20 text-white hover:bg-black/40"
      }`}
      aria-label="Toggle favorite"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isFavorite ? "0" : "2"}
        className="w-5 h-5 drop-shadow-sm"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
