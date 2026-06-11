import React from "react";
import { 
  Home, BookOpen, MessageSquare, Briefcase, User, Settings, 
  ChevronLeft, ChevronRight, LogOut, Flame, Sparkles, Award
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  streak: number;
  userName: string;
  userAvatar: string;
  onLogout: () => void;
}

export default function Sidebar({ 
  currentView, onNavigate, collapsed, setCollapsed, streak, userName, userAvatar, onLogout 
}: SidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, color: "text-cyan-400 group-hover:text-cyan-300" },
    { id: "playlists-library", label: "Course Library", icon: BookOpen, color: "text-indigo-400 group-hover:text-indigo-300" },
    { id: "chat", label: "Community Chat", icon: MessageSquare, color: "text-pink-400 group-hover:text-pink-300", notify: true },
    { id: "jobs", label: "Job Apply", icon: Briefcase, color: "text-amber-400 group-hover:text-amber-300" },
    { id: "internships", label: "Internships", icon: Award, color: "text-rose-400 group-hover:text-rose-300" },
    { id: "profile", label: "Student Profile", icon: User, color: "text-emerald-400 group-hover:text-emerald-300" },
    { id: "admin", label: "Admin Panel", icon: Settings, color: "text-slate-400 group-hover:text-slate-300" },
  ];

  return (
    <aside 
      className={`glass-panel border-r border-white/5 flex flex-col justify-between transition-all duration-300 z-40 h-[calc(100vh-60px)] sticky top-[60px] shrink-0 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col gap-6 pt-4">
        {/* Toggle Collapse Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-4 bg-slate-900 border border-white/10 hover:border-cyan-500 rounded-full p-1 text-slate-400 hover:text-white cursor-pointer z-50 transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        {/* User Mini Profile Brief */}
        <div className={`px-4 flex items-center gap-3 border-b border-white/5 pb-5 overflow-hidden ${collapsed ? "justify-center" : ""}`}>
          <div className="relative shrink-0 select-none">
            <img 
              src={userAvatar} 
              alt={userName} 
              className="w-9 h-9 rounded-full bg-slate-950 border border-cyan-500/30 shadow-lg shadow-cyan-500/10" 
            />
            {/* Online Indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#0b0b14] rounded-full"></span>
          </div>

          {!collapsed && (
            <div className="text-left truncate">
              <h4 className="text-xs font-semibold text-white tracking-wide truncate">{userName}</h4>
              <p className="text-[10px] text-[#06b6d4] font-mono tracking-wider flex items-center gap-1 mt-0.5">
                <Flame className="h-3 w-3 text-orange-500 fill-current shrink-0" />
                {streak} Day Streak
              </p>
            </div>
          )}
        </div>

        {/* Main Side Menu */}
        <nav className="flex flex-col gap-1 px-2.5 w-full">
          {menuItems.map((item) => {
            const isActive = currentView === item.id || (item.id === "playlists-library" && currentView === "playlist-watching");
            const IconComp = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full group flex items-center rounded-xl p-3 text-left font-medium transition-all text-xs cursor-pointer gap-3.5 ${
                  isActive 
                    ? "bg-slate-900/60 text-white border-l-2 border-cyan-500 font-semibold" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40"
                }`}
                title={collapsed ? item.label : ""}
              >
                <IconComp className={`h-4.5 w-4.5 shrink-0 ${item.color} ${isActive ? "text-cyan-400" : ""}`} />
                
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {!collapsed && item.notify && (
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout triggers */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={onLogout}
          className={`w-full flex items-center rounded-xl p-3 text-left font-medium text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all cursor-pointer gap-3.5 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Log Out Account" : ""}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0 text-red-500" />
          {!collapsed && <span>Log Out Access</span>}
        </button>
      </div>
    </aside>
  );
}
