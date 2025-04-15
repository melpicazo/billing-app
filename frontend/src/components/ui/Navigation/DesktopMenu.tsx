import { navigationTabs } from "./navigationTabs";
import { cn } from "@/shared/utils";
import { Tab } from "@/shared/types";
interface DesktopProps {
  activeTab: Tab;
  onTabChange: (tabId: Tab) => void;
}

export const DesktopMenu = ({ activeTab, onTabChange }: DesktopProps) => {
  return (
    <div className="hidden md:flex w-[350px] flex-shrink-0 flex-col">
      <div className="flex flex-col flex-grow border-r border-gray-200 sidebar-gradient">
        {/* Logo area */}
        <div className="p-4 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-full h-full" />
        </div>

        {/* Navigation items */}
        <nav className="p-4 flex flex-col gap-3">
          {navigationTabs.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "transition-all w-full flex gap-4 items-center p-4 font-heading font-medium rounded-full",
                activeTab === item.id
                  ? "bg-blue-50 text-gray-900"
                  : "text-gray-600 hover:bg-blue-50 hover:text-gray-900"
              )}
            >
              <item.icon className="shrink-0 h-5 w-5 stroke-2" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
