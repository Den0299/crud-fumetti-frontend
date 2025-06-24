package co.develhope.team_project.entities;

import co.develhope.team_project.entities.enums.StatoOrdineEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "ordini")
public class Ordine {

    // --- Attributi: ---

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ordineId;

    @NotNull(message = "Il prezzo finale non può essere nullo")
    @DecimalMin(value = "0.0", inclusive = true, message = "Il prezzo finale deve essere non negativo")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prezzoFinale;

    @NotNull(message = "La data dell'ordine non può essere nulla")
    @PastOrPresent(message = "La data dell'ordine non può essere nel futuro")
    @Column(nullable = false)
    private LocalDate dataOrdine;

    @NotNull(message = "Lo stato dell'ordine non può essere nullo")
    @Enumerated(EnumType.STRING)
    private StatoOrdineEnum statoOrdine;

    // --- Chiavi esterne: ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_id", nullable = false)
    @JsonIgnore
    private Utente utente;

    @OneToMany(mappedBy = "ordine", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DettagliOrdine> dettagliOrdini = new ArrayList<>();

    // --- Costruttori: ---

    public Ordine() {}

    public Ordine(BigDecimal prezzoFinale, LocalDate dataOrdine, StatoOrdineEnum statoOrdineEnum, Utente utente) {
        this.prezzoFinale = prezzoFinale;
        this.dataOrdine = dataOrdine;
        this.statoOrdine = statoOrdineEnum;
        this.utente = utente;
    }

    // --- Getters e setters: ---

    public Long getOrdineId() {
        return ordineId;
    }

    public void setOrdineId(Long ordineId) {
        this.ordineId = ordineId;
    }

    public BigDecimal getPrezzoFinale() {
        return prezzoFinale;
    }

    public void setPrezzoFinale(BigDecimal prezzoFinale) {
        this.prezzoFinale = prezzoFinale;
    }

    public LocalDate getDataOrdine() {
        return dataOrdine;
    }

    public void setDataOrdine(LocalDate dataOrdine) {
        this.dataOrdine = dataOrdine;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    public StatoOrdineEnum getStatoOrdine() {
        return statoOrdine;
    }

    public void setStatoOrdine(StatoOrdineEnum statoOrdine) {
        this.statoOrdine = statoOrdine;
    }

    public List<DettagliOrdine> getDettagliOrdini() {
        return dettagliOrdini;
    }

    public void setDettagliOrdini(List<DettagliOrdine> dettagliOrdini) {
        this.dettagliOrdini = dettagliOrdini;
    }

    // --- equals(), hashCode(), toString() ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Ordine ordine = (Ordine) o;
        return ordineId != null && Objects.equals(ordineId, ordine.ordineId);
    }

    @Override
    public int hashCode() {
        return ordineId != null ? Objects.hash(ordineId) : 0;
    }

    @Override
    public String toString() {
        return "Ordine{" +
                "ordineId=" + ordineId +
                ", prezzoFinale=" + prezzoFinale +
                ", dataOrdine=" + dataOrdine +
                ", statoOrdine=" + statoOrdine +
                '}';
    }
}
