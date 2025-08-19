import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CategoryAccordion from '@/components/dashboard/CategoryAccordion';
import SearchAndFilter from '@/components/dashboard/SearchAndFilter';
import Pagination from '@/components/dashboard/Pagination';
import VoiceCommands from '@/components/dashboard/VoiceCommands';
import { toast } from '@/components/hooks/use-toast';
import { Loader2, BookOpen, Mic, Zap, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
  const { token, user } = useAuth();
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

  const getProgressPercentage = () => {
    if (stats.totalQuestions === 0) return 0;
    return Math.round((completedQuestions.length / stats.totalQuestions) * 100);
  };

  const getDifficultyStats = () => {
    const categoryQuestions = categories.flatMap(cat => cat.questions);
    const easy = categoryQuestions.filter(q => q.difficulty === 'Easy').length;
    const medium = categoryQuestions.filter(q => q.difficulty === 'Medium').length;
    const hard = categoryQuestions.filter(q => q.difficulty === 'Hard').length;
    
    const easyCompleted = categoryQuestions.filter(q => 
      q.difficulty === 'Easy' && completedQuestions.includes(q._id)
    ).length;
    const mediumCompleted = categoryQuestions.filter(q => 
      q.difficulty === 'Medium' && completedQuestions.includes(q._id)
    ).length;
    const hardCompleted = categoryQuestions.filter(q => 
      q.difficulty === 'Hard' && completedQuestions.includes(q._id)
    ).length;

    return { easy, medium, hard, easyCompleted, mediumCompleted, hardCompleted };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-400 mx-auto mb-6" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-semibold text-blue-700 dark:text-white mb-2">Loading Questions</h3>
          <p className="text-blue-600 dark:text-gray-300">Preparing your coding challenges...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-scale-in">
          <div className="text-red-400 text-6xl mb-6 animate-bounce-gentle">⚠️</div>
          <h2 className="text-2xl font-bold text-blue-700 dark:text-white mb-4">Connection Error</h2>
          <p className="text-blue-600 dark:text-gray-300 mb-8 text-center">{error}</p>
          <Button
            onClick={() => loadCategories()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
          >
            <Zap className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const difficultyStats = getDifficultyStats();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-2 rounded-full text-sm mb-4 animate-fade-in">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">Interactive Learning Platform</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-glow">
            {user ? `Welcome back, ${user.name}!` : 'Coding Questions'}
          </h1>
          <p className="text-base sm:text-lg text-blue-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Master your coding skills with curated programming challenges and track your progress
          </p>
        </div>

        {token && progressPercentage > 0 && (
          <Card className="mb-8 bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-white mb-1">Your Progress</h3>
                  <p className="text-sm text-blue-600 dark:text-gray-400">Keep up the great work!</p>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{progressPercentage}%</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <span className="block text-green-600 dark:text-green-400 font-semibold">{difficultyStats.easyCompleted}/{difficultyStats.easy}</span>
                  <span className="text-gray-600 dark:text-gray-400">Easy</span>
                </div>
                <div>
                  <span className="block text-yellow-600 dark:text-yellow-400 font-semibold">{difficultyStats.mediumCompleted}/{difficultyStats.medium}</span>
                  <span className="text-gray-600 dark:text-gray-400">Medium</span>
                </div>
                <div>
                  <span className="block text-red-600 dark:text-red-400 font-semibold">{difficultyStats.hardCompleted}/{difficultyStats.hard}</span>
                  <span className="text-gray-600 dark:text-gray-400">Hard</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              onClick={() => setShowVoiceCommands(!showVoiceCommands)}
              variant="outline"
              className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-200 hover:scale-105"
            >
              <Mic className="w-4 h-4 mr-2" />
              {showVoiceCommands ? 'Hide' : 'Show'} Voice Commands
            </Button>
            
            <div className="text-sm text-blue-600 dark:text-gray-400 px-3 py-2 bg-blue-50 dark:bg-white/5 rounded-lg border border-blue-200 dark:border-white/10">
              💡 Pro tip: Use voice commands for hands-free navigation
            </div>
          </div>
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
            <div className="relative mb-6">
              <BookOpen className="h-20 w-20 text-gray-400 mx-auto animate-float" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 dark:text-gray-300 mb-4">
              {searchQuery || difficultyFilter ? 'No questions match your filters' : 'No questions found'}
            </h3>
            <p className="text-blue-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchQuery || difficultyFilter 
                ? 'Try adjusting your search criteria or clear the filters to see all questions' 
                : `Unable to connect to the server. Please check that your backend is running on ${BASE_URL}`
              }
            </p>
            
            {(searchQuery || difficultyFilter) && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setDifficultyFilter('');
                  setSortBy('');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
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