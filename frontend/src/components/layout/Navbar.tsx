import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  BookOpen, 
  Settings, 
  Menu, 
  X, 
  Mail,
  BarChart3,
  Bookmark,
} from 'lucide-react';
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
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Questions', icon: BookOpen, description: 'Browse coding challenges' },
    { path: '/progress', label: 'Progress', icon: BarChart3, description: 'Track your learning' },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark, description: 'Saved questions' },
    { path: '/contact', label: 'Contact', icon: Mail, description: 'Get in touch' },
  ];

  const logoDestination = user ? '/dashboard' : '/';

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-xl
        ${scrolled
          ? 'bg-white/90 dark:bg-black/50 border-gray-200 dark:border-white/20 shadow-lg'
          : 'bg-white/80 dark:bg-blue-950/90 border-gray-200 dark:border-white/10'
        }
        ${theme === 'dark' ? 'dark' : ''}
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <Link to={logoDestination} className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-blue-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-all duration-300 transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-blue-700 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-300 dark:group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300">
                CodePlatter
              </span>
              <span className="text-xs text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">
                Master Coding
              </span>
            </div>
          </Link>
          
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-white shadow-lg border border-blue-200 dark:border-white/20'
                        : 'text-blue-600 dark:text-white/80 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                  
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                    {item.description}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-black/80"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeToggle}
                data-theme-toggle
                style={{ transition: 'none' }}
                className="p-2 sm:p-3 text-blue-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110"
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 animate-fade-in" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 animate-fade-in" />
                )}
              </Button>
              
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                Switch to {isDark ? 'light' : 'dark'} mode
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-black/80"></div>
              </div>
            </div>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 sm:p-3 text-blue-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5 transform rotate-90 transition-transform duration-300" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hidden lg:flex items-center space-x-3 text-blue-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300 p-2 rounded-xl"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="max-w-24 truncate font-medium text-sm">{user.name}</div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 bg-white dark:bg-gray-950/95 border-gray-200 dark:border-gray-700/50 backdrop-blur-xl shadow-2xl animate-scale-in rounded-xl p-2"
                    sideOffset={8}
                  >
                    <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700 dark:text-white">{user.name}</p>
                          <p className="text-xs text-blue-600 dark:text-gray-400 truncate max-w-[180px]">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2 space-y-1">
                      <DropdownMenuItem
                        onClick={() => navigate('/profile')}
                        className="text-blue-600 dark:text-gray-300 focus:text-blue-700 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 cursor-pointer rounded-lg px-3 py-2 transition-all duration-200"
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        <div>
                          <div className="font-medium">Profile Settings</div>
                          <div className="text-xs text-gray-500">Manage your account</div>
                        </div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem
                        onClick={() => navigate('/progress')}
                        className="text-blue-600 dark:text-gray-300 focus:text-blue-700 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 cursor-pointer rounded-lg px-3 py-2 transition-all duration-200"
                      >
                        <BarChart3 className="mr-3 h-4 w-4" />
                        <div>
                          <div className="font-medium">View Progress</div>
                          <div className="text-xs text-gray-500">Track your learning</div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700/50 my-2" />
                    
                    <div className="py-2">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 dark:text-red-300 focus:text-red-700 dark:focus:text-red-200 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer rounded-lg px-3 py-2 transition-all duration-200"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <div>
                          <div className="font-medium">Sign Out</div>
                          <div className="text-xs text-gray-500">End your session</div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link to="/contact" className="hidden sm:block">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-blue-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300 transform hover:scale-105 rounded-xl px-3 py-2"
                  >
                    Contact Us
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300 transform hover:scale-105 rounded-xl px-3 py-2"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg rounded-xl px-4 py-2"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {user && mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-black/40 backdrop-blur-xl animate-slide-down rounded-b-xl mt-2 shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="flex items-center space-x-3 px-3 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-blue-700 dark:text-white text-sm">{user.name}</div>
                  <div className="text-xs text-blue-600 dark:text-gray-400">{user.email}</div>
                </div>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-white shadow-lg'
                      : 'text-blue-600 dark:text-white/80 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                  </div>
                </Link>
              ))}
              
              <hr className="my-3 border-gray-200 dark:border-white/10" />
              
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium text-blue-600 dark:text-white/80 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-200"
              >
                <Settings className="h-5 w-5" />
                <div>
                  <div>Profile Settings</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Manage your account</div>
                </div>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full space-x-3 px-3 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <div>
                  <div>Sign Out</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">End your session</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;