import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X, Loader2, Sparkles, Zap, SlidersHorizontal } from 'lucide-react';

interface SearchAndFilterProps {
  onSearchChange: (search: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onSortChange: (sort: string) => void;
  currentSearch: string;
  currentDifficulty: string;
  currentSort: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearchChange,
  onDifficultyChange,
  onSortChange,
  currentSearch,
  currentDifficulty,
  currentSort,
}) => {
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [isSearching, setIsSearching] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setIsSearching(true);
    
    debounceTimer.current = setTimeout(() => {
      onSearchChange(searchInput);
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchInput, onSearchChange]);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const clearFilters = () => {
    setSearchInput('');
    onDifficultyChange('all');
    onSortChange('default');
  };

  const handleDifficultyChange = (value: string) => {
    onDifficultyChange(value === 'all' ? '' : value);
  };

  const handleSortChange = (value: string) => {
    onSortChange(value === 'default' ? '' : value);
  };

  const hasActiveFilters = currentSearch || currentDifficulty || currentSort;

  const searchPlaceholders = [
    "Search for 'arrays', 'sorting', 'graphs'...",
    "Try 'binary tree', 'dynamic programming'...",
    "Find 'two pointers', 'sliding window'...",
    "Look for 'backtracking', 'greedy'..."
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-white/5 border border-blue-200 dark:border-white/10 rounded-xl shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-blue-100 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-blue-700 dark:text-white">
              Search & Filter
            </h3>
            <p className="text-xs sm:text-sm text-blue-600 dark:text-gray-400">
              Find the perfect coding challenges
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <div className="hidden sm:flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>{Object.values({currentSearch: !!currentSearch, currentDifficulty: !!currentDifficulty, currentSort: !!currentSort}).filter(Boolean).length} active</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden text-blue-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10"
          >
            <Filter className="w-4 h-4" />
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Clear All</span>
            </Button>
          )}
        </div>
      </div>

      <div className={`p-4 sm:p-6 space-y-4 ${!isExpanded && 'hidden sm:block'}`}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-700 dark:text-gray-200 flex items-center">
            <Search className="w-4 h-4 mr-1" />
            Search Questions
          </label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400 animate-spin" />
            )}
            <Input
              placeholder={searchPlaceholders[placeholderIndex]}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-10 h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-700 dark:text-gray-200 flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Difficulty Level
            </label>
            <Select 
              value={currentDifficulty || 'all'} 
              onValueChange={handleDifficultyChange}
            >
              <SelectTrigger className="h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 rounded-lg">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900/95 border-blue-200 dark:border-gray-700 backdrop-blur-xl rounded-lg shadow-xl">
                <SelectItem value="all" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 rounded-md">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    All Difficulties
                  </div>
                </SelectItem>
                <SelectItem value="Easy" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 rounded-md">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Easy
                  </div>
                </SelectItem>
                <SelectItem value="Medium" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 rounded-md">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="Hard" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 rounded-md">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Hard
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-700 dark:text-gray-200 flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              Sort Order
            </label>
            <Select 
              value={currentSort || 'default'} 
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 rounded-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900/95 border-blue-200 dark:border-gray-700 backdrop-blur-xl rounded-lg shadow-xl">
                <SelectItem value="default" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 rounded-md">
                  Default Order
                </SelectItem>
                <SelectItem value="name_asc" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 rounded-md">
                  Name (A → Z)
                </SelectItem>
                <SelectItem value="name_desc" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 rounded-md">
                  Name (Z → A)
                </SelectItem>
                <SelectItem value="difficulty_asc" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 rounded-md">
                  Difficulty (Easy → Hard)
                </SelectItem>
                <SelectItem value="difficulty_desc" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10 rounded-md">
                  Difficulty (Hard → Easy)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="pt-4 border-t border-blue-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-blue-700 dark:text-white">Active Filters</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 h-auto"
              >
                Clear All
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentSearch && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30">
                  <Search className="w-3 h-3 mr-1" />
                  Search: "{currentSearch}"
                  <button
                    onClick={() => setSearchInput('')}
                    className="ml-2 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {currentDifficulty && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    currentDifficulty === 'Easy' ? 'bg-green-500' :
                    currentDifficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  Difficulty: {currentDifficulty}
                  <button
                    onClick={() => onDifficultyChange('')}
                    className="ml-2 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {currentSort && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-500/30">
                  <Filter className="w-3 h-3 mr-1" />
                  Sort: {currentSort.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <button
                    onClick={() => onSortChange('')}
                    className="ml-2 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
        
        {!hasActiveFilters && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-4 border border-blue-100 dark:border-white/5">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 p-1 rounded-full mt-0.5">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-blue-700 dark:text-white mb-1">Pro Tips</h5>
                <ul className="text-xs text-blue-600 dark:text-gray-400 space-y-1">
                  <li>• Search for specific topics like "array", "tree", or "sorting"</li>
                  <li>• Use difficulty filters to match your skill level</li>
                  <li>• Sort by difficulty to practice progressively</li>
                  <li>• Try voice commands for hands-free filtering</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;