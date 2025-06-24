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

const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.string().min(1, "Genre is required"),
  price: z.coerce.number().positive("Price must be positive"),
  annoPubblicazione: z.coerce
    .number()
    .int()
    .min(1000, "Year must be valid")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  isAvailable: z.boolean().default(true),
  description: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  book?: any;
  mode?: "create" | "edit";
  onSubmit?: (data: BookFormValues) => Promise<void>;
}

const BookFormDialog: React.FC<BookFormDialogProps> = ({
  open = true,
  onOpenChange,
  book = {
    title: "",
    author: "",
    genre: "",
    price: 0,
    annoPubblicazione: new Date().getFullYear(),
    isAvailable: true,
    description: "",
  },
  mode = "create",
  onSubmit = async () => {},
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: book || {
      title: "",
      author: "",
      genre: "",
      price: 0,
      annoPubblicazione: new Date().getFullYear(),
      isAvailable: true,
      description: "",
    },
  });

  const isAvailable = watch("isAvailable");

  const genreOptions = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Romance",
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Technology",
  ];

  const onFormSubmit = async (data: BookFormValues) => {
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
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Book" : "Edit Book"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to add a new book to the library."
              : "Update the book information in the form below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter book title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                {...register("author")}
                placeholder="Enter author name"
                className={errors.author ? "border-red-500" : ""}
              />
              {errors.author && (
                <p className="text-xs text-red-500">{errors.author.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="genre">Genre</Label>
              <Select
                onValueChange={(value) => setValue("genre", value)}
                defaultValue={book?.genre || ""}
                value={watch("genre") || ""}
              >
                <SelectTrigger className={errors.genre ? "border-red-500" : ""}>
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

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={isAvailable}
                onCheckedChange={(checked) => setValue("isAvailable", checked)}
              />
              <Label htmlFor="isAvailable">Available for borrowing</Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter book description"
                rows={3}
              />
            </div>
          </div>

          {submitStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {mode === "create"
                  ? "Book added successfully!"
                  : "Book updated successfully!"}
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
                  ? "Add Book"
                  : "Update Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookFormDialog;
