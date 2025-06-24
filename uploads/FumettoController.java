package co.develhope.team_project.controllers;

import co.develhope.team_project.entities.Fumetto;
import co.develhope.team_project.services.FumettoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/fumetti")
public class FumettoController {

    @Autowired
    private FumettoService fumettoService;

    // crea un nuovo fumetto:
    @PostMapping("/create-fumetto")
    public ResponseEntity<Fumetto> addFumetto(@RequestBody Fumetto fumetto) {
        Fumetto fumettoToAdd = fumettoService.addFumetto(fumetto);

        return new ResponseEntity<>(fumettoToAdd, HttpStatus.CREATED);
    }

    // ottieni una lista di tutti i fumetti:
    @GetMapping("/get-fumetti")
    public ResponseEntity<List<Fumetto>> getFumetti() {
        List<Fumetto> fumettiToFind = fumettoService.getFumetti();

        return ResponseEntity.ok(fumettiToFind);
    }

    // trova un fumetto per id:
    @GetMapping("/find-fumetto-by-id/{id}")
    public ResponseEntity<Fumetto> findFumetto(@PathVariable Long id) {
        Optional<Fumetto> fumettoToFind = fumettoService.findFumetto(id);

        if (fumettoToFind.isPresent()) {
            return ResponseEntity.ok(fumettoToFind.get());
        }
        return ResponseEntity.notFound().build();
    }

    // cancella un fumetto:
    @DeleteMapping("/delete-fumetto/{id}")
    public ResponseEntity<String> deleteFumetto(@PathVariable Long id) {
        Optional<Fumetto> fumettoToDelete = fumettoService.deleteFumetto(id);

        if (fumettoToDelete.isPresent()) {
            return ResponseEntity.ok("Fumetto con ID '" + id + "' eliminato con successo.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Fumetto con ID '" + id + "' non trovato.");
    }

    // modifica un fumetto:
    @PutMapping("/update-fumetto/{id}")
    public ResponseEntity<Fumetto> updateFumetto(@PathVariable Long id,
                                               @RequestBody Fumetto fumettoDetails) {
        Optional<Fumetto> fumettoToUpdate = fumettoService.updateFumetto(id, fumettoDetails);

        if (fumettoToUpdate.isPresent()) {
            return ResponseEntity.ok(fumettoToUpdate.get());
        }
        return ResponseEntity.notFound().build();
    }
}
