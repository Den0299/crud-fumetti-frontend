package co.develhope.team_project.controllers;

import co.develhope.team_project.entities.Asta;
import co.develhope.team_project.services.AstaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/aste")
public class AstaController {

    @Autowired
    private AstaService astaService;

    @PostMapping("/create")
    public ResponseEntity<Asta> createAsta(@RequestBody Asta asta) {
        Asta createdAsta = astaService.createAsta(asta);
        return new ResponseEntity<>(createdAsta, HttpStatus.CREATED);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<Asta>> getAllAste() {
        List<Asta> aste = astaService.getAllAste();
        return ResponseEntity.ok(aste);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<Asta> getAstaById(@PathVariable Long id) {
        Optional<Asta> optionalAsta = astaService.getAstaById(id);

        if (optionalAsta.isPresent()) {
            return ResponseEntity.ok(optionalAsta.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Asta> updateAsta(@PathVariable Long id, @RequestBody Asta updatedAsta) {
        Optional<Asta> optionalAsta = astaService.updateAsta(id, updatedAsta);

        if (optionalAsta.isPresent()) {
            return ResponseEntity.ok(optionalAsta.get());
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAsta(@PathVariable Long id) {
        Optional<Asta> optionalAsta = astaService.deleteAstaById(id);

        if (optionalAsta.isPresent()) {
            return ResponseEntity.ok("Asta con ID '" + id + "' eliminata con successo.");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Asta con ID '" + id + "' non trovata.");
    }
}
