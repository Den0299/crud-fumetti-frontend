package co.develhope.team_project.entities;

import co.develhope.team_project.entities.enums.RuoloUtenteEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "utenti")
public class Utente {

    // --- Attributi ---:

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long utenteId;

    @NotBlank(message = "Il nome non può essere vuoto")
    @Size(max = 100, message = "Il nome non può superare i 100 caratteri")
    private String nome;

    @NotBlank(message = "Il cognome non può essere vuoto")
    @Size(max = 100, message = "Il cognome non può superare i 100 caratteri")
    private String cognome;

    @Email(message = "Formato email non valido")
    @NotBlank(message = "L'email non può essere vuota")
    @Column(unique = true, nullable = false)
    @Size(max = 255, message = "L'email non può superare i 255 caratteri")
    private String email;

    @NotBlank(message = "La password non può essere vuota")
    @Size(min = 8, message = "La password deve avere almeno 8 caratteri")
    private String password;

    @Size(max = 255, message = "L'indirizzo non può superare i 255 caratteri")
    private String indirizzo;

    @PastOrPresent(message = "La data di inizio abbonamento non può essere nel futuro")
    private LocalDate dataInizioAbbonamento;

    @PastOrPresent(message = "La data di fine abbonamento non può essere nel futuro")
    private LocalDate dataFineAbbonamento;

    @NotNull(message = "La data di registrazione non può essere nulla")
    @PastOrPresent(message = "La data di registrazione non può essere nel futuro")
    private LocalDate dataRegistrazione;

    @NotNull(message = "Il ruolo utente non può essere nullo")
    @Enumerated(EnumType.STRING)
    private RuoloUtenteEnum ruoloUtente;

    // --- Chiavi esterne ---:

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "abbonamento_id")
    @JsonIgnore
    private Abbonamento abbonamento;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "wishlist_id")
    private Wishlist wishlist;

    @OneToMany(mappedBy = "utente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<IscrizioneAsta> iscrizioniAsta = new ArrayList<>();

    @OneToMany(mappedBy = "utente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // Lazy loading, gestione cascata e rimozione orfani
    private List<Ordine> ordini = new ArrayList<>();

    @OneToMany(mappedBy = "utenteMiglioreOfferta", fetch = FetchType.LAZY) // Lazy loading
    private List<Asta> asteVinte = new ArrayList<>();

    // --- Costruttori ---:

    public Utente() {}

    public Utente(String nome, String cognome, String email, String password, String indirizzo, RuoloUtenteEnum ruoloUtente) {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.password = password;
        this.indirizzo = indirizzo;
        this.ruoloUtente = ruoloUtente;
        this.dataRegistrazione = LocalDate.now();
    }

    // --- Getters e setters ---:

    public Long getUtenteId() {
        return utenteId;
    }

    public void setUtenteId(Long utenteId) {
        this.utenteId = utenteId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }

    public LocalDate getDataInizioAbbonamento() {
        return dataInizioAbbonamento;
    }

    public void setDataInizioAbbonamento(LocalDate dataInizioAbbonamento) {
        this.dataInizioAbbonamento = dataInizioAbbonamento;
    }

    public LocalDate getDataFineAbbonamento() {
        return dataFineAbbonamento;
    }

    public void setDataFineAbbonamento(LocalDate dataFineAbbonamento) {
        this.dataFineAbbonamento = dataFineAbbonamento;
    }

    public LocalDate getDataRegistrazione() {
        return dataRegistrazione;
    }

    public void setDataRegistrazione(LocalDate dataRegistrazione) {
        this.dataRegistrazione = dataRegistrazione;
    }

    public RuoloUtenteEnum getRuoloUtente() {
        return ruoloUtente;
    }

    public void setRuoloUtente(RuoloUtenteEnum ruoloUtente) {
        this.ruoloUtente = ruoloUtente;
    }

    public Abbonamento getAbbonamento() {
        return abbonamento;
    }

    public void setAbbonamento(Abbonamento abbonamento) {
        this.abbonamento = abbonamento;
    }

    public Wishlist getWishlist() {
        return wishlist;
    }

    public void setWishlist(Wishlist wishlist) {
        this.wishlist = wishlist;
    }

    public List<IscrizioneAsta> getIscrizioniAsta() {
        return iscrizioniAsta;
    }

    public void setIscrizioniAsta(List<IscrizioneAsta> iscrizioniAsta) {
        this.iscrizioniAsta = iscrizioniAsta;
    }

    public List<Ordine> getOrdini() {
        return ordini;
    }

    public void setOrdini(List<Ordine> ordini) {
        this.ordini = ordini;
    }

    public List<Asta> getAsteVinte() {
        return asteVinte;
    }

    public void setAsteVinte(List<Asta> asteVinte) {
        this.asteVinte = asteVinte;
    }

    // --- Metodi Helper per le relazioni: ---
    public void addIscrizioneAsta(IscrizioneAsta iscrizione) {
        this.iscrizioniAsta.add(iscrizione);
        iscrizione.setUtente(this);
    }

    public void removeIscrizioneAsta(IscrizioneAsta iscrizione) {
        this.iscrizioniAsta.remove(iscrizione);
        iscrizione.setUtente(null);
    }

    public void addOrdine(Ordine ordine) {
        this.ordini.add(ordine);
        ordine.setUtente(this);
    }

    public void removeOrdine(Ordine ordine) {
        this.ordini.remove(ordine);
        ordine.setUtente(null);
    }

    // --- equals(), hashCode(), toString() ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Utente utente = (Utente) o;
        return utenteId != null && Objects.equals(utenteId, utente.utenteId);
    }

    @Override
    public int hashCode() {
        return utenteId != null ? Objects.hash(utenteId) : 0;
    }

    @Override
    public String toString() {
        return "Utente{" +
                "utenteId=" + utenteId +
                ", nome='" + nome + '\'' +
                ", cognome='" + cognome + '\'' +
                ", email='" + email + '\'' +
                ", ruoloUtente=" + ruoloUtente +
                ", dataRegistrazione=" + dataRegistrazione +
                '}';
    }
}
