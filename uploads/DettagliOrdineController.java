package co.develhope.team_project.controllers;

import co.develhope.team_project.entities.DettagliOrdine;
import co.develhope.team_project.services.DettagliOrdineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dettagliOrdini")
public class DettagliOrdineController {

    @Autowired
    private DettagliOrdineService dettagliOrdineService;

    @PostMapping("/create")
    public ResponseEntity<DettagliOrdine> createDettagliOrdine(@RequestBody DettagliOrdine dettagliOrdine) {
        DettagliOrdine createdDettagliOrdine = dettagliOrdineService.createDettagliOrdine(dettagliOrdine);
        return new ResponseEntity<>(createdDettagliOrdine, HttpStatus.CREATED);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<DettagliOrdine>> getAllDettagliOrdini() {
        List<DettagliOrdine> dettagliOrdini = dettagliOrdineService.getAllDettagliOrdini();
        return ResponseEntity.ok(dettagliOrdini);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<DettagliOrdine> getDettagliOrdineById(@PathVariable Long id) {
        Optional<DettagliOrdine> optionalDettagliOrdine = dettagliOrdineService.getDettagliOrdineById(id);

        if (optionalDettagliOrdine.isPresent()) {
            return ResponseEntity.ok(optionalDettagliOrdine.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DettagliOrdine> updateDettagliOrdine(@PathVariable Long id, @RequestBody DettagliOrdine updatedDettagliOrdine) {
        Optional<DettagliOrdine> optionalDettagliOrdine = dettagliOrdineService.updateDettagliOrdine(id, updatedDettagliOrdine);

        if (optionalDettagliOrdine.isPresent()) {
            return ResponseEntity.ok(optionalDettagliOrdine.get());
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDettagliOrdine(@PathVariable Long id) {
        Optional<DettagliOrdine> optionalDettagliOrdine = dettagliOrdineService.deleteDettagliOrdineById(id);

        if (optionalDettagliOrdine.isPresent()) {
            return ResponseEntity.ok("DettagliOrdine con ID '" + id + "' eliminato con successo.");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("DettagliOrdine con ID '" + id + "' non trovato.");
    }
}
