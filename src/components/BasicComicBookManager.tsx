import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Basic interface based on Java model
interface BasicComicBook {
  fumettoId?: number;
  titolo: string;
  autore: string;
  editore: string;
  descrizione?: string;
  dataPubblicazione: string;
  disponibilePerAsta: boolean;
  categoriaFumetto:
    | "FANTASY"
    | "FANTASCIENZA"
    | "HORROR"
    | "SUPEREROI"
    | "SPORTIVO"
    | "SCOLASTICO"
    | "ROMANTICO"
    | "AZIONE";
}

interface BasicCopiaFumetto {
  copiaFumettoId?: number;
  statoCopiaFumetto: "NUOVO" | "USATO";
  prezzo: number;
  disponibile: boolean;
  fumetto?: BasicComicBook;
}

const BasicComicBookManager = () => {
  const [comicBooks, setComicBooks] = useState<BasicComicBook[]>([]);
  const [copies, setCopies] = useState<BasicCopiaFumetto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<BasicComicBook | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<BasicComicBook>({
    titolo: "",
    autore: "",
    editore: "",
    descrizione: "",
    dataPubblicazione: new Date().toISOString().split("T")[0],
    disponibilePerAsta: false,
    categoriaFumetto: "FANTASY",
  });

  const categories = [
    "FANTASY",
    "FANTASCIENZA",
    "HORROR",
    "SUPEREROI",
    "SPORTIVO",
    "SCOLASTICO",
    "ROMANTICO",
    "AZIONE",
  ];

  // Test API connection
  const testConnection = async () => {
    setLoading(true);
    try {
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
        toast({
          title: "✅ Connection Successful",
          description: `Loaded ${data.length} comic books from backend`,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      toast({
        title: "❌ Connection Failed",
        description:
          "Make sure Spring Boot server is running on localhost:8080",
        variant: "destructive",
      });
      // Add sample data for testing UI
      const sampleData: BasicComicBook[] = [
        {
          fumettoId: 1,
          titolo: "Spider-Man #1",
          autore: "Stan Lee",
          editore: "Marvel Comics",
          descrizione: "The amazing Spider-Man first issue",
          dataPubblicazione: "1963-03-01",
          disponibilePerAsta: true,
          categoriaFumetto: "SUPEREROI",
        },
        {
          fumettoId: 2,
          titolo: "Batman: Year One",
          autore: "Frank Miller",
          editore: "DC Comics",
          descrizione: "Batman's origin story retold",
          dataPubblicazione: "1987-01-01",
          disponibilePerAsta: false,
          categoriaFumetto: "SUPEREROI",
        },
      ];
      setComicBooks(sampleData);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    testConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingBook
        ? `http://localhost:8080/api/fumetti/update-fumetto/${editingBook.fumettoId}`
        : "http://localhost:8080/api/fumetti/create-fumetto";

      const method = editingBook ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "✅ Success",
          description: editingBook
            ? "Comic book updated"
            : "Comic book created",
        });
        setShowForm(false);
        setEditingBook(null);
        resetForm();
        testConnection(); // Refresh data
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to save comic book. Check backend connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (book: BasicComicBook) => {
    if (!confirm(`Delete "${book.titolo}"?`)) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/fumetti/delete-fumetto/${book.fumettoId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok || response.status === 204) {
        toast({
          title: "✅ Deleted",
          description: `"${book.titolo}" deleted successfully`,
        });
        testConnection(); // Refresh data
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to delete comic book",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: BasicComicBook) => {
    setEditingBook(book);
    setFormData({ ...book });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      titolo: "",
      autore: "",
      editore: "",
      descrizione: "",
      dataPubblicazione: new Date().toISOString().split("T")[0],
      disponibilePerAsta: false,
      categoriaFumetto: "FANTASY",
    });
  };

  const handleAddNew = () => {
    setEditingBook(null);
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Basic Comic Book Manager</h1>
          <div className="flex gap-2">
            <Button
              onClick={testConnection}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Test API
            </Button>
            <Button onClick={handleAddNew}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Comic Book
            </Button>
          </div>
        </div>

        {/* API Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Backend URL:</strong> http://localhost:8080
              </p>
              <p>
                <strong>Endpoint:</strong> /api/fumetti/get-fumetti
              </p>
              <p>
                <strong>Status:</strong> {loading ? "Testing..." : "Ready"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingBook ? "Edit Comic Book" : "Add New Comic Book"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titolo">Title (Titolo)</Label>
                    <Input
                      id="titolo"
                      value={formData.titolo}
                      onChange={(e) =>
                        setFormData({ ...formData, titolo: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="autore">Author (Autore)</Label>
                    <Input
                      id="autore"
                      value={formData.autore}
                      onChange={(e) =>
                        setFormData({ ...formData, autore: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editore">Publisher (Editore)</Label>
                    <Input
                      id="editore"
                      value={formData.editore}
                      onChange={(e) =>
                        setFormData({ ...formData, editore: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataPubblicazione">Publication Date</Label>
                    <Input
                      id="dataPubblicazione"
                      type="date"
                      value={formData.dataPubblicazione}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataPubblicazione: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoriaFumetto">Category</Label>
                    <Select
                      value={formData.categoriaFumetto}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          categoriaFumetto: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="disponibilePerAsta"
                      checked={formData.disponibilePerAsta}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          disponibilePerAsta: e.target.checked,
                        })
                      }
                    />
                    <Label htmlFor="disponibilePerAsta">
                      Available for Auction
                    </Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="descrizione">Description</Label>
                  <Textarea
                    id="descrizione"
                    value={formData.descrizione || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, descrizione: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingBook ? "Update" : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Comic Books List */}
        <Card>
          <CardHeader>
            <CardTitle>Comic Books ({comicBooks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {comicBooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comic books found. Add some or check your backend connection.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comicBooks.map((book) => (
                  <Card key={book.fumettoId} className="border">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{book.titolo}</h3>
                        <p className="text-sm text-muted-foreground">
                          by {book.autore}
                        </p>
                        <p className="text-sm">
                          <strong>Publisher:</strong> {book.editore}
                        </p>
                        <p className="text-sm">
                          <strong>Date:</strong> {book.dataPubblicazione}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary">
                            {book.categoriaFumetto}
                          </Badge>
                          {book.disponibilePerAsta && (
                            <Badge variant="outline">Auction Available</Badge>
                          )}
                        </div>
                        {book.descrizione && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {book.descrizione}
                          </p>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(book)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(book)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default BasicComicBookManager;
