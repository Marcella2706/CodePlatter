import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '../hooks/use-toast';
import { Bookmark, BookmarkCheck, CheckCircle, Circle, Youtube, Globe } from 'lucide-react';

const BASE_URL = "http://localhost:5703";

interface Question {
  _id: string;
  title: string;
  url: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface QuestionCardProps {
  question: Question;
  isCompleted?: boolean;
  isBookmarked?: boolean;
  onProgressUpdate?: (questionId: string) => void;
  onBookmarkUpdate?: (questionId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isCompleted = false,
  isBookmarked = false,
  onProgressUpdate,
  onBookmarkUpdate,
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-600 hover:bg-green-700';
      case 'Medium':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'Hard':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getLinkIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return <Youtube className="w-3 h-3 mr-1" />;
    }
    return <Globe className="w-3 h-3 mr-1" />;
  };

  const getLinkText = (url: string, index: number) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'Watch Tutorial';
    }
    if (index === 0) return 'View Problem';
    return `Link ${index + 1}`;
  };

  const handleProgressToggle = async () => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please login to track your progress.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          questionId: question._id,
          completed: !isCompleted 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update progress');
      }

      onProgressUpdate?.(question._id);
      toast({
        title: isCompleted ? "Question unmarked" : "Question completed!",
        description: isCompleted 
          ? "Removed from completed questions" 
          : "Great job! Keep up the learning.",
      });
    } catch (error) {
      console.error('Progress update error:', error);
      toast({
        title: "Failed to update progress",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please login to bookmark questions.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch(`${BASE_URL}/api/v1/user/bookmarks`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ questionId: question._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update bookmark');
      }

      onBookmarkUpdate?.(question._id);
      toast({
        title: isBookmarked ? "Bookmark removed" : "Question bookmarked!",
        description: isBookmarked 
          ? "Removed from your bookmarks" 
          : "Added to your bookmark collection.",
      });
    } catch (error) {
      console.error('Bookmark update error:', error);
      toast({
        title: "Failed to update bookmark",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-black/20 transition-all duration-200 group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-3">
              <h3 className="font-medium text-blue-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                {question.title}
              </h3>
            </div>
            
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <Badge className={`${getDifficultyColor(question.difficulty)} text-white border-0`}>
                {question.difficulty}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {question.url && question.url.length > 0 ? (
                question.url.filter(url => url && url.trim() !== '').map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-100 dark:bg-blue-600/10 hover:bg-blue-200 dark:hover:bg-blue-600/20 px-2 py-1 rounded"
                  >
                    {getLinkIcon(url)}
                    {getLinkText(url, index)}
                  </a>
                ))
              ) : (
                <span className="text-sm text-blue-500 dark:text-gray-500">No links available</span>
              )}
            </div>
          </div>

          {token && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProgressToggle}
                disabled={loading}
                className={`p-2 h-8 w-8 ${
                  isCompleted 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-blue-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white'
                } hover:bg-blue-50 dark:hover:bg-white/10`}
                title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmarkToggle}
                disabled={loading}
                className={`p-2 h-8 w-8 ${
                  isBookmarked 
                    ? 'text-yellow-400 hover:text-yellow-300' 
                    : 'text-blue-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white'
                } hover:bg-blue-50 dark:hover:bg-white/10`}
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;