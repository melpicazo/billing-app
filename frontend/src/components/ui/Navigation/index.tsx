import { Tab } from "@/shared/types";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tabId: Tab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <>
      {/* Mobile sidebar */}
      <MobileMenu activeTab={activeTab} onTabChange={onTabChange} />

      {/* Desktop sidebar */}
      <DesktopMenu activeTab={activeTab} onTabChange={onTabChange} />
    </>
  );
};
