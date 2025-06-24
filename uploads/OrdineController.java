package co.develhope.team_project.controllers;

import co.develhope.team_project.entities.Ordine;
import co.develhope.team_project.services.OrdineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordini")
public class OrdineController {
    
    @Autowired
    private OrdineService ordineService;

    // crea un nuovo ordine:
    @PostMapping("/create-ordine")
    public ResponseEntity<Ordine> addOrdine(@RequestBody Ordine ordine) {
        Ordine ordineToAdd = ordineService.addOrdine(ordine);

        return new ResponseEntity<>(ordineToAdd, HttpStatus.CREATED);
    }

    // ottieni una lista di tutti gli ordini:
    @GetMapping("/get-ordini")
    public ResponseEntity<List<Ordine>> getOrdini() {
        List<Ordine> ordiniToFind = ordineService.getOrdini();

        return ResponseEntity.ok(ordiniToFind);
    }

    // trova un ordine per id:
    @GetMapping("/find-ordine-by-id/{id}")
    public ResponseEntity<Ordine> findOrdine(@PathVariable Long id) {
        Optional<Ordine> ordineToFind = ordineService.findOrdine(id);

        if (ordineToFind.isPresent()) {
            return ResponseEntity.ok(ordineToFind.get());
        }
        return ResponseEntity.notFound().build();
    }

    // cancella un ordine:
    @DeleteMapping("/delete-ordine/{id}")
    public ResponseEntity<String> deleteOrdine(@PathVariable Long id) {
        Optional<Ordine> ordineToDelete = ordineService.deleteOrdine(id);

        if (ordineToDelete.isPresent()) {
            return ResponseEntity.ok("Ordine con ID '" + id + "' eliminato con successo.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ordine con ID '" + id + "' non trovato.");
    }

    // modifica un ordine:
    @PutMapping("/update-ordine/{id}")
    public ResponseEntity<Ordine> updateOrdine(@PathVariable Long id,
                                                 @RequestBody Ordine ordineDetails) {
        Optional<Ordine> ordineToUpdate = ordineService.updateOrdine(id, ordineDetails);

        if (ordineToUpdate.isPresent()) {
            return ResponseEntity.ok(ordineToUpdate.get());
        }
        return ResponseEntity.notFound().build();
    }
}
