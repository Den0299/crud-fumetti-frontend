package co.develhope.team_project.controllers;

import co.develhope.team_project.entities.Abbonamento;
import co.develhope.team_project.services.AbbonamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/abbonamenti")
public class AbbonamentoController {

    @Autowired
    private AbbonamentoService abbonamentoService;

    @PostMapping("/create")
    public ResponseEntity<Abbonamento> createAbbonamento(@RequestBody Abbonamento abbonamento) {
        Abbonamento createdAbbonamento = abbonamentoService.createAbbonamento(abbonamento);

        return new ResponseEntity<>(createdAbbonamento, HttpStatus.CREATED);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<Abbonamento>> getAllAbbonamenti() {
        List<Abbonamento> abbonamenti = abbonamentoService.getAllAbbonamenti();

        return ResponseEntity.ok(abbonamenti);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<Abbonamento> getAbbonamentoById(@PathVariable Long id) {
        Optional<Abbonamento> optionalAbbonamento = abbonamentoService.getAbbonamentoById(id);

        if (optionalAbbonamento.isPresent()) {
            return ResponseEntity.ok(optionalAbbonamento.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Abbonamento> updateAbbonamento(@PathVariable Long id, @RequestBody Abbonamento updatedAbbonamento) {
        Optional<Abbonamento> optionalAbbonamento = abbonamentoService.updateAbbonamento(id, updatedAbbonamento);

        if (optionalAbbonamento.isPresent()) {
            return ResponseEntity.ok(optionalAbbonamento.get());
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAbbonamento(@PathVariable Long id) {
        Optional<Abbonamento> optionalAbbonamento = abbonamentoService.deleteAbbonamentoById(id);

        if (optionalAbbonamento.isPresent()) {
            return ResponseEntity.ok("Abbonamento con ID '" + id + "' eliminato con successo.");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Abbonamento con ID '" + id + "' non trovato.");
    }
}
