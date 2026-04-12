import { useContext, useState } from "react";
import { Moon, Sun, Home, Activity, Settings, Menu } from "lucide-react";
import { ThemeContext } from "./ThemeContext";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const theme = useContext(ThemeContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 240 }}
      className="bg-white dark:bg-gray-900 p-4 shadow-md flex flex-col h-screen"
    >
      {/* Toggle */}
      <button
        className="mb-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      {!isCollapsed && (
        <h1 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          🚀 DevOps
        </h1>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {[
          { name: "Home", icon: Home, id: "home" },
          { name: "Pipelines", icon: Activity, id: "pipelines" },
          { name: "Settings", icon: Settings, id: "settings" },
        ].map(({ name, icon: Icon, id }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 p-3 w-full rounded-lg transition ${
              activeTab === id
                ? "bg-blue-500 text-white"
                : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Icon size={20} />
            {!isCollapsed && name}
          </button>
        ))}
      </nav>

      {/* Theme Toggle */}
      <button
        onClick={theme?.toggleDarkMode}
        className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-gray-200 dark:bg-gray-700"
      >
        {theme?.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        {!isCollapsed && "Theme"}
      </button>
    </motion.aside>
  );
}