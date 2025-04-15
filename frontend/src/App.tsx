import { useState } from "react";
import "./App.css";
import { Navigation, TabLayout } from "./components";
import { Tab } from "./shared/types";
import { Overview, Clients, Settings, Assets } from "./tabs";
import phrases from "./shared/phrases.json";

const TabConfig: Record<
  Tab,
  {
    title: string;
    description: string;
    component: React.ReactNode;
  }
> = {
  overview: {
    title: phrases.overview.title,
    description: phrases.overview.description,
    component: <Overview />,
  },
  clients: {
    title: phrases.clients.title,
    description: phrases.clients.description,
    component: <Clients />,
  },
  assets: {
    title: phrases.assets.title,
    description: phrases.assets.description,
    component: <Assets />,
  },
  settings: {
    title: phrases.settings.title,
    description: phrases.settings.description,
    component: <Settings />,
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <TabLayout
        title={TabConfig[activeTab].title}
        description={TabConfig[activeTab].description}
      >
        {TabConfig[activeTab].component}
      </TabLayout>
    </div>
  );
}
