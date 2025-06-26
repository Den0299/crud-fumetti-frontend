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
import { Plus, Edit, Trash2, User, Loader2 } from "lucide-react";
import { Utente, RuoloUtenteEnum } from "@/types/Entities";
import { ApiService } from "@/services/api";

const UtenteManager: React.FC = () => {
  const [utenti, setUtenti] = useState<Utente[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUtente, setEditingUtente] = useState<Utente | null>(null);
  const [formData, setFormData] = useState<Partial<Utente>>({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    indirizzo: "",
    ruoloUtente: "CLIENTE",
    dataRegistrazione: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUtenti();
  }, []);

  const loadUtenti = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllUtenti();
      setUtenti(data);
    } catch (err) {
      setError("Errore nel caricamento degli utenti");
      console.error("Error loading utenti:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingUtente) {
        await ApiService.updateUtente(editingUtente.utenteId!, formData);
      } else {
        await ApiService.createUtente(formData);
      }

      await loadUtenti();
      resetForm();
    } catch (err) {
      setError("Errore nel salvare l'utente");
      console.error("Error saving utente:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cognome: "",
      email: "",
      password: "",
      indirizzo: "",
      ruoloUtente: "CLIENTE",
      dataRegistrazione: new Date().toISOString().split("T")[0],
    });
    setEditingUtente(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (utente: Utente) => {
    setFormData(utente);
    setEditingUtente(utente);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ApiService.deleteUtente(id);
      await loadUtenti();
    } catch (err) {
      setError("Errore nell'eliminare l'utente");
      console.error("Error deleting utente:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRuoloBadgeColor = (ruolo: RuoloUtenteEnum) => {
    return ruolo === "ADMIN"
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="space-y-6 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Gestione Utenti</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Utente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingUtente ? "Modifica Utente" : "Nuovo Utente"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={formData.nome || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cognome">Cognome</Label>
                    <Input
                      id="cognome"
                      value={formData.cognome || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, cognome: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="indirizzo">Indirizzo</Label>
                  <Input
                    id="indirizzo"
                    value={formData.indirizzo || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, indirizzo: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ruolo">Ruolo</Label>
                  <Select
                    value={formData.ruoloUtente}
                    onValueChange={(value: RuoloUtenteEnum) =>
                      setFormData({ ...formData, ruoloUtente: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENTE">Cliente</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annulla
                  </Button>
                  <Button type="submit">
                    {editingUtente ? "Aggiorna" : "Crea"}
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
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Data Registrazione</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utenti.map((utente) => (
                <TableRow key={utente.utenteId}>
                  <TableCell>{utente.utenteId}</TableCell>
                  <TableCell>
                    {utente.nome} {utente.cognome}
                  </TableCell>
                  <TableCell>{utente.email}</TableCell>
                  <TableCell>
                    <Badge className={getRuoloBadgeColor(utente.ruoloUtente)}>
                      {utente.ruoloUtente}
                    </Badge>
                  </TableCell>
                  <TableCell>{utente.dataRegistrazione}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(utente)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(utente.utenteId!)}
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

export default UtenteManager;
