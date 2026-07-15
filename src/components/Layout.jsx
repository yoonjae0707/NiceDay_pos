import React, { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Store, Receipt, Settings, Sun, Moon } from 'lucide-react';
import { useStore } from '../store';

const Layout = () => {
  const { theme, toggleTheme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <Store size={28} />
          NiceDay POS
        </div>
        
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Store size={20} />
            POS 매장
          </NavLink>
          <NavLink to="/sales" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Receipt size={20} />
            매출 기록
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            환경 설정
          </NavLink>
        </nav>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          {theme === 'light' ? '다크 모드' : '라이트 모드'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
