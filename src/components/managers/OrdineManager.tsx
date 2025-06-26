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
import { Plus, Edit, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { Ordine, StatoOrdineEnum } from "@/types/Entities";
import { ApiService } from "@/services/api";

const OrdineManager: React.FC = () => {
  const [ordini, setOrdini] = useState<Ordine[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrdine, setEditingOrdine] = useState<Ordine | null>(null);
  const [formData, setFormData] = useState<Partial<Ordine>>({
    prezzoFinale: 0,
    dataOrdine: new Date().toISOString().split("T")[0],
    statoOrdine: "IN_CONSEGNA",
    utenteId: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrdini();
  }, []);

  const loadOrdini = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllOrdini();
      setOrdini(data);
    } catch (err) {
      setError("Errore nel caricamento degli ordini");
      console.error("Error loading ordini:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingOrdine) {
        await ApiService.updateOrdine(editingOrdine.ordineId!, formData);
      } else {
        await ApiService.createOrdine(formData);
      }

      await loadOrdini();
      resetForm();
    } catch (err) {
      setError("Errore nel salvare l'ordine");
      console.error("Error saving ordine:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      prezzoFinale: 0,
      dataOrdine: new Date().toISOString().split("T")[0],
      statoOrdine: "IN_CONSEGNA",
      utenteId: 1,
    });
    setEditingOrdine(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (ordine: Ordine) => {
    setFormData(ordine);
    setEditingOrdine(ordine);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.deleteOrdine(id);
      await loadOrdini();
    } catch (err) {
      setError("Errore nell'eliminare l'ordine");
      console.error("Error deleting ordine:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatoBadgeColor = (stato: StatoOrdineEnum) => {
    const colors = {
      CONSEGNATO: "bg-green-100 text-green-800",
      IN_CONSEGNA: "bg-blue-100 text-blue-800",
      ANNULLATO: "bg-red-100 text-red-800",
    };
    return colors[stato] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <CardTitle>Gestione Ordini</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Ordine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingOrdine ? "Modifica Ordine" : "Nuovo Ordine"}
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
                  <Label htmlFor="prezzoFinale">Prezzo Finale (€)</Label>
                  <Input
                    id="prezzoFinale"
                    type="number"
                    step="0.01"
                    value={formData.prezzoFinale || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prezzoFinale: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dataOrdine">Data Ordine</Label>
                  <Input
                    id="dataOrdine"
                    type="date"
                    value={formData.dataOrdine || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, dataOrdine: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stato">Stato</Label>
                  <Select
                    value={formData.statoOrdine}
                    onValueChange={(value: StatoOrdineEnum) =>
                      setFormData({ ...formData, statoOrdine: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_CONSEGNA">In Consegna</SelectItem>
                      <SelectItem value="CONSEGNATO">Consegnato</SelectItem>
                      <SelectItem value="ANNULLATO">Annullato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annulla
                  </Button>
                  <Button type="submit">
                    {editingOrdine ? "Aggiorna" : "Crea"}
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
                <TableHead>Cliente</TableHead>
                <TableHead>Prezzo Finale</TableHead>
                <TableHead>Data Ordine</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordini.map((ordine) => (
                <TableRow key={ordine.ordineId}>
                  <TableCell>{ordine.ordineId}</TableCell>
                  <TableCell className="font-medium">
                    {ordine.utente
                      ? `${ordine.utente.nome} ${ordine.utente.cognome}`
                      : `Utente ID: ${ordine.utenteId}`}
                  </TableCell>
                  <TableCell>€{ordine.prezzoFinale.toFixed(2)}</TableCell>
                  <TableCell>{ordine.dataOrdine}</TableCell>
                  <TableCell>
                    <Badge className={getStatoBadgeColor(ordine.statoOrdine)}>
                      {ordine.statoOrdine.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(ordine)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(ordine.ordineId!)}
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

export default OrdineManager;
