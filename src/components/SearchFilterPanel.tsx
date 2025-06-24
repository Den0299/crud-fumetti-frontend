import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface SearchFilterPanelProps {
  onSearch: (filters: FilterOptions) => void;
  authors?: string[];
  genres?: string[];
}

interface FilterOptions {
  title: string;
  author: string;
  genre: string;
  priceRange: [number, number];
  yearRange: [number, number];
  available: boolean;
}

const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  onSearch = () => {},
  authors = [
    "J.K. Rowling",
    "George Orwell",
    "Jane Austen",
    "Stephen King",
    "F. Scott Fitzgerald",
  ],
  genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
    "Biography",
  ],
}) => {
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<FilterOptions>({
    title: "",
    author: "",
    genre: "",
    priceRange: [0, 100],
    yearRange: [1900, currentYear],
    available: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, title: e.target.value });
  };

  const handleAuthorChange = (value: string) => {
    setFilters({ ...filters, author: value === "all" ? "" : value });
  };

  const handleGenreChange = (value: string) => {
    setFilters({ ...filters, genre: value === "all" ? "" : value });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const handleYearRangeChange = (value: number[]) => {
    setFilters({
      ...filters,
      yearRange: [value[0], value[1]] as [number, number],
    });
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setFilters({ ...filters, available: checked });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      title: "",
      author: "",
      genre: "",
      priceRange: [0, 100],
      yearRange: [1900, currentYear],
      available: false,
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <Card className="w-full p-4 bg-white shadow-sm">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Title Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="Search by title..."
              value={filters.title}
              onChange={handleTitleChange}
              className="pl-10"
            />
          </div>

          {/* Author Filter */}
          <div className="w-full md:w-64">
            <Select
              value={filters.author || "all"}
              onValueChange={handleAuthorChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Genre Filter */}
          <div className="w-full md:w-64">
            <Select
              value={filters.genre || "all"}
              onValueChange={handleGenreChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Price Range Filter */}
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <Label>
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Label>
            </div>
            <Slider
              defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
              max={100}
              step={1}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={handlePriceRangeChange}
              className="mb-4"
            />
          </div>

          {/* Publication Year Filter */}
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <Label>
                Publication Year: {filters.yearRange[0]} -{" "}
                {filters.yearRange[1]}
              </Label>
            </div>
            <Slider
              defaultValue={[filters.yearRange[0], filters.yearRange[1]]}
              min={1900}
              max={currentYear}
              step={1}
              value={[filters.yearRange[0], filters.yearRange[1]]}
              onValueChange={handleYearRangeChange}
              className="mb-4"
            />
          </div>

          {/* Availability Filter */}
          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={filters.available}
              onCheckedChange={handleAvailabilityChange}
            />
            <Label htmlFor="available">Available Only</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <Button onClick={handleSearch}>Apply Filters</Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchFilterPanel;
