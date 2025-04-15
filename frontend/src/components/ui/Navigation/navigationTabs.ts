import { HomeSimpleDoor, Group, Settings, DollarCircle } from "iconoir-react";
import { Tab } from "@/shared/types";

interface NavigationTab {
  id: Tab;
  name: string;
  icon: React.ElementType;
}

export const navigationTabs: NavigationTab[] = [
  { name: "Overview", id: "overview", icon: HomeSimpleDoor },
  { name: "Clients", id: "clients", icon: Group },
  { name: "Assets", id: "assets", icon: DollarCircle },
  { name: "Settings", id: "settings", icon: Settings },
];
