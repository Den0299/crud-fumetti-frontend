import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { User, Building, PieChart, BookOpen, Palette } from "lucide-react";
import { ComicBookStats } from "@/types/ComicBook";

interface ComicStatisticsSectionProps {
  stats: ComicBookStats;
}

const ComicStatisticsSection: React.FC<ComicStatisticsSectionProps> = ({
  stats = {
    authorStats: [
      { author: "Stan Lee", count: 15 },
      { author: "Frank Miller", count: 12 },
      { author: "Alan Moore", count: 8 },
      { author: "Neil Gaiman", count: 6 },
    ],
    publisherStats: [
      { publisher: "Marvel Comics", count: 25 },
      { publisher: "DC Comics", count: 20 },
      { publisher: "Image Comics", count: 10 },
      { publisher: "Dark Horse Comics", count: 8 },
    ],
    genreStats: [
      { genre: "Superhero", count: 30 },
      { genre: "Horror", count: 15 },
      { genre: "Science Fiction", count: 12 },
      { genre: "Fantasy", count: 8 },
    ],
    conditionStats: [
      { condition: "NEW", count: 20 },
      { condition: "LIKE_NEW", count: 15 },
      { condition: "VERY_FINE", count: 12 },
      { condition: "FINE", count: 8 },
      { condition: "VERY_GOOD", count: 6 },
      { condition: "GOOD", count: 4 },
      { condition: "FAIR", count: 2 },
      { condition: "POOR", count: 1 },
    ],
    availabilityStats: { available: 45, unavailable: 23 },
  },
}) => {
  const totalComics =
    stats.availabilityStats.available + stats.availabilityStats.unavailable;
  const availablePercentage = totalComics
    ? Math.round((stats.availabilityStats.available / totalComics) * 100)
    : 0;

  return (
    <div className="bg-white p-6">
      <h2 className="text-2xl font-bold mb-6">Comic Book Statistics</h2>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Comics by Author */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Authors</CardTitle>
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.authorStats.length > 0 ? (
                stats.authorStats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {stat.author}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stat.count}
                      </span>
                    </div>
                    <Progress
                      value={
                        (stat.count /
                          Math.max(...stats.authorStats.map((s) => s.count))) *
                        100
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comics by Publisher */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Publishers</CardTitle>
              <Building className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.publisherStats.length > 0 ? (
                stats.publisherStats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {stat.publisher}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stat.count}
                      </span>
                    </div>
                    <Progress
                      value={
                        (stat.count /
                          Math.max(
                            ...stats.publisherStats.map((s) => s.count),
                          )) *
                        100
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comics by Genre */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Genres</CardTitle>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.genreStats.length > 0 ? (
                stats.genreStats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {stat.genre}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stat.count}
                      </span>
                    </div>
                    <Progress
                      value={
                        (stat.count /
                          Math.max(...stats.genreStats.map((s) => s.count))) *
                        100
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Availability Status */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Availability</CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {availablePercentage}%
                </div>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Available:</span>
                  <span className="font-medium text-green-600">
                    {stats.availabilityStats.available}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unavailable:</span>
                  <span className="font-medium text-red-600">
                    {stats.availabilityStats.unavailable}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>{totalComics}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Condition Statistics */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Condition Distribution</CardTitle>
              <Palette className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.conditionStats.length > 0 ? (
                stats.conditionStats.map((stat, index) => {
                  const getConditionColor = (condition: string) => {
                    switch (condition) {
                      case "NEW":
                      case "LIKE_NEW":
                        return "text-green-600 bg-green-50 border-green-200";
                      case "VERY_FINE":
                      case "FINE":
                        return "text-blue-600 bg-blue-50 border-blue-200";
                      case "VERY_GOOD":
                      case "GOOD":
                        return "text-yellow-600 bg-yellow-50 border-yellow-200";
                      case "FAIR":
                      case "POOR":
                        return "text-red-600 bg-red-50 border-red-200";
                      default:
                        return "text-gray-600 bg-gray-50 border-gray-200";
                    }
                  };

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 text-center ${getConditionColor(
                        stat.condition,
                      )}`}
                    >
                      <div className="text-2xl font-bold">{stat.count}</div>
                      <div className="text-sm font-medium">
                        {stat.condition.replace("_", " ")}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">
                    No condition data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComicStatisticsSection;
