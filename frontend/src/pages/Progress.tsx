import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import QuestionCard from '@/components/dashboard/QuestionCard';
import { toast } from '@/components/hooks/use-toast';
import { 
  Loader2, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  Zap,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BASE_URL = "https://codeplatter-back.pearl99z.tech";

interface Question {
  _id: string;
  title: string;
  url: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface CompletedQuestion {
  questionId: Question;
  completedAt: string;
}

interface ProgressStats {
  totalCompleted: number;
  easyCompleted: number;
  mediumCompleted: number;
  hardCompleted: number;
  totalQuestions: number;
  completionPercentage: number;
}

const Progress: React.FC = () => {
  const { token, user } = useAuth();
  const [completedQuestions, setCompletedQuestions] = useState<CompletedQuestion[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const progressResponse = await fetch(`${BASE_URL}/api/v1/user/progress/detailed`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setCompletedQuestions(progressData.completedQuestions || []);
          setStats(progressData.stats);
        } else {
          const basicProgressResponse = await fetch(`${BASE_URL}/api/v1/user/progress`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (basicProgressResponse.ok) {
            const basicData = await basicProgressResponse.json();
            setStats({
              totalCompleted: basicData.totalCompleted || 0,
              easyCompleted: 0,
              mediumCompleted: 0,
              hardCompleted: 0,
              totalQuestions: 100, 
              completionPercentage: 0
            });
          }
        }

        const bookmarksResponse = await fetch(`${BASE_URL}/api/v1/user/bookmarks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (bookmarksResponse.ok) {
          const bookmarksData = await bookmarksResponse.json();
          const bookmarkIds = bookmarksData.bookmarks?.map((b: any) => b.questionId._id) || [];
          setBookmarkedQuestions(bookmarkIds);
        }
      } catch (error) {
        toast({
          title: "Failed to load progress",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleProgressUpdate = (questionId: string) => {
    setCompletedQuestions(prev => 
      prev.filter(cq => cq.questionId._id !== questionId)
    );

    if (stats) {
      setStats(prev => prev ? {
        ...prev,
        totalCompleted: prev.totalCompleted - 1,
        completionPercentage: prev.totalQuestions > 0 
          ? ((prev.totalCompleted - 1) / prev.totalQuestions) * 100 
          : 0
      } : null);
    }
  };

  const handleBookmarkUpdate = (questionId: string) => {
    setBookmarkedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const getProgressMessage = () => {
    if (!stats) return '';
    
    if (stats.completionPercentage >= 80) {
      return " Excellent progress! You're a coding champion!";
    } else if (stats.completionPercentage >= 50) {
      return " Great work! You're halfway there!";
    } else if (stats.completionPercentage >= 20) {
      return " Good start! Keep up the momentum!";
    } else if (stats.totalCompleted > 0) {
      return " Nice! Every question solved is progress!";
    } else {
      return " Ready to start your coding journey?";
    }
  };

 

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-400 mx-auto mb-6" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-semibold text-blue-700 dark:text-white mb-2">Loading Progress</h3>
          <p className="text-blue-600 dark:text-gray-300">Calculating your achievements...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-700 dark:text-green-300 px-3 sm:px-4 py-2 rounded-full text-sm mb-4 animate-fade-in">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">Your Learning Analytics</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {user ? `${user.name}'s Progress` : 'Your Progress'}
          </h1>
          <p className="text-base sm:text-lg text-blue-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Track your coding journey and celebrate every milestone
          </p>
          {stats && (
            <p className="text-blue-600 dark:text-blue-300 text-sm sm:text-base mt-3 font-medium bg-blue-50 dark:bg-blue-900/20 inline-block px-4 py-2 rounded-full">
              {getProgressMessage()}
            </p>
          )}
        </div>

        {stats && (
          <Card className="mb-8 bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl text-blue-700 dark:text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-3" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm sm:text-base text-blue-600 dark:text-gray-300 font-medium">Overall Completion</span>
                  <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.completionPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 sm:h-5 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${Math.min(stats.completionPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>{stats.totalCompleted} completed</span>
                  <span>{stats.totalQuestions} total</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-700/30">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <span className="block text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                    {stats.easyCompleted}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Easy Questions</span>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-700/30">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                  <span className="block text-lg sm:text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.mediumCompleted}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Medium Questions</span>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-700/30">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
                  <span className="block text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">
                    {stats.hardCompleted}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Hard Questions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

       

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 dark:text-white flex items-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Completed Questions
            </h2>
            {completedQuestions.length > 0 && (
              <span className="text-sm text-blue-600 dark:text-gray-400 bg-blue-100 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                {completedQuestions.length} total
              </span>
            )}
          </div>
          
          {completedQuestions.length > 0 ? (
            <div className="space-y-4">
              {completedQuestions.map((cq, index) => (
                <div 
                  key={cq.questionId._id} 
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <QuestionCard
                    question={cq.questionId}
                    isCompleted={true}
                    isBookmarked={bookmarkedQuestions.includes(cq.questionId._id)}
                    onProgressUpdate={handleProgressUpdate}
                    onBookmarkUpdate={handleBookmarkUpdate}
                  />
                  <div className="text-xs sm:text-sm text-blue-500 dark:text-gray-400 ml-4 flex items-center bg-blue-50 dark:bg-blue-900/10 w-fit px-3 py-1 rounded-full">
                    <Zap className="w-3 h-3 mr-1" />
                    Completed on {new Date(cq.completedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="relative mb-6">
                <Trophy className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mx-auto animate-float" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-semibold text-blue-700 dark:text-gray-300 mb-4">
                No completed questions yet
              </h3>
              <p className="text-blue-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
                Start solving questions to track your progress and unlock achievements
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Coding
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;