import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, User, LogOut, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
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

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl transition-all duration-300
        ${scrolled
          ? 'bg-black/20 dark:bg-black/40'
          : 'bg-blue-800/80 dark:bg-blue-900/80'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-xl font-bold bg-white bg-clip-text text-transparent">
              CodePlatter
            </span>
          </Link>
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Questions
              </Link>
              <Link
                to="/progress"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Progress
              </Link>
              <Link
                to="/bookmarks"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Bookmarks
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-white hover:text-gray-200 hover:bg-white/10"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-white hover:text-gray-200 hover:bg-white/10"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-900/95 border-gray-700 backdrop-blur-xl"
                >
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="text-gray-300 focus:text-white focus:bg-white/10"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-gray-300 focus:text-white focus:bg-white/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button className="text-white hover:text-gray-200 hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
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
