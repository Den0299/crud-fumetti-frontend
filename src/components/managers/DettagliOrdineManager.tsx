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
import { Plus, Edit, Trash2, FileText, Loader2 } from "lucide-react";
import { DettagliOrdine } from "@/types/Entities";
import { ApiService } from "@/services/api";

const DettagliOrdineManager: React.FC = () => {
  const [dettagli, setDettagli] = useState<DettagliOrdine[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDettaglio, setEditingDettaglio] =
    useState<DettagliOrdine | null>(null);
  const [formData, setFormData] = useState<Partial<DettagliOrdine>>({
    quantitaFumetti: 1,
    copiaFumettoId: 1,
    ordineId: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDettagli();
  }, []);

  const loadDettagli = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllDettagliOrdini();
      setDettagli(data);
    } catch (err) {
      setError("Errore nel caricamento dei dettagli ordine");
      console.error("Error loading dettagli ordine:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingDettaglio) {
        await ApiService.updateDettagliOrdine(
          editingDettaglio.dettagliOrdineId!,
          formData,
        );
      } else {
        await ApiService.createDettagliOrdine(formData);
      }

      await loadDettagli();
      resetForm();
    } catch (err) {
      setError("Errore nel salvare il dettaglio ordine");
      console.error("Error saving dettaglio ordine:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      quantitaFumetti: 1,
      copiaFumettoId: 1,
      ordineId: 1,
    });
    setEditingDettaglio(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (dettaglio: DettagliOrdine) => {
    setFormData(dettaglio);
    setEditingDettaglio(dettaglio);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.deleteDettagliOrdine(id);
      await loadDettagli();
    } catch (err) {
      setError("Errore nell'eliminare il dettaglio ordine");
      console.error("Error deleting dettaglio ordine:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Gestione Dettagli Ordine</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Dettaglio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingDettaglio ? "Modifica Dettaglio" : "Nuovo Dettaglio"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="ordineId">ID Ordine</Label>
                  <Input
                    id="ordineId"
                    type="number"
                    value={formData.ordineId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ordineId: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
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
                <div>
                  <Label htmlFor="quantitaFumetti">Quantità</Label>
                  <Input
                    id="quantitaFumetti"
                    type="number"
                    min="1"
                    value={formData.quantitaFumetti || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantitaFumetti: parseInt(e.target.value),
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
                    {editingDettaglio ? "Aggiorna" : "Crea"}
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
                <TableHead>Ordine ID</TableHead>
                <TableHead>Fumetto</TableHead>
                <TableHead>Quantità</TableHead>
                <TableHead>Prezzo Unitario</TableHead>
                <TableHead>Totale</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dettagli.map((dettaglio) => (
                <TableRow key={dettaglio.dettagliOrdineId}>
                  <TableCell>{dettaglio.dettagliOrdineId}</TableCell>
                  <TableCell>{dettaglio.ordineId}</TableCell>
                  <TableCell className="font-medium">
                    {dettaglio.copiaFumetto?.fumetto?.titolo ||
                      `Copia ID: ${dettaglio.copiaFumettoId}`}
                  </TableCell>
                  <TableCell>{dettaglio.quantitaFumetti}</TableCell>
                  <TableCell>
                    {dettaglio.copiaFumetto
                      ? `€${dettaglio.copiaFumetto.prezzo.toFixed(2)}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {dettaglio.copiaFumetto
                      ? `€${(dettaglio.copiaFumetto.prezzo * dettaglio.quantitaFumetti).toFixed(2)}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(dettaglio)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDelete(dettaglio.dettagliOrdineId!)
                        }
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

export default DettagliOrdineManager;
