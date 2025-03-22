"use client"

import React from 'react';
import styles from './pagination.module.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showEllipsis?: boolean;
};

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 5, 
  onPageChange,
  showEllipsis = false
}: PaginationProps) {
  // Function to handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Create array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show page 1
    pages.push(1);
    
    // Show current page and adjacent pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1) pages.push(i);
    }
    
    // Always show last page if there are more than 1 pages
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={styles.navButton}
        aria-label="Previous page"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Previous</span>
      </button>
      
      {pageNumbers.map((page, index) => {
        // Check if we need to insert ellipsis
        const needsEllipsisBefore = index > 0 && page > pageNumbers[index - 1] + 1;
        const isCurrentPage = page === currentPage;
        
        return (
          <React.Fragment key={page}>
            {needsEllipsisBefore && showEllipsis && <span className={styles.ellipsis}>...</span>}
            <button
              onClick={() => handlePageChange(page)}
              className={`${styles.pageButton} ${isCurrentPage ? styles.active : ''}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={styles.navButton}
        aria-label="Next page"
      >
        <span>Next</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}