import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, User, LogOut, BookOpen, Settings } from 'lucide-react';
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
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl transition-all duration-300
        ${scrolled
          ? 'bg-black/30 dark:bg-black/50'
          : 'bg-blue-950/90 dark:bg-blue-950/90'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <BookOpen className="h-8 w-8 text-white group-hover:text-blue-300 transition-colors" />
            <span className="text-xl font-bold bg-white bg-clip-text text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
              CodePlatter
            </span>
          </Link>
          
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Questions
              </Link>
              <Link
                to="/progress"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/progress')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Progress
              </Link>
              <Link
                to="/bookmarks"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/bookmarks')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Bookmarks
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-white hover:text-blue-200 hover:bg-white/10 transition-all duration-200"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-white hover:text-blue-200 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:inline max-w-24 truncate">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-950/95 border-gray-700/50 backdrop-blur-xl shadow-2xl animate-in slide-in-from-top-2 duration-200"
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
                  
                  <DropdownMenuItem
                    onClick={() => navigate('/progress')}
                    className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer transition-colors duration-150 md:hidden"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Progress
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => navigate('/bookmarks')}
                    className="text-gray-300 focus:text-white focus:bg-white/10 cursor-pointer transition-colors duration-150 md:hidden"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Bookmarks
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
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-blue-200 hover:bg-white/10 transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-medium transition-all duration-200 transform hover:scale-105">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;