import React from "react";
import useTheme from "@/utils/hooks/useTheme";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showFirstLast = true,
  maxVisiblePages = 5,
}) => {
  const { isDark } = useTheme();

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const buttonBaseStyles = `
    min-w-[36px]
    h-[36px]
    px-3
    rounded-lg
    text-sm
    font-medium
    transition-all
    duration-200
    flex
    items-center
    justify-center
    gap-1
  `;

  const activeButtonStyles = `
    bg-gradient-to-r from-[#9133EA] to-[#2962EB]
    text-white
    border-0
  `;

  const inactiveButtonStyles = isDark
    ? `
      bg-[#0C1116]
      border
      border-[#394757]
      text-white
      hover:bg-[#1A2335]
      hover:border-[#4A5568]
    `
    : `
      bg-[#F5F7FA]
      border
      border-[#E3E6EB]
      text-[#162230]
      hover:bg-[#EEF4FF]
      hover:border-[#C7D2FE]
    `;

  const disabledButtonStyles = isDark
    ? `
      bg-[#0C1116]
      border
      border-[#2B3643]
      text-[#4A5568]
      opacity-50
      cursor-not-allowed
    `
    : `
      bg-[#F5F7FA]
      border
      border-[#E3E6EB]
      text-[#9CA3AF]
      opacity-50
      cursor-not-allowed
    `;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* First Button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(1)}
          disabled={!canGoPrevious}
          className={`
            ${buttonBaseStyles}
            ${!canGoPrevious ? disabledButtonStyles : inactiveButtonStyles}
          `}
          aria-label="First page"
        >
          <span className="text-xs">««</span>
        </button>
      )}

      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={`
          ${buttonBaseStyles}
          ${!canGoPrevious ? disabledButtonStyles : inactiveButtonStyles}
        `}
        aria-label="Previous page"
      >
        <HiChevronLeft size={16} />
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`
              ${buttonBaseStyles}
              ${isActive ? activeButtonStyles : inactiveButtonStyles}
            `}
            aria-label={`Page ${page}`}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={`
          ${buttonBaseStyles}
          ${!canGoNext ? disabledButtonStyles : inactiveButtonStyles}
        `}
        aria-label="Next page"
      >
        <HiChevronRight size={16} />
      </button>

      {/* Last Button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={!canGoNext}
          className={`
            ${buttonBaseStyles}
            ${!canGoNext ? disabledButtonStyles : inactiveButtonStyles}
          `}
          aria-label="Last page"
        >
          <span className="text-xs">»»</span>
        </button>
      )}
    </div>
  );
};

export default Pagination;

