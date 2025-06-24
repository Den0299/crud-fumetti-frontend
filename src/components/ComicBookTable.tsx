import React from "react";
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
import { ComicBook } from "@/types/ComicBook";

interface ComicBookTableProps {
  comicBooks: ComicBook[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewComicBook: (comicBook: ComicBook) => void;
  onEditComicBook: (comicBook: ComicBook) => void;
  onDeleteComicBook: (comicBook: ComicBook) => void;
  onSortChange: (column: string) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

const ComicBookTable = ({
  comicBooks = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onViewComicBook = () => {},
  onEditComicBook = () => {},
  onDeleteComicBook = () => {},
  onSortChange = () => {},
  sortColumn = "title",
  sortDirection = "asc",
}: ComicBookTableProps) => {
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pages.push("ellipsis");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handleSortClick = (column: string) => {
    onSortChange(column);
  };

  const renderSortIndicator = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  const getConditionColor = (condition?: string) => {
    if (!condition) return "bg-gray-100 text-gray-800";

    switch (condition) {
      case "NUOVO":
      case "NEW":
      case "LIKE_NEW":
        return "bg-green-100 text-green-800";
      case "USATO":
      case "VERY_FINE":
      case "FINE":
        return "bg-blue-100 text-blue-800";
      case "VERY_GOOD":
      case "GOOD":
        return "bg-yellow-100 text-yellow-800";
      case "FAIR":
      case "POOR":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
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
                onClick={() => handleSortClick("artist")}
              >
                Artist{renderSortIndicator("artist")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortClick("publisher")}
              >
                Publisher{renderSortIndicator("publisher")}
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
                onClick={() => handleSortClick("condition")}
              >
                Condition{renderSortIndicator("condition")}
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
            {comicBooks.length > 0 ? (
              comicBooks.map((comicBook) => (
                <TableRow key={comicBook.id}>
                  <TableCell>
                    <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden">
                      {comicBook.imageUrl ? (
                        <img
                          src={comicBook.imageUrl}
                          alt={comicBook.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{comicBook.title}</div>
                      {comicBook.series && (
                        <div className="text-sm text-gray-500">
                          {comicBook.series} #{comicBook.issueNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{comicBook.author}</TableCell>
                  <TableCell>{comicBook.artist || "N/A"}</TableCell>
                  <TableCell>{comicBook.publisher}</TableCell>
                  <TableCell>{comicBook.genre}</TableCell>
                  <TableCell className="text-right">
                    ${comicBook.price ? comicBook.price.toFixed(2) : "0.00"}
                  </TableCell>
                  <TableCell className="text-right">
                    {comicBook.annoPubblicazione}
                  </TableCell>
                  <TableCell>
                    <Badge className={getConditionColor(comicBook.condition)}>
                      {comicBook.condition
                        ? comicBook.condition.replace("_", " ")
                        : "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        comicBook.isAvailable ? "default" : "destructive"
                      }
                    >
                      {comicBook.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewComicBook(comicBook)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditComicBook(comicBook)}
                        title="Edit comic book"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteComicBook(comicBook)}
                        title="Delete comic book"
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
                  colSpan={11}
                  className="text-center py-10 text-muted-foreground"
                >
                  No comic books found
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

export default ComicBookTable;
