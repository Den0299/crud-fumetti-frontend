import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, CreditCard, Loader2 } from "lucide-react";
import { Abbonamento, PianoAbbonamentoEnum } from "@/types/Entities";
import { ApiService } from "@/services/api";

const AbbonamentoManager: React.FC = () => {
  const [abbonamenti, setAbbonamenti] = useState<Abbonamento[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAbbonamento, setEditingAbbonamento] =
    useState<Abbonamento | null>(null);
  const [formData, setFormData] = useState<Partial<Abbonamento>>({
    pianoAbbonamento: "MENSILE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  useEffect(() => {
    loadAbbonamenti();
  }, []);

  const loadAbbonamenti = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllAbbonamenti();
      setAbbonamenti(data);
    } catch (err) {
      setError("Errore nel caricamento degli abbonamenti");
      console.error("Error loading abbonamenti:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingAbbonamento) {
        await ApiService.updateAbbonamento(
          editingAbbonamento.abbonamentoId!,
          formData,
        );
      } else {
        await ApiService.createAbbonamento(formData);
      }

      await loadAbbonamenti();
      resetForm();
    } catch (err) {
      setError("Errore nel salvare l'abbonamento");
      console.error("Error saving abbonamento:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pianoAbbonamento: "MENSILE",
    });
    setEditingAbbonamento(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (abbonamento: Abbonamento) => {
    setFormData(abbonamento);
    setEditingAbbonamento(abbonamento);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.deleteAbbonamento(id);
      await loadAbbonamenti();
    } catch (err) {
      setError("Errore nell'eliminare l'abbonamento");
      console.error("Error deleting abbonamento:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPianoBadgeColor = (piano: PianoAbbonamentoEnum) => {
    const colors = {
      MENSILE: "bg-blue-100 text-blue-800",
      TRIMESTRALE: "bg-green-100 text-green-800",
      SEMESTRALE: "bg-orange-100 text-orange-800",
      ANNUALE: "bg-purple-100 text-purple-800",
    };
    return colors[piano] || "bg-gray-100 text-gray-800";
  };

  const getPianoDetails = (piano: PianoAbbonamentoEnum) => {
    const details = {
      MENSILE: { prezzo: "€10.00", durata: "30 giorni", sconto: "0%" },
      TRIMESTRALE: { prezzo: "€30.00", durata: "90 giorni", sconto: "10%" },
      SEMESTRALE: { prezzo: "€60.00", durata: "180 giorni", sconto: "15%" },
      ANNUALE: { prezzo: "€120.00", durata: "365 giorni", sconto: "20%" },
    };
    return details[piano] || { prezzo: "N/A", durata: "N/A", sconto: "N/A" };
  };

  return (
    <div className="space-y-6 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Gestione Abbonamenti</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Abbonamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAbbonamento
                    ? "Modifica Abbonamento"
                    : "Nuovo Abbonamento"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="piano">Piano Abbonamento</Label>
                  <Select
                    value={formData.pianoAbbonamento}
                    onValueChange={(value: PianoAbbonamentoEnum) =>
                      setFormData({ ...formData, pianoAbbonamento: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MENSILE">
                        Mensile - €10.00 (30 giorni)
                      </SelectItem>
                      <SelectItem value="TRIMESTRALE">
                        Trimestrale - €30.00 (90 giorni, -10%)
                      </SelectItem>
                      <SelectItem value="SEMESTRALE">
                        Semestrale - €60.00 (180 giorni, -15%)
                      </SelectItem>
                      <SelectItem value="ANNUALE">
                        Annuale - €120.00 (365 giorni, -20%)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annulla
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    {editingAbbonamento ? "Aggiorna" : "Crea"}
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
                <TableHead>Piano</TableHead>
                <TableHead>Prezzo</TableHead>
                <TableHead>Durata</TableHead>
                <TableHead>Sconto</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {abbonamenti.map((abbonamento) => {
                const details = getPianoDetails(abbonamento.pianoAbbonamento);
                return (
                  <TableRow key={abbonamento.abbonamentoId}>
                    <TableCell>{abbonamento.abbonamentoId}</TableCell>
                    <TableCell>
                      <Badge
                        className={getPianoBadgeColor(
                          abbonamento.pianoAbbonamento,
                        )}
                      >
                        {abbonamento.pianoAbbonamento}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {details.prezzo}
                    </TableCell>
                    <TableCell>{details.durata}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          details.sconto === "0%" ? "secondary" : "default"
                        }
                      >
                        {details.sconto}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(abbonamento)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(abbonamento.abbonamentoId!)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AbbonamentoManager;
