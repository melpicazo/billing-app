import { Tab } from "@/shared/types";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tabId: Tab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const handleTabClick = (tabId: Tab) => {
    onTabChange(tabId);
  };

  return (
    <>
      {/* Mobile sidebar */}
      <MobileMenu activeTab={activeTab} onTabChange={handleTabClick} />

      {/* Desktop sidebar */}
      <DesktopMenu activeTab={activeTab} onTabChange={handleTabClick} />
    </>
  );
};
