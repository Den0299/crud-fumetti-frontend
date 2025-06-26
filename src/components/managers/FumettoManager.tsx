import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, BookOpen, Loader2 } from "lucide-react";
import { Fumetto, CategoriaFumettoEnum } from "@/types/Entities";
import { ApiService } from "@/services/api";

const FumettoManager: React.FC = () => {
  const [fumetti, setFumetti] = useState<Fumetto[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFumetto, setEditingFumetto] = useState<Fumetto | null>(null);
  const [formData, setFormData] = useState<Partial<Fumetto>>({
    titolo: "",
    autore: "",
    editore: "",
    descrizione: "",
    dataPubblicazione: "",
    disponibilePerAsta: false,
    categoriaFumetto: "FANTASY",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFumetti();
  }, []);

  const loadFumetti = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllFumetti();
      setFumetti(data);
    } catch (err) {
      setError("Errore nel caricamento dei fumetti");
      console.error("Error loading fumetti:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingFumetto) {
        await ApiService.updateFumetto(editingFumetto.fumettoId!, formData);
      } else {
        await ApiService.createFumetto(formData);
      }

      await loadFumetti();
      resetForm();
    } catch (err) {
      setError("Errore nel salvare il fumetto");
      console.error("Error saving fumetto:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titolo: "",
      autore: "",
      editore: "",
      descrizione: "",
      dataPubblicazione: "",
      disponibilePerAsta: false,
      categoriaFumetto: "FANTASY",
    });
    setEditingFumetto(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (fumetto: Fumetto) => {
    setFormData(fumetto);
    setEditingFumetto(fumetto);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.deleteFumetto(id);
      await loadFumetti();
    } catch (err) {
      setError("Errore nell'eliminare il fumetto");
      console.error("Error deleting fumetto:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaBadgeColor = (categoria: CategoriaFumettoEnum) => {
    const colors = {
      FANTASY: "bg-purple-100 text-purple-800",
      FANTASCIENZA: "bg-blue-100 text-blue-800",
      HORROR: "bg-red-100 text-red-800",
      SUPEREROI: "bg-yellow-100 text-yellow-800",
      SPORTIVO: "bg-green-100 text-green-800",
      SCOLASTICO: "bg-gray-100 text-gray-800",
      ROMANTICO: "bg-pink-100 text-pink-800",
      AZIONE: "bg-orange-100 text-orange-800",
    };
    return colors[categoria] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle>Gestione Fumetti</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Fumetto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingFumetto ? "Modifica Fumetto" : "Nuovo Fumetto"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="titolo">Titolo</Label>
                  <Input
                    id="titolo"
                    value={formData.titolo || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, titolo: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="autore">Autore</Label>
                    <Input
                      id="autore"
                      value={formData.autore || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, autore: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editore">Editore</Label>
                    <Input
                      id="editore"
                      value={formData.editore || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, editore: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="descrizione">Descrizione</Label>
                  <Textarea
                    id="descrizione"
                    value={formData.descrizione || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, descrizione: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="dataPubblicazione">Data Pubblicazione</Label>
                  <Input
                    id="dataPubblicazione"
                    type="date"
                    value={formData.dataPubblicazione || ""}
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
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={formData.categoriaFumetto}
                    onValueChange={(value: CategoriaFumettoEnum) =>
                      setFormData({ ...formData, categoriaFumetto: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FANTASY">Fantasy</SelectItem>
                      <SelectItem value="FANTASCIENZA">Fantascienza</SelectItem>
                      <SelectItem value="HORROR">Horror</SelectItem>
                      <SelectItem value="SUPEREROI">Supereroi</SelectItem>
                      <SelectItem value="SPORTIVO">Sportivo</SelectItem>
                      <SelectItem value="SCOLASTICO">Scolastico</SelectItem>
                      <SelectItem value="ROMANTICO">Romantico</SelectItem>
                      <SelectItem value="AZIONE">Azione</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="disponibilePerAsta"
                    checked={formData.disponibilePerAsta || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, disponibilePerAsta: checked })
                    }
                  />
                  <Label htmlFor="disponibilePerAsta">
                    Disponibile per Asta
                  </Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annulla
                  </Button>
                  <Button type="submit">
                    {editingFumetto ? "Aggiorna" : "Crea"}
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
                <TableHead>Titolo</TableHead>
                <TableHead>Autore</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data Pubblicazione</TableHead>
                <TableHead>Asta</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fumetti.map((fumetto) => (
                <TableRow key={fumetto.fumettoId}>
                  <TableCell>{fumetto.fumettoId}</TableCell>
                  <TableCell className="font-medium">
                    {fumetto.titolo}
                  </TableCell>
                  <TableCell>{fumetto.autore}</TableCell>
                  <TableCell>
                    <Badge
                      className={getCategoriaBadgeColor(
                        fumetto.categoriaFumetto,
                      )}
                    >
                      {fumetto.categoriaFumetto}
                    </Badge>
                  </TableCell>
                  <TableCell>{fumetto.dataPubblicazione}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        fumetto.disponibilePerAsta ? "default" : "secondary"
                      }
                    >
                      {fumetto.disponibilePerAsta ? "Sì" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(fumetto)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(fumetto.fumettoId!)}
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

export default FumettoManager;
