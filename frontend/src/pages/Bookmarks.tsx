import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import QuestionCard from '@/components/dashboard/QuestionCard';
import { toast } from '@/components/hooks/use-toast';
import { 
  Loader2, 
  BookmarkX,  
  Search, 
  Filter,
  BookOpen,
  TrendingUp,
  Target,
  Sparkles,

} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BASE_URL = "https://codeplatter-back.pearl99z.tech";

interface Question {
  _id: string;
  title: string;
  url: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface BookmarkItem {
  _id: string;
  questionId: Question;
}

const Bookmarks: React.FC = () => {
  const { token, user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkItem[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const bookmarksResponse = await fetch(`${BASE_URL}/api/v1/user/bookmarks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (bookmarksResponse.ok) {
          const bookmarksData = await bookmarksResponse.json();
          setBookmarks(bookmarksData.bookmarks || []);
          setFilteredBookmarks(bookmarksData.bookmarks || []);
        }
        
        const progressResponse = await fetch(`${BASE_URL}/api/v1/user/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setCompletedQuestions(progressData.completedQuestions || []);
        }
      } catch (error) {
        toast({
          title: "Failed to load bookmarks",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    let filtered = [...bookmarks];

    if (searchQuery.trim()) {
      filtered = filtered.filter(bookmark =>
        bookmark.questionId.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (difficultyFilter && difficultyFilter !== 'all') {
      filtered = filtered.filter(bookmark =>
        bookmark.questionId.difficulty === difficultyFilter
      );
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name_asc':
            return a.questionId.title.localeCompare(b.questionId.title);
          case 'name_desc':
            return b.questionId.title.localeCompare(a.questionId.title);
          case 'difficulty_asc':
            const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            return diffOrder[a.questionId.difficulty] - diffOrder[b.questionId.difficulty];
          case 'difficulty_desc':
            const diffOrderDesc = { 'Easy': 3, 'Medium': 2, 'Hard': 1 };
            return diffOrderDesc[a.questionId.difficulty] - diffOrderDesc[b.questionId.difficulty];
          default:
            return 0;
        }
      });
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, difficultyFilter, sortBy]);

  const handleProgressUpdate = (questionId: string) => {
    setCompletedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleBookmarkUpdate = (questionId: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.questionId._id !== questionId));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('');
    setSortBy('');
  };

  const getBookmarkStats = () => {
    const total = bookmarks.length;
    const completed = bookmarks.filter(b => completedQuestions.includes(b.questionId._id)).length;
    const easy = bookmarks.filter(b => b.questionId.difficulty === 'Easy').length;
    const medium = bookmarks.filter(b => b.questionId.difficulty === 'Medium').length;
    const hard = bookmarks.filter(b => b.questionId.difficulty === 'Hard').length;
    
    return { total, completed, easy, medium, hard };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-400 mx-auto mb-6" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-semibold text-blue-700 dark:text-white mb-2">Loading Bookmarks</h3>
          <p className="text-blue-600 dark:text-gray-300">Gathering your saved questions...</p>
        </div>
      </div>
    );
  }

  const stats = getBookmarkStats();
  const hasActiveFilters = searchQuery || difficultyFilter || sortBy;

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
  
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {user ? `${user.name}'s Bookmarks` : 'Your Bookmarks'}
          </h1>
          <p className="text-base sm:text-lg text-blue-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Questions you've saved for later practice and review
          </p>
          {stats.total > 0 && (
            <p className="text-blue-500 dark:text-gray-400 text-sm mt-3 bg-blue-50 dark:bg-blue-900/20 inline-block px-4 py-2 rounded-full">
              {stats.total} bookmark{stats.total !== 1 ? 's' : ''} saved • {stats.completed} completed
            </p>
          )}
        </div>



        {stats.total > 0 && (
          <Card className="mb-8 bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-sm shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-700 dark:text-white">
                      Search & Filter
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-gray-400">
                      Find specific bookmarked questions
                    </p>
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search bookmarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all rounded-lg"
                  />
                </div>

                <Select value={difficultyFilter || 'all'} onValueChange={(value) => setDifficultyFilter(value === 'all' ? '' : value)}>
                  <SelectTrigger className="h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white focus:border-blue-400 rounded-lg">
                    <SelectValue placeholder="Filter by difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900/95 border-blue-200 dark:border-gray-700 backdrop-blur-xl rounded-lg">
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="Easy">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Easy
                      </div>
                    </SelectItem>
                    <SelectItem value="Medium">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="Hard">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Hard
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy || 'default'} onValueChange={(value) => setSortBy(value === 'default' ? '' : value)}>
                  <SelectTrigger className="h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white focus:border-blue-400 rounded-lg">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900/95 border-blue-200 dark:border-gray-700 backdrop-blur-xl rounded-lg">
                    <SelectItem value="default">Default Order</SelectItem>
                    <SelectItem value="name_asc">Name (A → Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z → A)</SelectItem>
                    <SelectItem value="difficulty_asc">Difficulty (Easy → Hard)</SelectItem>
                    <SelectItem value="difficulty_desc">Difficulty (Hard → Easy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-blue-100 dark:border-white/10">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-blue-600 dark:text-gray-400">Active filters:</span>
                    {searchQuery && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300">
                        Search: "{searchQuery}"
                      </span>
                    )}
                    {difficultyFilter && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300">
                        Difficulty: {difficultyFilter}
                      </span>
                    )}
                    {sortBy && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-300">
                        Sort: {sortBy.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {filteredBookmarks.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 dark:text-white">
                {hasActiveFilters ? `Found ${filteredBookmarks.length} bookmark${filteredBookmarks.length !== 1 ? 's' : ''}` : 'Your Bookmarked Questions'}
              </h2>
            </div>
            
            {filteredBookmarks.map((bookmark, index) => (
              <div 
                key={bookmark._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <QuestionCard
                  question={bookmark.questionId}
                  isCompleted={completedQuestions.includes(bookmark.questionId._id)}
                  isBookmarked={true}
                  onProgressUpdate={handleProgressUpdate}
                  onBookmarkUpdate={handleBookmarkUpdate}
                />
              </div>
            ))}
          </div>
        ) : stats.total > 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="relative mb-6">
              <Search className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mx-auto" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 dark:text-gray-300 mb-4">
              No bookmarks match your filters
            </h3>
            <p className="text-blue-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
              Try adjusting your search criteria or clear the filters to see all bookmarks
            </p>
            
            <Button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <div className="relative mb-8">
              <BookmarkX className="h-20 w-20 sm:h-24 sm:w-24 text-gray-400 mx-auto animate-float" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"></div>
            </div>
            
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-700 dark:text-gray-300 mb-4">
              No bookmarks yet
            </h3>
            <p className="text-blue-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Start bookmarking questions you want to practice later. Click the bookmark icon on any question to save it here.
            </p>
            
            <div className="space-y-4">
              <a
                href="/dashboard"
                className="inline-block"
              >
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Browse Questions
                </Button>
              </a>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-blue-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>Save questions for later</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2 text-green-500" />
                  <span>Track your progress</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Build your skills</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;