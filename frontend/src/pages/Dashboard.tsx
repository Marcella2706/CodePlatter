import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CategoryAccordion from '@/components/dashboard/CategoryAccordion';
import SearchAndFilter from '@/components/dashboard/SearchAndFilter';
import Pagination from '@/components/dashboard/Pagination';
import VoiceCommands from '@/components/dashboard/VoiceCommands';
import { toast } from '@/components/hooks/use-toast';
import { Loader2, BookOpen, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BASE_URL = "https://codeplatter-back.pearl99z.tech";

interface Question {
  _id: string;
  title: string;
  url: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface Category {
  _id: string;
  title: string;
  questions: Question[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCategories: number;
  limit: number;
}

interface StatsData {
  totalQuestions: number;
  totalFilteredCategories: number;
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);
  
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCategories: 0,
    limit: 10,
  });
  
  const [stats, setStats] = useState<StatsData>({
    totalQuestions: 0,
    totalFilteredCategories: 0,
  });
 
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (difficultyFilter) params.append('difficulty', difficultyFilter);
      if (sortBy) params.append('sortBy', sortBy);
      params.append('page', pagination.currentPage.toString());
      params.append('limit', pagination.limit.toString());
      
      const url = `${BASE_URL}/api/v1/content${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching categories with URL:', url);
      
      const categoryResponse = await fetch(url);
      
      if (!categoryResponse.ok) {
        throw new Error(`Failed to fetch categories: ${categoryResponse.status}`);
      }
      
      const categoryData = await categoryResponse.json();
      console.log('Categories received:', categoryData);
      
      setCategories(categoryData.categories || []);
      
      if (categoryData.pagination) {
        setPagination({
          currentPage: categoryData.pagination.currentPage,
          totalPages: categoryData.pagination.totalPages,
          totalCategories: categoryData.pagination.totalCategories,
          limit: categoryData.pagination.limit,
        });
      }
      
      if (categoryData.stats) {
        setStats({
          totalQuestions: categoryData.stats.totalQuestions,
          totalFilteredCategories: categoryData.stats.totalFilteredCategories,
        });
      }
      
    } catch (error) {
      console.error('Error loading categories:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Failed to load questions",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, difficultyFilter, sortBy, pagination.currentPage, pagination.limit]);

  const loadUserData = useCallback(async () => {
    if (!token) return;

    try {
      const progressResponse = await fetch(`${BASE_URL}/api/v1/user/progress`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setCompletedQuestions(progressData.completedQuestions || []);
      }

      const bookmarksResponse = await fetch(`${BASE_URL}/api/v1/user/bookmarks`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (bookmarksResponse.ok) {
        const bookmarksData = await bookmarksResponse.json();
        const bookmarkIds = bookmarksData.bookmarks?.map((b: any) => 
          typeof b.questionId === 'string' ? b.questionId : b.questionId._id
        ) || [];
        setBookmarkedQuestions(bookmarkIds);
      }
    } catch (err) {
      console.warn('Failed to fetch user data:', err);
    }
  }, [token]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  }, [searchQuery, difficultyFilter, sortBy]);

  const handleProgressUpdate = (questionId: string) => {
    setCompletedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleBookmarkUpdate = (questionId: string) => {
    setBookmarkedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (limit: number) => {
    setPagination(prev => ({ 
      ...prev, 
      limit, 
      currentPage: 1 
    }));
  };

  const handleCategoryOpen = (categoryId: string) => {
    setOpenCategoryId(categoryId);
    setTimeout(() => {
      const element = document.querySelector(`[data-category-id="${categoryId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleVoiceSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleVoiceDifficultyFilter = (difficulty: string) => {
    setDifficultyFilter(difficulty);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-blue-700 dark:text-gray-300">Loading questions...</p>
          <p className="text-blue-600 dark:text-gray-500 text-sm mt-2">Connecting to {BASE_URL}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black flex items-center justify-center">
        <div className="text-center max-w-md p-6 animate-scale-in">
          <div className="text-red-400 text-4xl mb-4 animate-bounce-gentle">⚠️</div>
          <h2 className="text-2xl font-bold text-blue-700 dark:text-white mb-4">Connection Error</h2>
          <p className="text-blue-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => loadCategories()}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded transition-colors interactive-hover"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-glow">
            Coding Questions
          </h1>
          <p className="text-blue-600 dark:text-gray-300 text-lg">
            Master your coding skills with curated programming challenges
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4">
          <div className="bg-white dark:bg-white/5 border border-blue-200 dark:border-white/10 rounded-lg p-4 backdrop-blur-sm glass-morphism animate-slide-up">
            <div className="text-blue-700 dark:text-white">
              <strong>{stats.totalFilteredCategories}</strong> categories, <strong>{stats.totalQuestions}</strong> questions
            </div>
            {token && (
              <div className="text-blue-600 dark:text-gray-300 text-sm">
                {completedQuestions.length} completed, {bookmarkedQuestions.length} bookmarked
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowVoiceCommands(!showVoiceCommands)}
            variant="outline"
            className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-200"
          >
            <Mic className="w-4 h-4 mr-2" />
            {showVoiceCommands ? 'Hide' : 'Show'} Voice Commands
          </Button>
        </div>

        <div className="mb-8 animate-slide-down">
          <SearchAndFilter
            onSearchChange={setSearchQuery}
            onDifficultyChange={setDifficultyFilter}
            onSortChange={setSortBy}
            currentSearch={searchQuery}
            currentDifficulty={difficultyFilter}
            currentSort={sortBy}
          />
        </div>

        {categories.length > 0 ? (
          <div className="space-y-6">
            <div className="animate-slide-up">
              <CategoryAccordion
                categories={categories}
                completedQuestions={completedQuestions}
                bookmarkedQuestions={bookmarkedQuestions}
                onProgressUpdate={handleProgressUpdate}
                onBookmarkUpdate={handleBookmarkUpdate}
                openCategoryId={openCategoryId}
              />
            </div>

            <div className="animate-fade-in">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalCategories}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className="my-8"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 animate-scale-in">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-semibold text-blue-700 dark:text-gray-300 mb-2">
              {searchQuery || difficultyFilter ? 'No questions match your filters' : 'No questions found'}
            </h3>
            <p className="text-blue-600 dark:text-gray-400">
              {searchQuery || difficultyFilter 
                ? 'Try adjusting your search criteria' 
                : `Check that your backend server is running on ${BASE_URL}`
              }
            </p>
            {(searchQuery || difficultyFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDifficultyFilter('');
                  setSortBy('');
                }}
                className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded transition-colors interactive-hover"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {showVoiceCommands && (
        <VoiceCommands
          categories={categories}
          onCategoryOpen={handleCategoryOpen}
          onSearchQuery={handleVoiceSearch}
          onDifficultyFilter={handleVoiceDifficultyFilter}
        />
      )}
    </div>
  );
};

export default Dashboard;