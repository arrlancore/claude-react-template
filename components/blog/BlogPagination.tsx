"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { paginationConfig } from "@/config";
import withSuspense from "@/lib/with-suspense";

interface BlogPaginationProps {
  totalPages: number;
  currentPage: number;
}

function _BlogPagination({ totalPages, currentPage }: BlogPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const maxPagesShown = paginationConfig.maxPagesShown || 7;

  // If there's only one page or no pages, don't render pagination
  if (totalPages <= 1) {
    return null;
  }

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= maxPagesShown) {
      // If there are maxPagesShown or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show the first page
      pageNumbers.push(1);

      // Show ellipsis after first page if needed
      if (showEllipsisStart) {
        pageNumbers.push("ellipsis-start");
      }

      // Calculate the range of pages to show around the current page
      const rangeStart = showEllipsisStart ? Math.max(2, currentPage - 1) : 2;
      const rangeEnd = showEllipsisEnd
        ? Math.min(totalPages - 1, currentPage + 1)
        : totalPages - 1;

      // Add page numbers in the calculated range
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pageNumbers.push(i);
      }

      // Show ellipsis before last page if needed
      if (showEllipsisEnd) {
        pageNumbers.push("ellipsis-end");
      }

      // Always show the last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(Math.max(1, currentPage - 1))}
            isDisabled={currentPage <= 1}
          />
        </PaginationItem>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={createPageURL(Math.min(totalPages, currentPage + 1))}
            isDisabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const BlogPagination = withSuspense(_BlogPagination);

export default BlogPagination;
