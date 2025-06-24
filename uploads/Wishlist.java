package co.develhope.team_project.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "wishlists")
public class Wishlist {

    // --- Attributi: ---

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wishlistId;

    @NotNull(message = "La data di creazione della wishlist non può essere nulla")
    @PastOrPresent(message = "La data di creazione non può essere nel futuro")
    private LocalDate dataCreazione;

    // --- Chiavi esterne: ---

    @ManyToMany(fetch = FetchType.LAZY) // Lazy loading per performance
    @JoinTable(
            name = "fumetti_in_wishlist", // Nome della tabella di join
            joinColumns = @JoinColumn(name = "wishlist_id"), // Colonna che punta a Wishlist
            inverseJoinColumns = @JoinColumn(name = "fumetto_id") // Colonna che punta a Fumetto
    )
    private List<Fumetto> fumetti = new ArrayList<>();

    @OneToOne(mappedBy = "wishlist", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Utente utente;

    // --- Costruttori: ---

    public Wishlist() {}

    public Wishlist(LocalDate dataCreazione) {
        this.dataCreazione = dataCreazione;
    }

    // --- Getters e setters: ---

    public Long getWishlistId() {
        return wishlistId;
    }

    public void setWishlistId(Long wishlistId) {
        this.wishlistId = wishlistId;
    }

    public LocalDate getDataCreazione() {
        return dataCreazione;
    }

    public void setDataCreazione(LocalDate dataCreazione) {
        this.dataCreazione = dataCreazione;
    }

    public List<Fumetto> getFumetti() {
        return fumetti;
    }

    public void setFumetti(List<Fumetto> fumetti) {
        this.fumetti = fumetti;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    // --- Metodi Helper per la relazione ManyToMany con Fumetto: ---

    public void addFumetto(Fumetto fumetto) {
        if (!this.fumetti.contains(fumetto)) {
            this.fumetti.add(fumetto);
        }
    }

    public void removeFumetto(Fumetto fumetto) {
        this.fumetti.remove(fumetto);
    }

    // --- equals(), hashCode(), toString() ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Wishlist wishlist = (Wishlist) o;
        return wishlistId != null && Objects.equals(wishlistId, wishlist.wishlistId);
    }

    @Override
    public int hashCode() {
        return wishlistId != null ? Objects.hash(wishlistId) : 0;
    }

    @Override
    public String toString() {
        return "Wishlist{" +
                "wishlistId=" + wishlistId +
                ", dataCreazione=" + dataCreazione +
                '}';
    }
}
