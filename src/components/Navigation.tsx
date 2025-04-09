
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Egg,
  Calendar,
  Package,
  Syringe,
  ShoppingCart,
  Menu,
  X
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const links = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Batches', path: '/batches', icon: <Users className="h-5 w-5" /> },
    { name: 'Egg Collection', path: '/egg-collection', icon: <Egg className="h-5 w-5" /> },
    { name: 'Feed Management', path: '/feed-management', icon: <Package className="h-5 w-5" /> },
    { name: 'Vaccination', path: '/vaccination', icon: <Syringe className="h-5 w-5" /> },
    { name: 'Sales', path: '/sales', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'Customers', path: '/customers', icon: <Users className="h-5 w-5" /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-20 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-primary mb-6">Lusoi Farm</h1>
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm rounded-md hover:bg-gray-100 ${
                  isActive(link.path)
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'text-gray-700'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
