package co.develhope.team_project.entities.enums;

import java.math.BigDecimal;

public enum PianoAbbonamentoEnum {
    MENSILE("Abbonamento valido per un mese", new BigDecimal("10.0"), 30, BigDecimal.ZERO),
    TRIMESTRALE("Abbonamento per tre mesi con sconto del 10%", new BigDecimal("30.0"), 90, new BigDecimal("0.10")),
    SEMESTRALE("Abbonamento per sei mesi con sconto del 15%", new BigDecimal("60.0"), 180, new BigDecimal("0.15")),
    ANNUALE("Abbonamento annuale con sconto del 20%", new BigDecimal("120.0"), 365, new BigDecimal("0.20"));

    private final String descrizione;
    private final BigDecimal prezzo;
    private final Integer durataGiorni;
    private final BigDecimal sconto;

    PianoAbbonamentoEnum(String descrizione, BigDecimal prezzo, Integer durataGiorni, BigDecimal sconto) {
        this.descrizione = descrizione;
        this.prezzo = prezzo;
        this.durataGiorni = durataGiorni;
        this.sconto = sconto;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public BigDecimal getPrezzo() {
        return prezzo;
    }

    public Integer getDurataGiorni() {
        return durataGiorni;
    }

    public BigDecimal getSconto() {
        return sconto;
    }

    public BigDecimal getPrezzoScontato() {
        return prezzo.subtract(prezzo.multiply(sconto));
    }
}

