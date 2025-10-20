import { List } from "@phosphor-icons/react";
import ProfileDropdown from "./ProfileDropdown";
import { HeaderProps } from "@/types/dashboard";

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="  backdrop-blur-md">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <List className="w-5 h-5 text-slate-600" weight="bold" />
          </button>
          <h1 className="text-2xl font-light tracking-tight text-slate-800">
            Doxt
          </h1>
        </div>

        <ProfileDropdown />
      </div>
    </header>
  );
}
