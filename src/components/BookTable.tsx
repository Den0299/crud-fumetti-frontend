import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  price: number;
  annoPubblicazione: number;
  isAvailable: boolean;
}

interface BookTableProps {
  books: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewBook: (book: Book) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (book: Book) => void;
  onSortChange: (column: string) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

const BookTable = ({
  books = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onViewBook = () => {},
  onEditBook = () => {},
  onDeleteBook = () => {},
  onSortChange = () => {},
  sortColumn = "title",
  sortDirection = "asc",
}: BookTableProps) => {
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("ellipsis");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle sort click
  const handleSortClick = (column: string) => {
    onSortChange(column);
  };

  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("title")}
              >
                Title{renderSortIndicator("title")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("author")}
              >
                Author{renderSortIndicator("author")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("genre")}
              >
                Genre{renderSortIndicator("genre")}
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSortClick("price")}
              >
                Price{renderSortIndicator("price")}
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => handleSortClick("annoPubblicazione")}
              >
                Year{renderSortIndicator("annoPubblicazione")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("isAvailable")}
              >
                Status{renderSortIndicator("isAvailable")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length > 0 ? (
              books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell className="text-right">
                    ${book.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {book.annoPubblicazione}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={book.isAvailable ? "default" : "destructive"}
                    >
                      {book.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewBook(book)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditBook(book)}
                        title="Edit book"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteBook(book)}
                        title="Delete book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground"
                >
                  No books found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${page}`}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => onPageChange(page as number)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BookTable;
