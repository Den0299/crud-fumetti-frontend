import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  ShoppingCart,
  Gavel,
  Package,
  Heart,
  CreditCard,
  FileText,
} from "lucide-react";

// Import entity managers
import UtenteManager from "./managers/UtenteManager";
import FumettoManager from "./managers/FumettoManager";
import CopiaFumettoManager from "./managers/CopiaFumettoManager";
import AstaManager from "./managers/AstaManager";
import OrdineManager from "./managers/OrdineManager";
import DettagliOrdineManager from "./managers/DettagliOrdineManager";
import WishlistManager from "./managers/WishlistManager";
import AbbonamentoManager from "./managers/AbbonamentoManager";

const EntityManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("utenti");

  const entities = [
    { id: "utenti", label: "Utenti", icon: Users, color: "bg-blue-500" },
    { id: "fumetti", label: "Fumetti", icon: BookOpen, color: "bg-green-500" },
    {
      id: "copie",
      label: "Copie Fumetti",
      icon: Package,
      color: "bg-purple-500",
    },
    { id: "aste", label: "Aste", icon: Gavel, color: "bg-orange-500" },
    { id: "ordini", label: "Ordini", icon: ShoppingCart, color: "bg-red-500" },
    {
      id: "dettagli",
      label: "Dettagli Ordine",
      icon: FileText,
      color: "bg-indigo-500",
    },
    { id: "wishlist", label: "Wishlist", icon: Heart, color: "bg-pink-500" },
    {
      id: "abbonamenti",
      label: "Abbonamenti",
      icon: CreditCard,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestione Entità
          </h1>
          <p className="text-gray-600">
            Gestisci tutte le entità del sistema di gestione fumetti
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
            {entities.map((entity) => {
              const IconComponent = entity.icon;
              return (
                <TabsTrigger
                  key={entity.id}
                  value={entity.id}
                  className="flex flex-col items-center gap-1 p-3"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs">{entity.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="utenti">
            <UtenteManager />
          </TabsContent>

          <TabsContent value="fumetti">
            <FumettoManager />
          </TabsContent>

          <TabsContent value="copie">
            <CopiaFumettoManager />
          </TabsContent>

          <TabsContent value="aste">
            <AstaManager />
          </TabsContent>

          <TabsContent value="ordini">
            <OrdineManager />
          </TabsContent>

          <TabsContent value="dettagli">
            <DettagliOrdineManager />
          </TabsContent>

          <TabsContent value="wishlist">
            <WishlistManager />
          </TabsContent>

          <TabsContent value="abbonamenti">
            <AbbonamentoManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EntityManager;
