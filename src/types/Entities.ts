// Enums
export type PianoAbbonamentoEnum =
  | "MENSILE"
  | "TRIMESTRALE"
  | "SEMESTRALE"
  | "ANNUALE";
export type RuoloUtenteEnum = "ADMIN" | "CLIENTE";
export type StatoAstaEnum = "IN_CORSO" | "CONCLUSA" | "ANNULLATA";
export type StatoOrdineEnum = "CONSEGNATO" | "ANNULLATO" | "IN_CONSEGNA";
export type StatoCopiaFumettoEnum = "NUOVO" | "USATO";
export type CategoriaFumettoEnum =
  | "FANTASY"
  | "FANTASCIENZA"
  | "HORROR"
  | "SUPEREROI"
  | "SPORTIVO"
  | "SCOLASTICO"
  | "ROMANTICO"
  | "AZIONE";

// Entity Interfaces
export interface Abbonamento {
  abbonamentoId?: number;
  pianoAbbonamento: PianoAbbonamentoEnum;
}

export interface Utente {
  utenteId?: number;
  nome: string;
  cognome: string;
  email: string;
  password: string;
  indirizzo?: string;
  dataInizioAbbonamento?: string;
  dataFineAbbonamento?: string;
  dataRegistrazione: string;
  ruoloUtente: RuoloUtenteEnum;
  abbonamentoId?: number;
}

export interface Fumetto {
  fumettoId?: number;
  titolo: string;
  autore: string;
  editore: string;
  descrizione?: string;
  dataPubblicazione: string;
  disponibilePerAsta: boolean;
  categoriaFumetto: CategoriaFumettoEnum;
}

export interface CopiaFumetto {
  copiaFumettoId?: number;
  statoCopiaFumetto: StatoCopiaFumettoEnum;
  prezzo: number;
  disponibile: boolean;
  fumettoId: number;
  fumetto?: Fumetto;
}

export interface Asta {
  astaId?: number;
  dataInizio: string;
  dataFine: string;
  offertaCorrente: number;
  statoAsta: StatoAstaEnum;
  copiaFumettoId: number;
  utenteMiglioreOffertaId?: number;
  copiaFumetto?: CopiaFumetto;
}

export interface Ordine {
  ordineId?: number;
  prezzoFinale: number;
  dataOrdine: string;
  statoOrdine: StatoOrdineEnum;
  utenteId: number;
  utente?: Utente;
}

export interface DettagliOrdine {
  dettagliOrdineId?: number;
  quantitaFumetti: number;
  copiaFumettoId: number;
  ordineId: number;
  copiaFumetto?: CopiaFumetto;
  ordine?: Ordine;
}

export interface IscrizioneAsta {
  id?: number;
  dataIscrizione: string;
  astaId: number;
  utenteId: number;
  asta?: Asta;
  utente?: Utente;
}

export interface Wishlist {
  wishlistId?: number;
  dataCreazione: string;
  utenteId?: number;
  fumetti?: Fumetto[];
}
