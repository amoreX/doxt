"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Gear, SignOut } from "@phosphor-icons/react";

export default function ProfileDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/auth");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-medium hover:shadow-lg transition-shadow"
      >
        U
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 py-2 z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-800">User</p>
            <p className="text-xs text-slate-500 mt-0.5">user@example.com</p>
          </div>
          <button className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors">
            <User className="w-4 h-4 text-slate-600" weight="regular" />
            <span className="text-sm text-slate-700">Profile</span>
          </button>
          <button className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors">
            <Gear className="w-4 h-4 text-slate-600" weight="regular" />
            <span className="text-sm text-slate-700">Settings</span>
          </button>
          <div className="border-t border-slate-100 mt-2 pt-2">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors text-red-600"
            >
              <SignOut className="w-4 h-4" weight="regular" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
