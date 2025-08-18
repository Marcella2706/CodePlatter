import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  className = '',
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="text-sm text-blue-600 dark:text-gray-400">
          Showing {totalItems} {totalItems === 1 ? 'result' : 'results'}
        </div>
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-600 dark:text-gray-400">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-white dark:bg-white/5 border border-blue-200 dark:border-white/20 text-blue-700 dark:text-white rounded px-2 py-1 text-sm focus:border-blue-400 transition-colors"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 ${className}`}>

      <div className="text-sm text-blue-600 dark:text-gray-400 order-2 lg:order-1">
        Showing {startItem}-{endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-2 order-1 lg:order-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-2 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10 disabled:opacity-50 transition-all duration-200"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className="p-2 w-8 h-8 text-blue-500 dark:text-gray-400"
                  aria-label="More pages"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(page)}
                  className={`w-8 h-8 p-0 text-sm transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-2 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10 disabled:opacity-50 transition-all duration-200"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2 order-3">
          <span className="text-sm text-blue-600 dark:text-gray-400 whitespace-nowrap">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-white dark:bg-white/5 border border-blue-200 dark:border-white/20 text-blue-700 dark:text-white rounded px-2 py-1 text-sm focus:border-blue-400 transition-colors min-w-[60px]"
            aria-label="Items per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;