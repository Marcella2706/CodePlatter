import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, User, LogOut, BookOpen, Settings, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    // Provide visual feedback
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.classList.add('animate-bounce-gentle');
      setTimeout(() => button.classList.remove('animate-bounce-gentle'), 600);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Questions', icon: BookOpen },
    { path: '/progress', label: 'Progress', icon: BookOpen },
    { path: '/bookmarks', label: 'Bookmarks', icon: BookOpen },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-xl
        ${scrolled
          ? 'bg-black/30 dark:bg-black/50 border-white/20'
          : 'bg-blue-950/90 dark:bg-gray-900/90 border-white/10'
        }
        ${theme === 'dark' ? 'dark' : ''}
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <BookOpen className="h-8 w-8 text-white group-hover:text-blue-300 transition-colors duration-300" />
            <span className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300">
              CodePlatter
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThemeToggle}
              data-theme-toggle
              className="text-white hover:text-blue-200 hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="h-4 w-4 animate-fade-in" />
              ) : (
                <Moon className="h-4 w-4 animate-fade-in" />
              )}
            </Button>

            {user ? (
              <>
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-white hover:text-blue-200 hover:bg-white/10 transition-all duration-200"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>

                {/* Desktop User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hidden md:flex items-center space-x-2 text-white hover:text-blue-200 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-glow">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="max-w-24 truncate">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-gray-950/95 border-gray-700/50 backdrop-blur-xl shadow-2xl animate-scale-in"
                    sideOffset={5}
                  >
                    <div className="px-3 py-2 border-b border-gray-700/50">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    
                    <DropdownMenuItem
                      onClick={() => navigate('/profile')}
                      className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer transition-colors duration-150"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-gray-700/50" />
                    
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-300 focus:text-red-200 focus:bg-red-900/20 cursor-pointer transition-colors duration-150"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-blue-200 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/20 backdrop-blur-xl animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              
              <hr className="my-2 border-white/10" />
              
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Settings className="mr-3 h-5 w-5" />
                Profile Settings
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-300 hover:text-red-200 hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;