import { Xmark, Menu } from "iconoir-react";
import { navigationTabs } from "./navigationTabs";
import { useState } from "react";
import { cn } from "@/shared/utils";
import { Tab } from "@/shared/types";

interface MobileMenuProps {
  activeTab: Tab;
  onTabChange: (tabId: Tab) => void;
}

export const MobileMenu = ({ activeTab, onTabChange }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tabId: Tab) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden relative">
      {/* Mobile menu top bar */}
      <div className="bg-white border-b w-full">
        <div className="p-4 flex justify-between items-center">
          <img src="/favicon.png" alt="Logo" className="w-10 h-10 shrink-0" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "text-gray-500 hover:text-gray-600 transition-all duration-200",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          >
            {isOpen ? (
              <Xmark className="w-5 h-5 shrink-0" />
            ) : (
              <Menu className="w-5 h-5 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={cn(
          "absolute top-full left-0 w-full bg-white border-r shadow-lg z-50",
          "transition-all duration-200",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="py-4 flex flex-col gap-4">
          {navigationTabs.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "w-full flex gap-4 items-center p-4 text-sm",
                activeTab === item.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="shrink-0 h-5 w-5" />
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
