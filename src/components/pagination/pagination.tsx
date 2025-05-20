"use client"

import React from 'react';
import styles from './pagination.module.css';
import Image from 'next/image';
import arrowDown from '@/public/arrow.svg';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: any;
  showEllipsis?: boolean;
  urlParam?: string;
};

export default function Pagination({ 
  currentPage = 1, 
  totalPages = 5, 
  onPageChange,
  showEllipsis = true,
  urlParam = 'page'
}: PaginationProps) {
  const searchParams = useSearchParams()

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(urlParam, pageNumber.toString());
    return `?${params.toString()}`;
  };
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
      <Link
      href={createPageUrl(Math.max(1,currentPage-1))}
      scroll={false}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={styles.navButton}
        aria-label="Previous page"
      >
        <div className={styles.arrowContainer}>
            <Image src={arrowDown} alt="arrow-left" fill className={styles.arrowLeft}/>
        </div>
        <span>Previous</span>
      </button>
      </Link>
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

              <span style={{
                  zIndex: "4"
              }}>
                  {page}
              </span>
            </button>
          </React.Fragment>
        );
      })}
      <Link
      href={createPageUrl(Math.max(1,currentPage+1))}
      scroll={false}>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={styles.navButton}
        aria-label="Next page"
      >
        <span>Next</span>
        <div className={styles.arrowContainer}>
            <Image fill={true} src={arrowDown} alt="arrow-right" className={styles.arrowRight}/>
        </div>
      </button>
      </Link>
    </div>
  );
}