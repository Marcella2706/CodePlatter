import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CategoryAccordion from '@/components/dashboard/CategoryAccordion';
import SearchAndFilter from '@/components/dashboard/SearchAndFilter';
import { toast } from '@/components/hooks/use-toast';
import { Loader2, BookOpen } from 'lucide-react';

interface Question {
  _id: string;
  title: string;
  url: string;
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
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (difficultyFilter) params.append('difficulty', difficultyFilter);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await fetch(`/api/v1/content?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      toast({
        title: "Failed to load questions",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    }
  }, [searchQuery, difficultyFilter, sortBy]);

  const fetchUserData = useCallback(async () => {
    if (!token) return;

    try {
      // Fetch user progress
      const progressResponse = await fetch('/api/v1/user/progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setCompletedQuestions(progressData.completedQuestions || []);
      }

      // Fetch bookmarks
      const bookmarksResponse = await fetch('/api/v1/user/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (bookmarksResponse.ok) {
        const bookmarksData = await bookmarksResponse.json();
        setBookmarkedQuestions(bookmarksData.bookmarks?.map((b: any) => b.questionId) || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchUserData()]);
      setLoading(false);
    };

    loadData();
  }, [fetchCategories, fetchUserData]);

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

  const totalQuestions = categories.reduce((sum, category) => sum + category.questions.length, 0);
  const completedCount = completedQuestions.length;
  const completionPercentage = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Coding Questions
          </h1>
          <p className="text-gray-300 text-lg">
            Master your coding skills with curated programming challenges
          </p>
          
          {token && (
            <div className="mt-6 bg-white/5 dark:bg-black/10 border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Your Progress</h3>
                <span className="text-2xl font-bold text-blue-400">{completionPercentage}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>{completedCount} completed</span>
                <span>{totalQuestions} total questions</span>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter */}
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

        {/* Categories */}
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
              No questions found
            </h3>
            <p className="text-gray-400">
              {searchQuery || difficultyFilter
                ? "Try adjusting your search or filter criteria"
                : "Questions will appear here once they're loaded"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;