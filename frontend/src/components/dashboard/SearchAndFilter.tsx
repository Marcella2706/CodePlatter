import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

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
  const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update parent when debounced search changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const clearFilters = () => {
    setSearchInput('');
    onDifficultyChange('');
    onSortChange('');
  };

  const hasActiveFilters = currentSearch || currentDifficulty || currentSort;

  return (
    <div className="bg-white/5 dark:bg-black/10 border border-white/10 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Search & Filter
        </h3>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search questions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 bg-white/5 dark:bg-black/10 border-white/20 dark:border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"
          />
        </div>

        {/* Difficulty Filter */}
        <Select value={currentDifficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="bg-white/5 dark:bg-black/10 border-white/20 dark:border-white/10 text-white focus:border-blue-400">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900/95 border-gray-700 backdrop-blur-xl">
            <SelectItem value="" className="text-gray-300 focus:text-white focus:bg-white/10">
              All Difficulties
            </SelectItem>
            <SelectItem value="Easy" className="text-gray-300 focus:text-white focus:bg-white/10">
              Easy
            </SelectItem>
            <SelectItem value="Medium" className="text-gray-300 focus:text-white focus:bg-white/10">
              Medium
            </SelectItem>
            <SelectItem value="Hard" className="text-gray-300 focus:text-white focus:bg-white/10">
              Hard
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="bg-white/5 dark:bg-black/10 border-white/20 dark:border-white/10 text-white focus:border-blue-400">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900/95 border-gray-700 backdrop-blur-xl">
            <SelectItem value="" className="text-gray-300 focus:text-white focus:bg-white/10">
              Default Order
            </SelectItem>
            <SelectItem value="name_asc" className="text-gray-300 focus:text-white focus:bg-white/10">
              Name (A-Z)
            </SelectItem>
            <SelectItem value="name_desc" className="text-gray-300 focus:text-white focus:bg-white/10">
              Name (Z-A)
            </SelectItem>
            <SelectItem value="difficulty_asc" className="text-gray-300 focus:text-white focus:bg-white/10">
              Difficulty (Easy → Hard)
            </SelectItem>
            <SelectItem value="difficulty_desc" className="text-gray-300 focus:text-white focus:bg-white/10">
              Difficulty (Hard → Easy)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          {currentSearch && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600/20 text-blue-300 border border-blue-500/30">
              Search: "{currentSearch}"
            </span>
          )}
          {currentDifficulty && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30">
              Difficulty: {currentDifficulty}
            </span>
          )}
          {currentSort && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-600/20 text-green-300 border border-green-500/30">
              Sort: {currentSort.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;