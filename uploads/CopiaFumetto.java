package co.develhope.team_project.entities;

import co.develhope.team_project.entities.enums.StatoCopiaFumettoEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "copie_fumetto")
public class CopiaFumetto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long copiaFumettoId;

    @Enumerated(EnumType.STRING)
    private StatoCopiaFumettoEnum statoCopiaFumetto;

    @NotNull(message = "Il prezzo non può essere nullo")
    @DecimalMin(value = "0.0", inclusive = true, message = "Il prezzo deve essere non negativo")
    @Column(nullable = false, precision = 10, scale = 2) // Esempio: 10 cifre totali, 2 dopo la virgola
    private BigDecimal prezzo;

    private boolean disponibile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fumetto_id", nullable = false) // Una copia deve sempre essere associata a un fumetto
    @NotNull(message = "Il fumetto associato alla copia non può essere nullo")
    private Fumetto fumetto;

    @OneToMany(mappedBy = "copiaFumetto", fetch = FetchType.LAZY)
    private List<DettagliOrdine> dettagliOrdini = new ArrayList<>();

    public CopiaFumetto() {
    }

    public CopiaFumetto(StatoCopiaFumettoEnum statoCopiaFumetto, BigDecimal prezzo, boolean disponibile, Fumetto fumetto) {
        this.statoCopiaFumetto = statoCopiaFumetto;
        this.prezzo = prezzo;
        this.disponibile = disponibile;
        this.fumetto = fumetto;
    }

    public Long getCopiaFumettoId() {
        return copiaFumettoId;
    }

    public void setCopiaFumettoId(Long copiaFumettoId) {
        this.copiaFumettoId = copiaFumettoId;
    }

    public StatoCopiaFumettoEnum getStatoCopiaFumetto() {
        return statoCopiaFumetto;
    }

    public void setStatoCopiaFumetto(StatoCopiaFumettoEnum statoCopiaFumetto) {
        this.statoCopiaFumetto = statoCopiaFumetto;
    }

    public BigDecimal getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(BigDecimal prezzo) {
        this.prezzo = prezzo;
    }

    public boolean isDisponibile() {
        return disponibile;
    }

    public void setDisponibile(boolean disponibile) {
        this.disponibile = disponibile;
    }

    public Fumetto getFumetto() {
        return fumetto;
    }

    public void setFumetto(Fumetto fumetto) {
        this.fumetto = fumetto;
    }

    public List<DettagliOrdine> getDettagliOrdini() {
        return dettagliOrdini;
    }

    public void setDettagliOrdini(List<DettagliOrdine> dettagliOrdini) {
        this.dettagliOrdini = dettagliOrdini;
    }
}

