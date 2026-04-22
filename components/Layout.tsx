
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, FileCheck, Settings, Bell, UserCircle, Building, Layers, Home } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col flex-shrink-0 transition-colors duration-300">
        <div className="p-6 border-b border-gray-700">
          <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Database className="text-primary" />
            <span>Master Data</span>
          </div>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Legal Entity Module</div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Management
          </div>
          <NavLink 
            to="/entities" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`
            }
          >
            <Database size={18} />
            Legal Entities
          </NavLink>
          <NavLink 
            to="/projects" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`
            }
          >
            <Building size={18} />
            Projects
          </NavLink>
          <NavLink 
            to="/units" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`
            }
          >
            <Home size={18} />
            Units
          </NavLink>
          <NavLink 
            to="/compliance" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`
            }
          >
            <FileCheck size={18} />
            Approvals
          </NavLink>
           <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Configuration
          </div>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`
            }
          >
            <Settings size={18} />
            Unit Metadata
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-700">
             <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                <UserCircle className="text-gray-400" size={32} />
                <div className="overflow-hidden">
                    <div className="text-sm font-medium text-white truncate">Admin User</div>
                    <div className="text-xs text-gray-400 truncate">Legal Dept.</div>
                </div>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
          <h2 className="text-sm font-medium text-gray-500">Corporate &gt; Legal Entity Management</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary/5 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};
