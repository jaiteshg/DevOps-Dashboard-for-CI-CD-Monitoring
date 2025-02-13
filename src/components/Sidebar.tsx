import { Home, Settings, Activity } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">DevOps Dashboard</h1>
      <nav className="space-y-2">
        {[
          { id: "home", label: "Home", icon: <Home size={20} /> },
          { id: "pipelines", label: "Pipelines", icon: <Activity size={20} /> },
          { id: "settings", label: "Settings", icon: <Settings size={20} /> },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              activeTab === id ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setActiveTab(id)}
          >
            {icon} {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
