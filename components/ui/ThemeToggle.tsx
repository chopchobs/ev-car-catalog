"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // ป้องกัน Hydration Mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse border border-transparent"></div>;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      aria-label="Toggle Dark Mode"
    >
      {/* Sun Icon (แสดงตอนเป็นโหมดมืด) */}
      <svg
        className={`w-5 h-5 absolute transition-all duration-300 ${
          theme === "dark" ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>

      {/* Moon Icon (แสดงตอนเป็นโหมดสว่าง) */}
      <svg
        className={`w-5 h-5 absolute transition-all duration-300 ${
          theme === "dark" ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  );
}
