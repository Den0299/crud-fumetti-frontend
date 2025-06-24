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
import { FilterOptions } from "@/types/ComicBook";

interface ComicSearchFilterPanelProps {
  onSearch: (filters: FilterOptions) => void;
  authors?: string[];
  artists?: string[];
  publishers?: string[];
  genres?: string[];
}

const ComicSearchFilterPanel: React.FC<ComicSearchFilterPanelProps> = ({
  onSearch = () => {},
  authors = [
    "Stan Lee",
    "Jack Kirby",
    "Steve Ditko",
    "Bob Kane",
    "Bill Finger",
    "Jerry Siegel",
    "Joe Shuster",
  ],
  artists = [
    "Jack Kirby",
    "Steve Ditko",
    "John Romita Sr.",
    "Neal Adams",
    "Jim Lee",
    "Todd McFarlane",
  ],
  publishers = [
    "Marvel Comics",
    "DC Comics",
    "Image Comics",
    "Dark Horse Comics",
    "IDW Publishing",
    "Vertigo",
  ],
  genres = [
    "Superhero",
    "Horror",
    "Science Fiction",
    "Fantasy",
    "Crime",
    "Romance",
    "Western",
    "Comedy",
  ],
}) => {
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<FilterOptions>({
    title: "",
    author: "",
    artist: "",
    publisher: "",
    genre: "",
    condition: "",
    priceRange: [0, 100],
    yearRange: [1930, currentYear],
    available: false,
  });

  const conditionOptions = [
    "NEW",
    "LIKE_NEW",
    "VERY_FINE",
    "FINE",
    "VERY_GOOD",
    "GOOD",
    "FAIR",
    "POOR",
  ];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, title: e.target.value });
  };

  const handleAuthorChange = (value: string) => {
    setFilters({ ...filters, author: value === "all" ? "" : value });
  };

  const handleArtistChange = (value: string) => {
    setFilters({ ...filters, artist: value === "all" ? "" : value });
  };

  const handlePublisherChange = (value: string) => {
    setFilters({ ...filters, publisher: value === "all" ? "" : value });
  };

  const handleGenreChange = (value: string) => {
    setFilters({ ...filters, genre: value === "all" ? "" : value });
  };

  const handleConditionChange = (value: string) => {
    setFilters({ ...filters, condition: value === "all" ? "" : value });
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
      artist: "",
      publisher: "",
      genre: "",
      condition: "",
      priceRange: [0, 100],
      yearRange: [1930, currentYear],
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
          <div className="w-full md:w-48">
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
                  <SelectItem key={`author-${author}`} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Artist Filter */}
          <div className="w-full md:w-48">
            <Select
              value={filters.artist || "all"}
              onValueChange={handleArtistChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Artist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Artists</SelectItem>
                {artists.map((artist) => (
                  <SelectItem key={`artist-${artist}`} value={artist}>
                    {artist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Publisher Filter */}
          <div className="w-full md:w-48">
            <Select
              value={filters.publisher || "all"}
              onValueChange={handlePublisherChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Publisher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Publishers</SelectItem>
                {publishers.map((publisher) => (
                  <SelectItem key={`publisher-${publisher}`} value={publisher}>
                    {publisher}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Genre Filter */}
          <div className="w-full md:w-48">
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
                  <SelectItem key={`genre-${genre}`} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition Filter */}
          <div className="w-full md:w-48">
            <Select
              value={filters.condition || "all"}
              onValueChange={handleConditionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {conditionOptions.map((condition) => (
                  <SelectItem key={`condition-${condition}`} value={condition}>
                    {condition.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              max={200}
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
              min={1930}
              max={currentYear}
              step={1}
              value={[filters.yearRange[0], filters.yearRange[1]]}
              onValueChange={handleYearRangeChange}
              className="mb-4"
            />
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

export default ComicSearchFilterPanel;
