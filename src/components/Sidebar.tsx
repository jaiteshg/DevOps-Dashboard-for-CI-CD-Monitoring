import { useContext, useState } from "react";
import { Moon, Sun, Home, Activity, Settings, Menu, X } from "lucide-react";
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
      initial={{ width: isCollapsed ? 80 : 260 }} // 🔹 Animated Sidebar Width
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white dark:bg-gray-900 p-4 shadow-md flex flex-col h-screen overflow-hidden"
    >
      {/* 🔹 Sidebar Toggle Button */}
      <button
        className="self-end p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      {/* 🔹 Logo & Title */}
      {!isCollapsed && (
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center"
        >
          🚀 DevOps Dashboard
        </motion.h1>
      )}

      {/* 🔹 Navigation */}
      <nav className="flex-1 space-y-4">
        {[
          { name: "Home", icon: Home, id: "home" },
          { name: "Pipelines", icon: Activity, id: "pipelines" },
          { name: "Settings", icon: Settings, id: "settings" },
        ].map(({ name, icon: Icon, id }) => (
          <motion.button
            key={id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${
              activeTab === id
                ? "bg-blue-500 text-white"
                : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={20} />
            {!isCollapsed && name}
          </motion.button>
        ))}
      </nav>

      {/* Dark Mode Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 p-3 w-full text-left bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
        onClick={theme?.toggleDarkMode}
      >
        {theme?.darkMode ? <Sun size={20} /> : <Moon size={20} />} {!isCollapsed && "Toggle Theme"}
      </motion.button>
      
    </motion.aside>
  );
}
