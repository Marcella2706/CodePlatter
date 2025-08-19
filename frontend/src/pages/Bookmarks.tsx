import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import QuestionCard from '@/components/dashboard/QuestionCard';
import { toast } from '@/components/hooks/use-toast';
import { Loader2, BookmarkX } from 'lucide-react';

const BASE_URL = "https://codeplatter-back.pearl99z.tech";

interface Question {
  _id: string;
  title: string;
  url: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface Bookmark {
  _id: string;
  questionId: Question;
}

const Bookmarks: React.FC = () => {
  const { token } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-blue-700 dark:text-gray-300">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:via-blue-950 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Your Bookmarks
          </h1>
          <p className="text-blue-600 dark:text-gray-300 text-lg">
            Questions you've saved for later practice
          </p>
          {bookmarks.length > 0 && (
            <p className="text-blue-500 dark:text-gray-400 text-sm mt-2">
              {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} saved
            </p>
          )}
        </div>

        {bookmarks.length > 0 ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {bookmarks.map((bookmark) => (
              <QuestionCard
                key={bookmark._id}
                question={bookmark.questionId}
                isCompleted={completedQuestions.includes(bookmark.questionId._id)}
                isBookmarked={true}
                onProgressUpdate={handleProgressUpdate}
                onBookmarkUpdate={handleBookmarkUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookmarkX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-700 dark:text-gray-300 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-blue-600 dark:text-gray-400 mb-6">
              Start bookmarking questions you want to practice later
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Browse Questions
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;