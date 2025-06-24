import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ComicBook } from "@/types/ComicBook";

const comicBookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  artist: z.string().optional(),
  publisher: z.string().min(1, "Publisher is required"),
  genre: z.string().min(1, "Genre is required"),
  price: z.coerce.number().positive("Price must be positive"),
  annoPubblicazione: z.coerce
    .number()
    .int()
    .min(1930, "Year must be valid")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  isAvailable: z.boolean().default(true),
  condition: z.enum([
    "NEW",
    "LIKE_NEW",
    "VERY_FINE",
    "FINE",
    "VERY_GOOD",
    "GOOD",
    "FAIR",
    "POOR",
  ]),
  imageUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  issueNumber: z.coerce.number().int().positive().optional(),
  series: z.string().optional(),
  isbn: z.string().optional(),
  pageCount: z.coerce.number().int().positive().optional(),
});

type ComicBookFormValues = z.infer<typeof comicBookFormSchema>;

interface ComicBookFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  comicBook?: ComicBook | null;
  mode?: "create" | "edit";
  onSubmit?: (data: ComicBookFormValues) => Promise<void>;
}

const ComicBookFormDialog: React.FC<ComicBookFormDialogProps> = ({
  open = true,
  onOpenChange,
  comicBook = null,
  mode = "create",
  onSubmit = async () => {},
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const defaultValues = {
    title: "",
    author: "",
    artist: "",
    publisher: "",
    genre: "",
    price: 0,
    annoPubblicazione: new Date().getFullYear(),
    isAvailable: true,
    condition: "VERY_FINE" as const,
    imageUrl: "",
    description: "",
    issueNumber: undefined,
    series: "",
    isbn: "",
    pageCount: undefined,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ComicBookFormValues>({
    resolver: zodResolver(comicBookFormSchema),
    defaultValues: comicBook || defaultValues,
  });

  const isAvailable = watch("isAvailable");
  const selectedCondition = watch("condition");
  const selectedGenre = watch("genre");

  const genreOptions = [
    "Superhero",
    "Horror",
    "Science Fiction",
    "Fantasy",
    "Crime",
    "Romance",
    "Western",
    "Comedy",
    "Drama",
    "Action",
    "Adventure",
    "Mystery",
  ];

  const conditionOptions = [
    { value: "NEW", label: "New" },
    { value: "LIKE_NEW", label: "Like New" },
    { value: "VERY_FINE", label: "Very Fine" },
    { value: "FINE", label: "Fine" },
    { value: "VERY_GOOD", label: "Very Good" },
    { value: "GOOD", label: "Good" },
    { value: "FAIR", label: "Fair" },
    { value: "POOR", label: "Poor" },
  ];

  const onFormSubmit = async (data: ComicBookFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      await onSubmit(data);
      setSubmitStatus("success");
      setTimeout(() => {
        if (mode === "create") {
          reset();
        }
        if (onOpenChange) {
          onOpenChange(false);
        }
      }, 1500);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Comic Book" : "Edit Comic Book"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to add a new comic book to the store."
              : "Update the comic book information in the form below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter comic book title"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="series">Series</Label>
                <Input
                  id="series"
                  {...register("series")}
                  placeholder="Enter series name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  {...register("author")}
                  placeholder="Enter author name"
                  className={errors.author ? "border-red-500" : ""}
                />
                {errors.author && (
                  <p className="text-xs text-red-500">
                    {errors.author.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  {...register("artist")}
                  placeholder="Enter artist name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  {...register("publisher")}
                  placeholder="Enter publisher name"
                  className={errors.publisher ? "border-red-500" : ""}
                />
                {errors.publisher && (
                  <p className="text-xs text-red-500">
                    {errors.publisher.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Select
                  onValueChange={(value) => setValue("genre", value)}
                  defaultValue={comicBook?.genre || ""}
                  value={selectedGenre || ""}
                >
                  <SelectTrigger
                    className={errors.genre ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genreOptions.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genre && (
                  <p className="text-xs text-red-500">{errors.genre.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price")}
                  placeholder="0.00"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="annoPubblicazione">Publication Year</Label>
                <Input
                  id="annoPubblicazione"
                  type="number"
                  {...register("annoPubblicazione")}
                  placeholder="2023"
                  className={errors.annoPubblicazione ? "border-red-500" : ""}
                />
                {errors.annoPubblicazione && (
                  <p className="text-xs text-red-500">
                    {errors.annoPubblicazione.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="issueNumber">Issue Number</Label>
                <Input
                  id="issueNumber"
                  type="number"
                  {...register("issueNumber")}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  onValueChange={(value) => setValue("condition", value as any)}
                  defaultValue={comicBook?.condition || "VERY_FINE"}
                  value={selectedCondition || "VERY_FINE"}
                >
                  <SelectTrigger
                    className={errors.condition ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && (
                  <p className="text-xs text-red-500">
                    {errors.condition.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pageCount">Page Count</Label>
                <Input
                  id="pageCount"
                  type="number"
                  {...register("pageCount")}
                  placeholder="24"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className={errors.imageUrl ? "border-red-500" : ""}
              />
              {errors.imageUrl && (
                <p className="text-xs text-red-500">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN (Optional)</Label>
              <Input
                id="isbn"
                {...register("isbn")}
                placeholder="978-0-123456-78-9"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={isAvailable}
                onCheckedChange={(checked) => setValue("isAvailable", checked)}
              />
              <Label htmlFor="isAvailable">Available for purchase</Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter comic book description"
                rows={3}
              />
            </div>
          </div>

          {submitStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {mode === "create"
                  ? "Comic book added successfully!"
                  : "Comic book updated successfully!"}
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                {errorMessage || "An error occurred. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange && onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Add Comic Book"
                  : "Update Comic Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComicBookFormDialog;
