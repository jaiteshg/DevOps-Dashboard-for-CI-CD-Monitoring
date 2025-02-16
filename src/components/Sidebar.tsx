import { useContext } from "react";
import { Moon, Sun, Home, Activity, Settings } from "lucide-react";
import { ThemeContext } from "./ThemeContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const theme = useContext(ThemeContext);

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 p-6 shadow-md flex flex-col justify-between h-screen">
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        🚀 DevOps Dashboard
      </h1>

      {/* Navigation */}
      <nav className="space-y-4">
        <button
          className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${
            activeTab === "home" ? "bg-blue-500 text-white" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("home")}
        >
          <Home size={20} /> Home
        </button>

        <button
          className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${
            activeTab === "pipelines" ? "bg-blue-500 text-white" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("pipelines")}
        >
          <Activity size={20} /> Pipelines
        </button>

        <button
          className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${
            activeTab === "settings" ? "bg-blue-500 text-white" : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings size={20} /> Settings
        </button>
      </nav>

      {/* Dark Mode Toggle */}
      <button
        className="flex items-center gap-3 p-3 w-full text-left bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
        onClick={theme?.toggleDarkMode}
      >
        {theme?.darkMode ? <Sun size={20} /> : <Moon size={20} />} Toggle Theme
      </button>
    </aside>
  );
}
