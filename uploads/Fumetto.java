package co.develhope.team_project.entities;

import co.develhope.team_project.entities.enums.CategoriaFumettoEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "fumetti")
public class Fumetto {

    // --- Attributi: ---

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fumettoId;

    @NotBlank(message = "Il titolo non può essere vuoto")
    @Size(max = 255, message = "Il titolo non può superare i 255 caratteri")
    @Column(nullable = false)
    private String titolo;

    @NotBlank(message = "L'autore non può essere vuoto")
    @Size(max = 255, message = "L'autore non può superare i 255 caratteri")
    private String autore;

    @NotBlank(message = "L'editore non può essere vuoto")
    @Size(max = 255, message = "L'editore non può superare i 255 caratteri")
    private String editore;

    @Lob
    @Size(max = 2000, message = "La descrizione non può superare i 2000 caratteri")
    private String descrizione;

    @NotNull(message = "La data di pubblicazione non può essere nulla")
    @PastOrPresent(message = "La data di pubblicazione non può essere nel futuro")
    private LocalDate dataPubblicazione;

    private boolean disponibilePerAsta;

    @NotNull(message = "La categoria del fumetto non può essere nulla")
    @Enumerated(EnumType.STRING)
    private CategoriaFumettoEnum categoriaFumetto;

    // --- Chiavi esterne: ---

    @ManyToMany(mappedBy = "fumetti", fetch = FetchType.LAZY) // forse opzionale
    private List<Wishlist> wishlists = new ArrayList<>();

    @OneToMany(mappedBy = "fumetto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CopiaFumetto> copieFumetto = new ArrayList<>();

    // --- Costruttori: ---

    public Fumetto() {}

    public Fumetto(String titolo, String autore, String editore, String descrizione, LocalDate dataPubblicazione, boolean disponibilePerAsta, CategoriaFumettoEnum categoriaFumetto) {
        this.titolo = titolo;
        this.autore = autore;
        this.editore = editore;
        this.descrizione = descrizione;
        this.dataPubblicazione = dataPubblicazione;
        this.disponibilePerAsta = disponibilePerAsta;
        this.categoriaFumetto = categoriaFumetto;
    }

    // --- Getters e setters: ---

    public Long getFumettoId() {
        return fumettoId;
    }

    public void setFumettoId(Long fumettoId) {
        this.fumettoId = fumettoId;
    }

    public String getTitolo() {
        return titolo;
    }

    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }

    public String getAutore() {
        return autore;
    }

    public void setAutore(String autore) {
        this.autore = autore;
    }

    public String getEditore() {
        return editore;
    }

    public void setEditore(String editore) {
        this.editore = editore;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public LocalDate getDataPubblicazione() {
        return dataPubblicazione;
    }

    public void setDataPubblicazione(LocalDate dataPubblicazione) {
        this.dataPubblicazione = dataPubblicazione;
    }

    public boolean isDisponibilePerAsta() {
        return disponibilePerAsta;
    }

    public void setDisponibilePerAsta(boolean disponibilePerAsta) {
        this.disponibilePerAsta = disponibilePerAsta;
    }

    public CategoriaFumettoEnum getCategoriaFumetto() {
        return categoriaFumetto;
    }

    public void setCategoriaFumetto(CategoriaFumettoEnum categoriaFumetto) {
        this.categoriaFumetto = categoriaFumetto;
    }

    public List<Wishlist> getWishlists() {
        return wishlists;
    }

    public void setWishlists(List<Wishlist> wishlists) {
        this.wishlists = wishlists;
    }

    public List<CopiaFumetto> getCopieFumetto() {
        return copieFumetto;
    }

    public void setCopieFumetto(List<CopiaFumetto> copieFumetto) {
        this.copieFumetto = copieFumetto;
    }

    // --- Metodi Helper per la relazione ManyToMany con Wishlist: ---

    public void addWishlist(Wishlist wishlist) {
        if (!this.wishlists.contains(wishlist)) {
            this.wishlists.add(wishlist);
        }
    }

    public void removeWishlist(Wishlist wishlist) {
        this.wishlists.remove(wishlist);
    }

    // --- equals(), hashCode(), toString() ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Fumetto fumetto = (Fumetto) o;
        return fumettoId != null && Objects.equals(fumettoId, fumetto.fumettoId);
    }

    @Override
    public int hashCode() {
        return fumettoId != null ? Objects.hash(fumettoId) : 0;
    }

    @Override
    public String toString() {
        return "Fumetto{" +
                "fumettoId=" + fumettoId +
                ", titolo='" + titolo + '\'' +
                ", autore='" + autore + '\'' +
                ", editore='" + editore + '\'' +
                ", dataPubblicazione=" + dataPubblicazione +
                ", disponibilePerAsta=" + disponibilePerAsta +
                ", categoriaFumetto=" + categoriaFumetto +
                '}';
    }
}
