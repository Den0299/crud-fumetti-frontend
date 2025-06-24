export interface ComicBook {
  id: number;
  title: string;
  author: string;
  artist?: string;
  publisher: string;
  genre: string;
  price: number;
  annoPubblicazione: number;
  isAvailable: boolean;
  condition?:
    | "NUOVO"
    | "USATO"
    | "NEW"
    | "LIKE_NEW"
    | "VERY_FINE"
    | "FINE"
    | "VERY_GOOD"
    | "GOOD"
    | "FAIR"
    | "POOR";
  imageUrl?: string;
  description?: string;
  issueNumber?: number;
  series?: string;
  isbn?: string;
  pageCount?: number;
  // Additional fields based on Java model
  fumettoId?: number;
  titolo?: string;
  autore?: string;
  editore?: string;
  descrizione?: string;
  dataPubblicazione?: string;
  disponibilePerAsta?: boolean;
  categoriaFumetto?:
    | "FANTASY"
    | "FANTASCIENZA"
    | "HORROR"
    | "SUPEREROI"
    | "SPORTIVO"
    | "SCOLASTICO"
    | "ROMANTICO"
    | "AZIONE";
  statoCopiaFumetto?: "NUOVO" | "USATO";
}

export interface FilterOptions {
  title: string;
  author: string;
  artist: string;
  publisher: string;
  genre: string;
  condition: string;
  priceRange: [number, number];
  yearRange: [number, number];
  available: boolean;
}

export interface ComicBookStats {
  authorStats: Array<{ author: string; count: number }>;
  publisherStats: Array<{ publisher: string; count: number }>;
  genreStats: Array<{ genre: string; count: number }>;
  conditionStats: Array<{ condition: string; count: number }>;
  availabilityStats: { available: number; unavailable: number };
}
