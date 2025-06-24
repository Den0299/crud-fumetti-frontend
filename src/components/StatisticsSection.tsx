import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { PieChart, BarChart2, BookOpen } from "lucide-react";

interface StatisticsSectionProps {
  authorStats?: Array<{ author: string; count: number }>;
  genreStats?: Array<{ genre: string; count: number }>;
  availabilityStats?: { available: number; unavailable: number };
}

const StatisticsSection = ({
  authorStats = [
    { author: "J.K. Rowling", count: 7 },
    { author: "George Orwell", count: 5 },
    { author: "Jane Austen", count: 4 },
    { author: "Stephen King", count: 8 },
  ],
  genreStats = [
    { genre: "Fiction", count: 25 },
    { genre: "Science Fiction", count: 15 },
    { genre: "Mystery", count: 12 },
    { genre: "Biography", count: 8 },
  ],
  availabilityStats = { available: 42, unavailable: 18 },
}: StatisticsSectionProps) => {
  const totalBooks =
    availabilityStats.available + availabilityStats.unavailable;
  const availablePercentage = Math.round(
    (availabilityStats.available / totalBooks) * 100,
  );

  return (
    <div className="w-full bg-background p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Library Statistics</h2>
        <p className="text-muted-foreground">Overview of the book collection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Books by Author */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Books by Author</CardTitle>
              <BarChart2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {authorStats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stat.author}</span>
                    <span className="text-sm text-muted-foreground">
                      {stat.count}
                    </span>
                  </div>
                  <Progress
                    value={
                      (stat.count /
                        Math.max(...authorStats.map((s) => s.count))) *
                      100
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Books by Genre */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Books by Genre</CardTitle>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {genreStats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stat.genre}</span>
                    <span className="text-sm text-muted-foreground">
                      {stat.count}
                    </span>
                  </div>
                  <Progress
                    value={
                      (stat.count /
                        Math.max(...genreStats.map((s) => s.count))) *
                      100
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Availability Status */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Availability Status</CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-32 h-32 relative rounded-full flex items-center justify-center border-8 border-primary">
                <div className="text-3xl font-bold">{availablePercentage}%</div>
              </div>
              <div className="mt-6 w-full space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <span className="text-sm font-medium">
                    {availabilityStats.available}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                    <span className="text-sm">Unavailable</span>
                  </div>
                  <span className="text-sm font-medium">
                    {availabilityStats.unavailable}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-sm font-medium">{totalBooks}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsSection;
