import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  BookOpen, 
  BarChart, 
  History 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/upload', icon: <Upload size={20} />, label: 'Upload' },
    { path: '/quiz', icon: <BookOpen size={20} />, label: 'Quiz' },
    { path: '/results', icon: <BarChart size={20} />, label: 'Results' },
    { path: '/history', icon: <History size={20} />, label: 'History' },
  ];

  return (
    <aside className="w-16 md:w-64 bg-white shadow-md">
      <div className="py-6">
        <nav className="mt-5 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 mb-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="mr-3">{item.icon}</div>
              <span className="hidden md:block">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;