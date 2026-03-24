import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-auto" />
      </div>
    </div>
  );
}

export default App;