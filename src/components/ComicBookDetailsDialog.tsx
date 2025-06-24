import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ComicBook } from "@/types/ComicBook";
import {
  Calendar,
  DollarSign,
  User,
  Palette,
  Building,
  BookOpen,
  Hash,
  Layers,
} from "lucide-react";

interface ComicBookDetailsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  comicBook?: ComicBook | null;
}

const ComicBookDetailsDialog: React.FC<ComicBookDetailsDialogProps> = ({
  open = false,
  onOpenChange,
  comicBook = null,
}) => {
  if (!comicBook) return null;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "NEW":
      case "LIKE_NEW":
        return "bg-green-100 text-green-800";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {comicBook.title}
          </DialogTitle>
          {comicBook.series && (
            <p className="text-lg text-muted-foreground">
              {comicBook.series} #{comicBook.issueNumber}
            </p>
          )}
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
              {comicBook.imageUrl ? (
                <img
                  src={comicBook.imageUrl}
                  alt={comicBook.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 mx-auto mb-2" />
                    <p>No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={comicBook.isAvailable ? "default" : "destructive"}
                className="text-sm"
              >
                {comicBook.isAvailable ? "Available" : "Unavailable"}
              </Badge>
              <Badge
                className={`text-sm ${getConditionColor(comicBook.condition)}`}
              >
                {comicBook.condition.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {comicBook.genre}
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Price:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${comicBook.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Author:</span>
                <span>{comicBook.author}</span>
              </div>

              {comicBook.artist && (
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Artist:</span>
                  <span>{comicBook.artist}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Publisher:</span>
                <span>{comicBook.publisher}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Publication Year:</span>
                <span>{comicBook.annoPubblicazione}</span>
              </div>

              {comicBook.pageCount && (
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Pages:</span>
                  <span>{comicBook.pageCount}</span>
                </div>
              )}

              {comicBook.isbn && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">ISBN:</span>
                  <span className="font-mono text-sm">{comicBook.isbn}</span>
                </div>
              )}
            </div>

            {comicBook.description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comicBook.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComicBookDetailsDialog;
