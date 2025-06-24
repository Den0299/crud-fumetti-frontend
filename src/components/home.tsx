import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ComicBookTable from "./ComicBookTable";
import ComicSearchFilterPanel from "./ComicSearchFilterPanel";
import ComicBookFormDialog from "./ComicBookFormDialog";
import ComicStatisticsSection from "./ComicStatisticsSection";
import ComicBookDetailsDialog from "./ComicBookDetailsDialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ComicBook, FilterOptions } from "@/types/ComicBook";

const Home = () => {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentComicBook, setCurrentComicBook] = useState<ComicBook | null>(
    null,
  );
  const [comicBooks, setComicBooks] = useState<ComicBook[]>([]);
  const [filteredComicBooks, setFilteredComicBooks] = useState<ComicBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  const comicBooksPerPage = 10;
  const totalPages = Math.ceil(filteredComicBooks.length / comicBooksPerPage);
  const startIndex = (currentPage - 1) * comicBooksPerPage;
  const paginatedComicBooks = filteredComicBooks.slice(
    startIndex,
    startIndex + comicBooksPerPage,
  );

  // Fetch all comic books from API
  const fetchComicBooks = async (showToast = true) => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/fumetti/get-fumetti",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setComicBooks(data);
        setFilteredComicBooks(data);
        if (showToast) {
          toast({
            title: "✅ Data Loaded",
            description: `${data.length} comic books loaded successfully`,
          });
        }
      } else if (response.status === 503) {
        // Backend service unavailable
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Spring Boot backend is not running on port 8080",
        );
      } else {
        const errorText = await response
          .text()
          .catch(() => response.statusText);
        throw new Error(
          `API response error: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      // Check for specific error types
      const isNetworkError =
        error.name === "TypeError" ||
        error.message.includes("fetch") ||
        error.message.includes("NetworkError") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("ECONNREFUSED");

      let errorTitle = "🔌 Backend Not Connected";
      let errorDescription = "Spring Boot server is not running on port 8080";

      if (showToast) {
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        });
      }
      setComicBooks([]);
      setFilteredComicBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load comic books on component mount
  useEffect(() => {
    fetchComicBooks();
  }, []);

  const handleAddComicBook = () => {
    setCurrentComicBook(null);
    setIsFormDialogOpen(true);
  };

  // Generate statistics from comic books data
  const generateStats = () => {
    if (comicBooks.length === 0) {
      return {
        authorStats: [],
        publisherStats: [],
        genreStats: [],
        conditionStats: [],
        availabilityStats: { available: 0, unavailable: 0 },
      };
    }

    // Count by author
    const authorCounts = comicBooks.reduce(
      (acc, comic) => {
        acc[comic.author] = (acc[comic.author] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count by publisher
    const publisherCounts = comicBooks.reduce(
      (acc, comic) => {
        acc[comic.publisher] = (acc[comic.publisher] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count by genre
    const genreCounts = comicBooks.reduce(
      (acc, comic) => {
        acc[comic.genre] = (acc[comic.genre] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count by condition
    const conditionCounts = comicBooks.reduce(
      (acc, comic) => {
        acc[comic.condition] = (acc[comic.condition] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count availability
    const availabilityStats = comicBooks.reduce(
      (acc, comic) => {
        if (comic.isAvailable) {
          acc.available++;
        } else {
          acc.unavailable++;
        }
        return acc;
      },
      { available: 0, unavailable: 0 },
    );

    return {
      authorStats: Object.entries(authorCounts)
        .map(([author, count]) => ({ author, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      publisherStats: Object.entries(publisherCounts)
        .map(([publisher, count]) => ({ publisher, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      genreStats: Object.entries(genreCounts)
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      conditionStats: Object.entries(conditionCounts)
        .map(([condition, count]) => ({ condition, count }))
        .sort((a, b) => b.count - a.count),
      availabilityStats,
    };
  };

  const handleEditComicBook = (comicBook: ComicBook) => {
    setCurrentComicBook(comicBook);
    setIsFormDialogOpen(true);
  };

  const handleViewComicBook = (comicBook: ComicBook) => {
    setCurrentComicBook(comicBook);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteComicBook = async (comicBook: ComicBook) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/fumetti/delete-fumetto/${comicBook.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok || response.status === 204) {
        await fetchComicBooks(false); // Refresh the list without showing toast
        toast({
          title: "✅ Deleted",
          description: `"${comicBook.title}" deleted successfully`,
        });
      } else if (response.status === 503) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Backend service unavailable");
      } else {
        const errorText = await response
          .text()
          .catch(() => response.statusText);
        throw new Error(
          `Failed to delete comic book: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }
    } catch (error) {
      const isNetworkError =
        error.name === "TypeError" ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("fetch");
      const isBackendError =
        error.message.includes("Backend service") ||
        error.message.includes("BACKEND_UNAVAILABLE") ||
        isNetworkError;

      let errorTitle = "❌ Delete Failed";
      let errorDescription = "Failed to delete comic book";

      if (isBackendError) {
        errorTitle = "🔌 Backend Unavailable";
        errorDescription =
          "Cannot connect to backend server. Please ensure your Spring Boot server is running.";
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    }
  };

  const handleSaveComicBook = async (comicBookData: any) => {
    try {
      let response;
      if (currentComicBook?.id) {
        // Update existing comic book
        response = await fetch(
          `http://localhost:8080/api/fumetti/update-fumetto/${currentComicBook.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(comicBookData),
          },
        );
      } else {
        // Create new comic book
        response = await fetch(
          "http://localhost:8080/api/fumetti/create-fumetto",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(comicBookData),
          },
        );
      }

      if (response.ok) {
        await fetchComicBooks(false); // Refresh the list without showing toast
        setIsFormDialogOpen(false);
        toast({
          title: "✅ Saved",
          description: currentComicBook?.id
            ? `"${comicBookData.title}" updated successfully`
            : `"${comicBookData.title}" created successfully`,
        });
      } else if (response.status === 503) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Backend service unavailable");
      } else {
        const errorText = await response
          .text()
          .catch(() => response.statusText);
        throw new Error(
          `Failed to save comic book: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }
    } catch (error) {
      const isNetworkError =
        error.name === "TypeError" ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("fetch");
      const isBackendError =
        error.message.includes("Backend service") ||
        error.message.includes("BACKEND_UNAVAILABLE") ||
        isNetworkError;

      let errorTitle = "❌ Save Failed";
      let errorDescription = currentComicBook?.id
        ? "Failed to update comic book"
        : "Failed to create comic book";

      if (isBackendError) {
        errorTitle = "🔌 Backend Unavailable";
        errorDescription =
          "Cannot connect to backend server. Please ensure your Spring Boot server is running.";
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    }
  };

  const handleSearch = (filters: FilterOptions) => {
    let filtered = [...comicBooks];

    // Apply filters
    if (filters.title) {
      filtered = filtered.filter((comicBook) =>
        comicBook.title.toLowerCase().includes(filters.title.toLowerCase()),
      );
    }

    if (filters.author) {
      filtered = filtered.filter(
        (comicBook) => comicBook.author === filters.author,
      );
    }

    if (filters.artist) {
      filtered = filtered.filter(
        (comicBook) => comicBook.artist === filters.artist,
      );
    }

    if (filters.publisher) {
      filtered = filtered.filter(
        (comicBook) => comicBook.publisher === filters.publisher,
      );
    }

    if (filters.genre) {
      filtered = filtered.filter(
        (comicBook) => comicBook.genre === filters.genre,
      );
    }

    if (filters.condition) {
      filtered = filtered.filter(
        (comicBook) => comicBook.condition === filters.condition,
      );
    }

    filtered = filtered.filter(
      (comicBook) =>
        comicBook.price >= filters.priceRange[0] &&
        comicBook.price <= filters.priceRange[1],
    );

    filtered = filtered.filter(
      (comicBook) =>
        comicBook.annoPubblicazione >= filters.yearRange[0] &&
        comicBook.annoPubblicazione <= filters.yearRange[1],
    );

    if (filters.available) {
      filtered = filtered.filter((comicBook) => comicBook.isAvailable);
    }

    setFilteredComicBooks(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (column: string) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = [...filteredComicBooks].sort((a, b) => {
      let aValue = a[column as keyof ComicBook];
      let bValue = b[column as keyof ComicBook];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredComicBooks(sorted);
  };

  // Get unique values for filter options
  const uniqueAuthors = [...new Set(comicBooks.map((cb) => cb.author))].sort();
  const uniqueArtists = [
    ...new Set(comicBooks.map((cb) => cb.artist).filter(Boolean)),
  ].sort();
  const uniquePublishers = [
    ...new Set(comicBooks.map((cb) => cb.publisher)),
  ].sort();
  const uniqueGenres = [...new Set(comicBooks.map((cb) => cb.genre))].sort();

  if (loading) {
    return (
      <div className="container mx-auto py-8 bg-background">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading comic books...</div>
        </div>
      </div>
    );
  }

  // Show message when no backend connection and no data
  if (comicBooks.length === 0 && !loading) {
    return (
      <div className="container mx-auto py-8 bg-background">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Comic Book Store Management</h1>
          <Button
            onClick={handleAddComicBook}
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add New Comic Book
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🔌</div>
              <h2 className="text-xl font-semibold mb-2">
                Backend Server Required
              </h2>
              <p className="text-muted-foreground mb-4">
                To view and manage comic books, please start your Spring Boot
                backend server on{" "}
                <code className="bg-muted px-2 py-1 rounded">
                  localhost:8080
                </code>
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Quick Fix:</strong> Make sure your Spring Boot
                  application is running and accessible at http://localhost:8080
                </p>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Quick Start:</strong> Run your Spring Boot
                  application
                </p>
                <p className="text-sm text-muted-foreground">
                  📡 The frontend will automatically connect once the backend is
                  running
                </p>
              </div>
              <Button onClick={() => fetchComicBooks(true)} variant="outline">
                🔄 Retry Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        <Toaster />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-8">
        <div id="home" className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Comic Book Store Management</h1>
          <Button
            id="add-comic"
            onClick={handleAddComicBook}
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add New Comic Book
          </Button>
        </div>

        <Card id="search-filter" className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <ComicSearchFilterPanel
              onSearch={handleSearch}
              authors={uniqueAuthors}
              artists={uniqueArtists}
              publishers={uniquePublishers}
              genres={uniqueGenres}
            />
          </CardContent>
        </Card>

        <Card id="comic-listing" className="mb-6">
          <CardHeader>
            <CardTitle>
              Comic Book Listing ({filteredComicBooks.length} comic books)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ComicBookTable
              comicBooks={paginatedComicBooks}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onViewComicBook={handleViewComicBook}
              onEditComicBook={handleEditComicBook}
              onDeleteComicBook={handleDeleteComicBook}
              onSortChange={handleSortChange}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          </CardContent>
        </Card>

        <Card id="statistics">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ComicStatisticsSection stats={generateStats()} />
          </CardContent>
        </Card>
      </div>

      <ComicBookFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        comicBook={currentComicBook}
        mode={currentComicBook ? "edit" : "create"}
        onSubmit={handleSaveComicBook}
      />

      <ComicBookDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        comicBook={currentComicBook}
      />

      <Toaster />
    </div>
  );
};

export default Home;
