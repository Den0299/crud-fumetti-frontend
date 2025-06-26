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
import { Plus, Edit, Trash2, Gavel, Loader2 } from "lucide-react";
import { Asta, StatoAstaEnum } from "@/types/Entities";
import { ApiService } from "@/services/api";

const AstaManager: React.FC = () => {
  const [aste, setAste] = useState<Asta[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsta, setEditingAsta] = useState<Asta | null>(null);
  const [formData, setFormData] = useState<Partial<Asta>>({
    dataInizio: "",
    dataFine: "",
    offertaCorrente: 0,
    statoAsta: "IN_CORSO",
    copiaFumettoId: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAste();
  }, []);

  const loadAste = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllAste();
      setAste(data);
    } catch (err) {
      setError("Errore nel caricamento delle aste");
      console.error("Error loading aste:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingAsta) {
        await ApiService.updateAsta(editingAsta.astaId!, formData);
      } else {
        await ApiService.createAsta(formData);
      }

      await loadAste();
      resetForm();
    } catch (err) {
      setError("Errore nel salvare l'asta");
      console.error("Error saving asta:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dataInizio: "",
      dataFine: "",
      offertaCorrente: 0,
      statoAsta: "IN_CORSO",
      copiaFumettoId: 1,
    });
    setEditingAsta(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (asta: Asta) => {
    setFormData(asta);
    setEditingAsta(asta);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.deleteAsta(id);
      await loadAste();
    } catch (err) {
      setError("Errore nell'eliminare l'asta");
      console.error("Error deleting asta:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatoBadgeColor = (stato: StatoAstaEnum) => {
    const colors = {
      IN_CORSO: "bg-blue-100 text-blue-800",
      CONCLUSA: "bg-green-100 text-green-800",
      ANNULLATA: "bg-red-100 text-red-800",
    };
    return colors[stato] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            <CardTitle>Gestione Aste</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuova Asta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAsta ? "Modifica Asta" : "Nuova Asta"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="copiaFumettoId">ID Copia Fumetto</Label>
                  <Input
                    id="copiaFumettoId"
                    type="number"
                    value={formData.copiaFumettoId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        copiaFumettoId: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataInizio">Data Inizio</Label>
                    <Input
                      id="dataInizio"
                      type="date"
                      value={formData.dataInizio || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, dataInizio: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFine">Data Fine</Label>
                    <Input
                      id="dataFine"
                      type="date"
                      value={formData.dataFine || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, dataFine: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="offertaCorrente">Offerta Corrente (€)</Label>
                  <Input
                    id="offertaCorrente"
                    type="number"
                    step="0.01"
                    value={formData.offertaCorrente || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offertaCorrente: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stato">Stato</Label>
                  <Select
                    value={formData.statoAsta}
                    onValueChange={(value: StatoAstaEnum) =>
                      setFormData({ ...formData, statoAsta: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_CORSO">In Corso</SelectItem>
                      <SelectItem value="CONCLUSA">Conclusa</SelectItem>
                      <SelectItem value="ANNULLATA">Annullata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annulla
                  </Button>
                  <Button type="submit">
                    {editingAsta ? "Aggiorna" : "Crea"}
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
                <TableHead>Data Inizio</TableHead>
                <TableHead>Data Fine</TableHead>
                <TableHead>Offerta Corrente</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aste.map((asta) => (
                <TableRow key={asta.astaId}>
                  <TableCell>{asta.astaId}</TableCell>
                  <TableCell className="font-medium">
                    {asta.copiaFumetto?.fumetto?.titolo ||
                      `Copia ID: ${asta.copiaFumettoId}`}
                  </TableCell>
                  <TableCell>{asta.dataInizio}</TableCell>
                  <TableCell>{asta.dataFine}</TableCell>
                  <TableCell>€{asta.offertaCorrente.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatoBadgeColor(asta.statoAsta)}>
                      {asta.statoAsta.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(asta)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(asta.astaId!)}
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

export default AstaManager;
