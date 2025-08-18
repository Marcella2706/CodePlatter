import React, { useEffect, useState } from 'react';
import {Accordion,AccordionContent,AccordionItem,AccordionTrigger} from '@/components/ui/accordion';
import QuestionCard from './QuestionCard';

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

interface CategoryAccordionProps {
  categories: Category[];
  completedQuestions: string[];
  bookmarkedQuestions: string[];
  onProgressUpdate: (questionId: string) => void;
  onBookmarkUpdate: (questionId: string) => void;
  openCategoryId?: string | null;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  categories,
  completedQuestions,
  bookmarkedQuestions,
  onProgressUpdate,
  onBookmarkUpdate,
  openCategoryId,
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (openCategoryId && !openItems.includes(openCategoryId)) {
      setOpenItems(prev => [...prev, openCategoryId]);
      setAnimatingItems(prev => new Set(prev).add(openCategoryId));
      
      setTimeout(() => {
        setAnimatingItems(prev => {
          const next = new Set(prev);
          next.delete(openCategoryId);
          return next;
        });
      }, 600);
    }
  }, [openCategoryId, openItems]);

  const getDifficultyStats = (questions: Question[]) => {
    const stats = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };
    
    questions.forEach(q => {
      stats[q.difficulty]++;
    });
    
    return stats;
  };

  const getDifficultyCompletionStats = (questions: Question[], completed: string[]) => {
    const stats = {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };
    
    questions.forEach(q => {
      if (completed.includes(q._id)) {
        stats[q.difficulty]++;
      }
    });
    
    return stats;
  };

  const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBgColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 50) return 'from-blue-500 to-purple-500';
    if (percentage >= 20) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <Accordion 
      type="multiple" 
      className="w-full space-y-4"
      value={openItems}
      onValueChange={setOpenItems}
    >
      {categories.map((category, index) => {
        const completedCount = category.questions.filter(q => 
          completedQuestions.includes(q._id)
        ).length;
        const totalQuestions = category.questions.length;
        const completionPercentage = getCompletionPercentage(completedCount, totalQuestions);

        const difficultyStats = getDifficultyStats(category.questions);
        const difficultyCompletionStats = getDifficultyCompletionStats(category.questions, completedQuestions);

        const isAnimating = animatingItems.has(category._id);
        const isHighlighted = openCategoryId === category._id;

        return (
          <AccordionItem
            key={category._id}
            value={category._id}
            data-category-id={category._id}
            className={`
              bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 rounded-lg overflow-hidden
              transition-all duration-500 ease-out
              hover:bg-blue-50 dark:hover:bg-black/20
              ${isAnimating ? 'animate-bounce-gentle' : ''}
              ${isHighlighted ? 'ring-2 ring-blue-400 ring-opacity-50 shadow-lg shadow-blue-400/20' : ''}
              ${index % 2 === 0 ? 'animate-slide-left' : 'animate-slide-right'}
            `}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 dark:hover:bg-black/5 transition-all duration-300 group">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <span className="text-sm text-blue-600 dark:text-gray-400 bg-blue-100 dark:bg-white/10 px-2 py-1 rounded-full">
                    {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="hidden lg:flex items-center space-x-3 text-xs">
                    {Object.entries(difficultyStats).map(([difficulty, count]) => {
                      if (count === 0) return null;
                      const completed = difficultyCompletionStats[difficulty as keyof typeof difficultyCompletionStats];
                      return (
                        <div key={difficulty} className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${getDifficultyBgColor(difficulty as 'Easy' | 'Medium' | 'Hard')}`}></div>
                          <span className={getDifficultyColor(difficulty as 'Easy' | 'Medium' | 'Hard')}>
                            {completed}/{count}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${getProgressColor(completionPercentage)}`}
                        style={{ 
                          width: `${completionPercentage}%`,
                          transitionDelay: `${index * 50}ms`
                        }}
                      />
                    </div>
                    <span className="text-sm text-blue-700 dark:text-gray-300 min-w-[3rem] font-medium">
                      {completionPercentage}%
                    </span>
                  </div>
                  
                  <span className="text-sm text-blue-700 dark:text-gray-400 bg-blue-100 dark:bg-blue-600/20 px-2 py-1 rounded">
                    {completedCount}/{totalQuestions}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-3 pt-2">
                {category.questions.length > 0 ? (
                  <>
                    <div className="lg:hidden bg-blue-50 dark:bg-white/5 rounded-lg p-3 mb-4 animate-fade-in">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-blue-700 dark:text-gray-300 font-medium">Progress Overview</span>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-bold">
                          {completedCount}/{totalQuestions} completed
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {Object.entries(difficultyStats).map(([difficulty, count]) => {
                          if (count === 0) return null;
                          const completed = difficultyCompletionStats[difficulty as keyof typeof difficultyCompletionStats];
                          const percentage = getCompletionPercentage(completed, count);
                          return (
                            <div key={difficulty} className="bg-white dark:bg-white/5 rounded p-2 text-center">
                              <div className={`flex items-center justify-center mb-1 ${getDifficultyColor(difficulty as 'Easy' | 'Medium' | 'Hard')}`}>
                                <div className={`w-2 h-2 rounded-full mr-1 ${getDifficultyBgColor(difficulty as 'Easy' | 'Medium' | 'Hard')}`}></div>
                                {difficulty}
                              </div>
                              <div className="text-blue-700 dark:text-white font-semibold">{completed}/{count}</div>
                              <div className="text-blue-600 dark:text-gray-400 text-xs">{percentage}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {category.questions.map((question, qIndex) => (
                      <div 
                        key={question._id}
                        className="animate-fade-in"
                        style={{
                          animationDelay: `${qIndex * 50}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <QuestionCard
                          question={question}
                          isCompleted={completedQuestions.includes(question._id)}
                          isBookmarked={bookmarkedQuestions.includes(question._id)}
                          onProgressUpdate={onProgressUpdate}
                          onBookmarkUpdate={onBookmarkUpdate}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-blue-600 dark:text-gray-400 animate-scale-in">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No questions in this category yet.</p>
                    <p className="text-sm mt-1">Check back later for new content!</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CategoryAccordion;