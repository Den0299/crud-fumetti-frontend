package co.develhope.team_project.controllers;

import co.develhope.team_project.entities.IscrizioneAsta;
import co.develhope.team_project.services.IscrizioneAstaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/iscrizioniAsta")
public class IscrizioneAstaController {

    @Autowired
    private IscrizioneAstaService iscrizioneAstaService;

    @PostMapping("/create")
    public ResponseEntity<IscrizioneAsta> createIscrizioneAsta(@RequestBody IscrizioneAsta iscrizioneAsta) {
        IscrizioneAsta createdIscrizioneAsta = iscrizioneAstaService.createIscrizioneAsta(iscrizioneAsta);
        return new ResponseEntity<>(createdIscrizioneAsta, HttpStatus.CREATED);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<IscrizioneAsta>> getAllIscrizioniAsta() {
        List<IscrizioneAsta> iscrizioneAsta = iscrizioneAstaService.getAllIscrizioniAsta();
        return ResponseEntity.ok(iscrizioneAsta);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<IscrizioneAsta> getIscrizioneAstaById(@PathVariable Long id) {
        Optional<IscrizioneAsta> optionalIscrizioneAsta = iscrizioneAstaService.getIscrizioneAstaById(id);

        if (optionalIscrizioneAsta.isPresent()) {
            return ResponseEntity.ok(optionalIscrizioneAsta.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<IscrizioneAsta> updateIscrizioneAsta(@PathVariable Long id, @RequestBody IscrizioneAsta updatedIscrizioneAsta) {
        Optional<IscrizioneAsta> optionalIscrizioneAsta = iscrizioneAstaService.updateIscrizioneAsta(id, updatedIscrizioneAsta);

        if (optionalIscrizioneAsta.isPresent()) {
            return ResponseEntity.ok(optionalIscrizioneAsta.get());
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteIscrizioneAsta(@PathVariable Long id) {
        Optional<IscrizioneAsta> optionalIscrizioneAsta = iscrizioneAstaService.deleteIscrizioneAstaById(id);

        if (optionalIscrizioneAsta.isPresent()) {
            return ResponseEntity.ok("IscrizioneAsta con ID '" + id + "' eliminata con successo.");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("IscrizioneAsta con ID '" + id + "' non trovata.");
    }
}
