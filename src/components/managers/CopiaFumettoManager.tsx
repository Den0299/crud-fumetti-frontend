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
import { Plus, Edit, Trash2, Package, Loader2 } from "lucide-react";
import { CopiaFumetto, StatoCopiaFumettoEnum } from "@/types/Entities";
import { ApiService } from "@/services/api";

const CopiaFumettoManager: React.FC = () => {
  const [copie, setCopie] = useState<CopiaFumetto[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCopia, setEditingCopia] = useState<CopiaFumetto | null>(null);
  const [formData, setFormData] = useState<Partial<CopiaFumetto>>({
    statoCopiaFumetto: "NUOVO",
    prezzo: 0,
    disponibile: true,
    fumettoId: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCopie();
  }, []);

  const loadCopie = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllCopieFumetto();
      setCopie(data);
    } catch (err) {
      setError("Errore nel caricamento delle copie fumetto");
      console.error("Error loading copie fumetto:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingCopia) {
        await ApiService.updateCopiaFumetto(
          editingCopia.copiaFumettoId!,
          formData,
        );
      } else {
        await ApiService.createCopiaFumetto(formData);
      }

      await loadCopie();
      resetForm();
    } catch (err) {
      setError("Errore nel salvare la copia fumetto");
      console.error("Error saving copia fumetto:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      statoCopiaFumetto: "NUOVO",
      prezzo: 0,
      disponibile: true,
      fumettoId: 1,
    });
    setEditingCopia(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (copia: CopiaFumetto) => {
    setFormData(copia);
    setEditingCopia(copia);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.deleteCopiaFumetto(id);
      await loadCopie();
    } catch (err) {
      setError("Errore nell'eliminare la copia fumetto");
      console.error("Error deleting copia fumetto:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatoBadgeColor = (stato: StatoCopiaFumettoEnum) => {
    return stato === "NUOVO"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="space-y-6 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Gestione Copie Fumetti</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuova Copia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCopia ? "Modifica Copia" : "Nuova Copia"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fumettoId">ID Fumetto</Label>
                  <Input
                    id="fumettoId"
                    type="number"
                    value={formData.fumettoId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fumettoId: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stato">Stato</Label>
                  <Select
                    value={formData.statoCopiaFumetto}
                    onValueChange={(value: StatoCopiaFumettoEnum) =>
                      setFormData({ ...formData, statoCopiaFumetto: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NUOVO">Nuovo</SelectItem>
                      <SelectItem value="USATO">Usato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prezzo">Prezzo (€)</Label>
                  <Input
                    id="prezzo"
                    type="number"
                    step="0.01"
                    value={formData.prezzo || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prezzo: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="disponibile"
                    checked={formData.disponibile || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, disponibile: checked })
                    }
                  />
                  <Label htmlFor="disponibile">Disponibile</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annulla
                  </Button>
                  <Button type="submit">
                    {editingCopia ? "Aggiorna" : "Crea"}
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
                <TableHead>Fumetto</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Prezzo</TableHead>
                <TableHead>Disponibile</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {copie.map((copia) => (
                <TableRow key={copia.copiaFumettoId}>
                  <TableCell>{copia.copiaFumettoId}</TableCell>
                  <TableCell className="font-medium">
                    {copia.fumetto?.titolo || `Fumetto ID: ${copia.fumettoId}`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatoBadgeColor(copia.statoCopiaFumetto)}
                    >
                      {copia.statoCopiaFumetto}
                    </Badge>
                  </TableCell>
                  <TableCell>€{copia.prezzo.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={copia.disponibile ? "default" : "secondary"}
                    >
                      {copia.disponibile ? "Sì" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(copia)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(copia.copiaFumettoId!)}
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

export default CopiaFumettoManager;
