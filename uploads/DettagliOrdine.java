package co.develhope.team_project.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "dettagli_ordine")
public class DettagliOrdine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dettagliOrdineId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "copia_fumetto_id")
    @JsonIgnore
    @NotNull(message = "La copia del fumetto non può essere nulla per un dettaglio dell'ordine")
    private CopiaFumetto copiaFumetto;

    @NotNull(message = "La quantità di fumetti non può essere nulla")
    @Min(value = 1, message = "La quantità di fumetti deve essere almeno 1")
    @Column(nullable = false) // La quantità non può essere nulla nel DB
    private Integer quantitaFumetti;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordine_id")
    @JsonIgnore
    @NotNull(message = "L'ordine non può essere nullo per un dettaglio dell'ordine")
    private Ordine ordine;

    public DettagliOrdine() {
    }

    public DettagliOrdine(CopiaFumetto copiaFumetto, Integer quantitaFumetti, Ordine ordine) {
        this.copiaFumetto = copiaFumetto;
        this.quantitaFumetti = quantitaFumetti;
        this.ordine = ordine;
    }

    public Long getDettagliOrdineId() {
        return dettagliOrdineId;
    }

    public void setDettagliOrdineId(Long dettagliOrdineId) {
        this.dettagliOrdineId = dettagliOrdineId;
    }

    public CopiaFumetto getCopiaFumetto() {
        return copiaFumetto;
    }

    public void setCopiaFumetto(CopiaFumetto copiaFumetto) {
        this.copiaFumetto = copiaFumetto;
    }

    public Integer getQuantitaFumetti() {
        return quantitaFumetti;
    }

    public void setQuantitaFumetti(Integer quantitaFumetti) {
        this.quantitaFumetti = quantitaFumetti;
    }

    public Ordine getOrdine() {
        return ordine;
    }

    public void setOrdine(Ordine ordine) {
        this.ordine = ordine;
    }
}

