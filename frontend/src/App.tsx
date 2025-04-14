import { useState } from "react";
import "./App.css";
import { Navigation } from "./components";
import { Tab } from "./shared/types";
import { Overview, Clients } from "./tabs";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "clients":
        return <Clients />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}
