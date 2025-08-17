import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CategoryAccordion from '@/components/dashboard/CategoryAccordion';
import SearchAndFilter from '@/components/dashboard/SearchAndFilter';
import { toast } from '@/components/hooks/use-toast';
import { Loader2, BookOpen } from 'lucide-react';

const BASE_URL = "http://localhost:5703";

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

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);
 
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (difficultyFilter) params.append('difficulty', difficultyFilter);
      if (sortBy) params.append('sortBy', sortBy);
      
      const url = `${BASE_URL}/api/v1/content${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching categories with URL:', url);
      
      const categoryResponse = await fetch(url);
      
      if (!categoryResponse.ok) {
        throw new Error(`Failed to fetch categories: ${categoryResponse.status}`);
      }
      
      const categoryData = await categoryResponse.json();
      console.log('Categories received:', categoryData);
      setCategories(categoryData.categories || []);
      
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
  }, [searchQuery, difficultyFilter, sortBy]);

  const loadUserData = useCallback(async () => {
    if (!token) return;

    try {
      // Load progress
      const progressResponse = await fetch(`${BASE_URL}/api/v1/user/progress`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setCompletedQuestions(progressData.completedQuestions || []);
      }

      // Load bookmarks
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

  // Load categories when search/filter changes
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Load user data once when component mounts
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading questions...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to {BASE_URL}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-black flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => loadCategories()}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = categories.reduce((sum, category) => sum + category.questions.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Coding Questions
          </h1>
          <p className="text-gray-300 text-lg">
            Master your coding skills with curated programming challenges
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 inline-block backdrop-blur-sm">
            <div className="text-white">
              <strong>{categories.length}</strong> categories, <strong>{totalQuestions}</strong> questions
            </div>
            {token && (
              <div className="text-gray-300 text-sm">
                {completedQuestions.length} completed, {bookmarkedQuestions.length} bookmarked
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
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
          <CategoryAccordion
            categories={categories}
            completedQuestions={completedQuestions}
            bookmarkedQuestions={bookmarkedQuestions}
            onProgressUpdate={handleProgressUpdate}
            onBookmarkUpdate={handleBookmarkUpdate}
          />
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchQuery || difficultyFilter ? 'No questions match your filters' : 'No questions found'}
            </h3>
            <p className="text-gray-400">
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
                className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;