import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  siblingCount?: number;
}

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  siblingCount = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers array with dots
  const generatePagination = () => {
    const pageNumbers = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    // Add first page
    pageNumbers.push(1);

    // Add dots after first page
    if (leftSibling > 2) {
      pageNumbers.push("...");
    }

    // Add middle pages
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Add dots before last page
    if (rightSibling < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Add last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pages = generatePagination();

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <Link
            href={`?page=${Math.max(1, currentPage - 1)}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "gap-1",
              currentPage <= 1 ? "pointer-events-none opacity-50" : ""
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <span className="px-4">...</span>
            ) : (
              <Link
                href={`?page=${page}`}
                className={cn(
                  buttonVariants({
                    variant: currentPage === page ? "default" : "outline",
                  })
                )}
              >
                {page}
              </Link>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <Link
            href={`?page=${Math.min(totalPages, currentPage + 1)}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "gap-1",
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
