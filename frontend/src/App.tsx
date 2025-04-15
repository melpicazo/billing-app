import "./App.css";
import { Overview, Clients, Settings, Assets } from "./components/tabs";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<Overview />} />
        <Route path="clients" element={<Clients />} />
        <Route path="assets" element={<Assets />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
