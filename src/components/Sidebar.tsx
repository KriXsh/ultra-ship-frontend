import React, { useState } from 'react';
import { 
  Users, 
  Home, 
  Settings, 
  LogOut, 
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { 
      id: 'employees', 
      label: 'Employees', 
      icon: Users,
      subItems: [
        { id: 'all-employees', label: 'All Employees' },
        { id: 'add-employee', label: 'Add Employee' }
      ]
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      subItems: [
        { id: 'profile', label: 'Profile' },
        { id: 'preferences', label: 'Preferences' }
      ]
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>Employee Portal</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div key={item.id} className="nav-item">
              <button 
                className="nav-link"
                onClick={() => item.subItems && toggleMenu(item.id)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {item.subItems && (
                  expandedMenus.includes(item.id) ? 
                    <ChevronDown size={16} /> : 
                    <ChevronRight size={16} />
                )}
              </button>
              
              {item.subItems && expandedMenus.includes(item.id) && (
                <div className="sub-menu">
                  {item.subItems.map((subItem) => (
                    <button key={subItem.id} className="sub-nav-link">
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;