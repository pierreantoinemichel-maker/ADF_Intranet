"use client";

import { Bell, Search } from "lucide-react";

interface TopBarProps {
  title: string;
  userEmail?: string;
}

export default function TopBar({ title, userEmail }: TopBarProps) {
  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold" style={{ color: "var(--adf-navy)" }}>
        {title}
      </h1>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Search size={20} />
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
          <Bell size={20} />
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
            style={{ backgroundColor: "var(--adf-gold)" }}
          >
            2
          </span>
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: "var(--adf-navy)" }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
