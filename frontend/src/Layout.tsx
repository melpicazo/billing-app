import phrases from "./shared/phrases.json";
import { Navigation, TabLayout } from "./components";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Tab } from "./shared/types";

const TabConfig: Record<
  Tab,
  {
    title: string;
    description: string;
  }
> = {
  overview: {
    title: phrases.overview.title,
    description: phrases.overview.description,
  },
  clients: {
    title: phrases.clients.title,
    description: phrases.clients.description,
  },
  assets: {
    title: phrases.assets.title,
    description: phrases.assets.description,
  },
  settings: {
    title: phrases.settings.title,
    description: phrases.settings.description,
  },
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from URL path
  const currentTab = (location.pathname.split("/")[1] || "overview") as Tab;

  const handleTabChange = (tabId: Tab) => {
    navigate(`/${tabId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Navigation */}
      <Navigation activeTab={currentTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <TabLayout
        title={TabConfig[currentTab].title}
        description={TabConfig[currentTab].description}
      >
        <Outlet />
      </TabLayout>
    </div>
  );
}
