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
import { Search, Filter, X, Loader2 } from 'lucide-react';

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

  return (
    <div className="bg-white dark:bg-white/5 border border-blue-200 dark:border-white/10 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-700 dark:text-white flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Search & Filter
        </h3>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          {isSearching && (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 text-blue-400 animate-spin" />
          )}
          <Input
            placeholder="Search questions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-10 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"
          />
        </div>

        <Select 
          value={currentDifficulty || 'all'} 
          onValueChange={handleDifficultyChange}
        >
          <SelectTrigger className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white focus:border-blue-400">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900/95 border-blue-200 dark:border-gray-700 backdrop-blur-xl">
            <SelectItem value="all" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10">
              All Difficulties
            </SelectItem>
            <SelectItem value="Easy" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Easy
              </div>
            </SelectItem>
            <SelectItem value="Medium" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Medium
              </div>
            </SelectItem>
            <SelectItem value="Hard" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Hard
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={currentSort || 'default'} 
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white focus:border-blue-400">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900/95 border-blue-200 dark:border-gray-700 backdrop-blur-xl">
            <SelectItem value="default" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10">
              Default Order
            </SelectItem>
            <SelectItem value="name_asc" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10">
              Name (A → Z)
            </SelectItem>
            <SelectItem value="name_desc" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10">
              Name (Z → A)
            </SelectItem>
            <SelectItem value="difficulty_asc" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10">
              Difficulty (Easy → Hard)
            </SelectItem>
            <SelectItem value="difficulty_desc" className="text-blue-700 dark:text-gray-300 focus:text-blue-800 dark:focus:text-white focus:bg-blue-50 dark:focus:bg-white/10">
              Difficulty (Hard → Easy)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-200 dark:border-white/10">
          {currentSearch && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30">
              Search: "{currentSearch}"
              <button
                onClick={() => setSearchInput('')}
                className="ml-1 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentDifficulty && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30">
              Difficulty: {currentDifficulty}
              <button
                onClick={() => onDifficultyChange('')}
                className="ml-1 hover:text-purple-800 dark:hover:text-purple-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentSort && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-500/30">
              Sort: {currentSort.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              <button
                onClick={() => onSortChange('')}
                className="ml-1 hover:text-green-800 dark:hover:text-green-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
      
      {!hasActiveFilters && (
        <div className="text-xs text-blue-600 dark:text-gray-500 pt-2 border-t border-blue-200 dark:border-white/10">
          💡 Tip: Search for specific topics like "array", "tree", or "sorting" to find relevant questions
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;