import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import QuestionCard from './QuestionCard';

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
                    ({totalQuestions} questions)
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Progress indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
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
                
                {category.questions.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No questions in this category yet.
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