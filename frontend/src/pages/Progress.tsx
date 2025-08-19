import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import QuestionCard from '@/components/dashboard/QuestionCard';
import { toast } from '@/components/hooks/use-toast';
import { Loader2, Trophy, Target, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BASE_URL = "http://codeplatter-back.pearl99z.tech";

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
  const { token } = useAuth();
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
      return "🎉 Excellent progress! You're a coding champion!";
    } else if (stats.completionPercentage >= 50) {
      return "🚀 Great work! You're halfway there!";
    } else if (stats.completionPercentage >= 20) {
      return "💪 Good start! Keep up the momentum!";
    } else if (stats.totalCompleted > 0) {
      return "🌟 Nice! Every question solved is progress!";
    } else {
      return "💡 Ready to start your coding journey?";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-blue-700 dark:text-gray-300">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Your Progress
          </h1>
          <p className="text-blue-600 dark:text-gray-300 text-lg">
            Track your coding journey and achievements
          </p>
          {stats && (
            <p className="text-blue-600 dark:text-blue-300 text-sm mt-2 font-medium">
              {getProgressMessage()}
            </p>
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-600 dark:text-gray-300">
                  Total Completed
                </CardTitle>
                <Trophy className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 dark:text-white">{stats.totalCompleted}</div>
                <p className="text-xs text-blue-500 dark:text-gray-400">
                  {stats.completionPercentage.toFixed(1)}% of all questions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-600 dark:text-gray-300">
                  Easy Questions
                </CardTitle>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.easyCompleted}</div>
                <p className="text-xs text-blue-500 dark:text-gray-400">Completed</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-600 dark:text-gray-300">
                  Medium Questions
                </CardTitle>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.mediumCompleted}</div>
                <p className="text-xs text-blue-500 dark:text-gray-400">Completed</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-600 dark:text-gray-300">
                  Hard Questions
                </CardTitle>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.hardCompleted}</div>
                <p className="text-xs text-blue-500 dark:text-gray-400">Completed</p>
              </CardContent>
            </Card>
          </div>
        )}

        {stats && (
          <Card className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 dark:text-gray-300">Completed</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {stats.totalCompleted} / {stats.totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-800 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(stats.completionPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.completionPercentage.toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-white flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Completed Questions
          </h2>
          
          {completedQuestions.length > 0 ? (
            <div className="space-y-4">
              {completedQuestions.map((cq) => (
                <div key={cq.questionId._id} className="space-y-2">
                  <QuestionCard
                    question={cq.questionId}
                    isCompleted={true}
                    isBookmarked={bookmarkedQuestions.includes(cq.questionId._id)}
                    onProgressUpdate={handleProgressUpdate}
                    onBookmarkUpdate={handleBookmarkUpdate}
                  />
                  <div className="text-sm text-blue-500 dark:text-gray-400 ml-4 flex items-center">
                    <Award className="w-3 h-3 mr-1" />
                    Completed on {new Date(cq.completedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-700 dark:text-gray-300 mb-2">
                No completed questions yet
              </h3>
              <p className="text-blue-600 dark:text-gray-400 mb-6">
                Start solving questions to track your progress here
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
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