import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Heart, Loader2 } from "lucide-react";
import { Wishlist } from "@/types/Entities";
import { ApiService } from "@/services/api";

const WishlistManager: React.FC = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWishlist, setEditingWishlist] = useState<Wishlist | null>(null);
  const [formData, setFormData] = useState<Partial<Wishlist>>({
    dataCreazione: new Date().toISOString().split("T")[0],
    utenteId: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllWishlists();
      setWishlists(data);
    } catch (err) {
      setError("Errore nel caricamento delle wishlist");
      console.error("Error loading wishlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingWishlist) {
        await ApiService.updateWishlist(editingWishlist.wishlistId!, formData);
      } else {
        await ApiService.createWishlist(formData);
      }

      await loadWishlists();
      resetForm();
    } catch (err) {
      setError("Errore nel salvare la wishlist");
      console.error("Error saving wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dataCreazione: new Date().toISOString().split("T")[0],
      utenteId: 1,
    });
    setEditingWishlist(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (wishlist: Wishlist) => {
    setFormData(wishlist);
    setEditingWishlist(wishlist);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.deleteWishlist(id);
      await loadWishlists();
    } catch (err) {
      setError("Errore nell'eliminare la wishlist");
      console.error("Error deleting wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <CardTitle>Gestione Wishlist</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuova Wishlist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingWishlist ? "Modifica Wishlist" : "Nuova Wishlist"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="utenteId">ID Utente</Label>
                  <Input
                    id="utenteId"
                    type="number"
                    value={formData.utenteId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        utenteId: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dataCreazione">Data Creazione</Label>
                  <Input
                    id="dataCreazione"
                    type="date"
                    value={formData.dataCreazione || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataCreazione: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annulla
                  </Button>
                  <Button type="submit">
                    {editingWishlist ? "Aggiorna" : "Crea"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Caricamento...</span>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Utente ID</TableHead>
                <TableHead>Data Creazione</TableHead>
                <TableHead>Fumetti</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wishlists.map((wishlist) => (
                <TableRow key={wishlist.wishlistId}>
                  <TableCell>{wishlist.wishlistId}</TableCell>
                  <TableCell>{wishlist.utenteId}</TableCell>
                  <TableCell>{wishlist.dataCreazione}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {wishlist.fumetti && wishlist.fumetti.length > 0 ? (
                        wishlist.fumetti.slice(0, 3).map((fumetto, index) => (
                          <Badge
                            key={fumetto.fumettoId}
                            variant="outline"
                            className="text-xs"
                          >
                            {fumetto.titolo}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Nessun fumetto
                        </span>
                      )}
                      {wishlist.fumetti && wishlist.fumetti.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{wishlist.fumetti.length - 3} altri
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(wishlist)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(wishlist.wishlistId!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistManager;
