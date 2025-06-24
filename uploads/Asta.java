package co.develhope.team_project.entities;

import co.develhope.team_project.entities.enums.StatoAstaEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "aste")
public class Asta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long astaId;

    @NotNull(message = "La data di inizio dell'asta non può essere nulla")
    @FutureOrPresent(message = "La data di inizio dell'asta non può essere nel passato")
    @Column(nullable = false)
    private LocalDate dataInizio;

    @NotNull(message = "La data di fine dell'asta non può essere nulla")
    @Future(message = "La data di fine dell'asta deve essere nel futuro")
    @Column(nullable = false)
    private LocalDate dataFine;

    @NotNull(message = "L'offerta corrente non può essere nulla")
    @DecimalMin(value = "0.0", inclusive = false, message = "L'offerta corrente deve essere maggiore di zero")
    @Column(nullable = false, precision = 10, scale = 2) // Esempio: 10 cifre totali, 2 dopo la virgola
    private BigDecimal offertaCorrente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_migliore_offerta_id")
    @JsonIgnore
    private Utente utenteMiglioreOfferta;

    @NotNull(message = "Lo stato dell'asta non può essere nullo")
    @Enumerated(EnumType.STRING)
    private StatoAstaEnum statoAsta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "copia_fumetto_id")
    @JsonIgnore
    private CopiaFumetto copiaFumetto;

    @OneToMany(mappedBy = "asta", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IscrizioneAsta> iscrizioniAsta = new ArrayList<>();


    public Asta() {
    }

    public Asta(LocalDate dataInizio, LocalDate dataFine, BigDecimal offertaCorrente, StatoAstaEnum statoAsta, CopiaFumetto copiaFumetto) {
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
        this.offertaCorrente = offertaCorrente;
        this.statoAsta = statoAsta;
        this.copiaFumetto = copiaFumetto;
    }

    public Long getAstaId() {
        return astaId;
    }

    public void setAstaId(Long astaId) {
        this.astaId = astaId;
    }

    public LocalDate getDataInizio() {
        return dataInizio;
    }

    public void setDataInizio(LocalDate dataInizio) {
        this.dataInizio = dataInizio;
    }

    public LocalDate getDataFine() {
        return dataFine;
    }

    public void setDataFine(LocalDate dataFine) {
        this.dataFine = dataFine;
    }

    public BigDecimal getOffertaCorrente() {
        return offertaCorrente;
    }

    public void setOffertaCorrente(BigDecimal offertaCorrente) {
        this.offertaCorrente = offertaCorrente;
    }

    public Utente getUtenteMiglioreOfferta() {
        return utenteMiglioreOfferta;
    }

    public void setUtenteMiglioreOfferta(Utente utenteMiglioreOfferta) {
        this.utenteMiglioreOfferta = utenteMiglioreOfferta;
    }

    public StatoAstaEnum getStatoAsta() {
        return statoAsta;
    }

    public void setStatoAsta(StatoAstaEnum statoAsta) {
        this.statoAsta = statoAsta;
    }

    public CopiaFumetto getCopiaFumetto() {
        return copiaFumetto;
    }

    public void setCopiaFumetto(CopiaFumetto copiaFumetto) {
        this.copiaFumetto = copiaFumetto;
    }

    public List<IscrizioneAsta> getIscrizioniAsta() {
        return iscrizioniAsta;
    }

    public void setIscrizioniAsta(List<IscrizioneAsta> iscrizioniAsta) {
        this.iscrizioniAsta = iscrizioniAsta;
    }
}

