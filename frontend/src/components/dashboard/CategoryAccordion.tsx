import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import QuestionCard from './QuestionCard';
// Remove unused Progress import

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
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  categories,
  completedQuestions,
  bookmarkedQuestions,
  onProgressUpdate,
  onBookmarkUpdate,
}) => {
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

  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {categories.map((category) => {
        const completedCount = category.questions.filter(q => 
          completedQuestions.includes(q._id)
        ).length;
        const totalQuestions = category.questions.length;
        const completionPercentage = totalQuestions > 0 
          ? Math.round((completedCount / totalQuestions) * 100) 
          : 0;

        const difficultyStats = getDifficultyStats(category.questions);
        const difficultyCompletionStats = getDifficultyCompletionStats(category.questions, completedQuestions);

        return (
          <AccordionItem
            key={category._id}
            value={category._id}
            className="bg-white/5 dark:bg-black/10 border-white/10 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-white/5 dark:hover:bg-black/5 transition-colors group">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {category.title}
                  </h3>
                  <span className="text-sm text-gray-400">
                    ({totalQuestions} question{totalQuestions !== 1 ? 's' : ''})
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Difficulty breakdown */}
                  <div className="hidden md:flex items-center space-x-2 text-xs">
                    {difficultyStats.Easy > 0 && (
                      <span className="flex items-center text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        {difficultyCompletionStats.Easy}/{difficultyStats.Easy}
                      </span>
                    )}
                    {difficultyStats.Medium > 0 && (
                      <span className="flex items-center text-yellow-400">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                        {difficultyCompletionStats.Medium}/{difficultyStats.Medium}
                      </span>
                    )}
                    {difficultyStats.Hard > 0 && (
                      <span className="flex items-center text-red-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        {difficultyCompletionStats.Hard}/{difficultyStats.Hard}
                      </span>
                    )}
                  </div>

                  {/* Progress indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 min-w-[3rem]">
                      {completionPercentage}%
                    </span>
                  </div>
                  
                  <span className="text-sm text-gray-400">
                    {completedCount}/{totalQuestions}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-3 pt-2">
                {category.questions.length > 0 ? (
                  <>
                    {/* Progress summary for mobile */}
                    <div className="md:hidden bg-white/5 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Progress</span>
                        <span className="text-sm text-blue-400 font-medium">
                          {completedCount}/{totalQuestions}
                        </span>
                      </div>
                      <div className="flex space-x-4 text-xs">
                        {difficultyStats.Easy > 0 && (
                          <span className="flex items-center text-green-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Easy: {difficultyCompletionStats.Easy}/{difficultyStats.Easy}
                          </span>
                        )}
                        {difficultyStats.Medium > 0 && (
                          <span className="flex items-center text-yellow-400">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                            Medium: {difficultyCompletionStats.Medium}/{difficultyStats.Medium}
                          </span>
                        )}
                        {difficultyStats.Hard > 0 && (
                          <span className="flex items-center text-red-400">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                            Hard: {difficultyCompletionStats.Hard}/{difficultyStats.Hard}
                          </span>
                        )}
                      </div>
                    </div>

                    {category.questions.map((question) => (
                      <QuestionCard
                        key={question._id}
                        question={question}
                        isCompleted={completedQuestions.includes(question._id)}
                        isBookmarked={bookmarkedQuestions.includes(question._id)}
                        onProgressUpdate={onProgressUpdate}
                        onBookmarkUpdate={onBookmarkUpdate}
                      />
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
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