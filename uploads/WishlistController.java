package co.develhope.team_project.controllers;

import co.develhope.team_project.entities.Wishlist;
import co.develhope.team_project.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlists")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // crea una nuova wishlist:
    @PostMapping("/create-wishlist")
    public ResponseEntity<Wishlist> addWishlist(@RequestBody Wishlist wishlist) {
        Wishlist wishlistToAdd = wishlistService.addWishlist(wishlist);

        return new ResponseEntity<>(wishlistToAdd, HttpStatus.CREATED);
    }

    // ottieni una lista di tutte le wishlists:
    @GetMapping("/get-wishlists")
    public ResponseEntity<List<Wishlist>> getWishlists() {
        List<Wishlist> wishlistsToFind = wishlistService.getWishlists();

        return ResponseEntity.ok(wishlistsToFind);
    }

    // trova una wishlist per id:
    @GetMapping("/find-wishlist-by-id/{id}")
    public ResponseEntity<Wishlist> findWishlist(@PathVariable Long id) {
        Optional<Wishlist> wishlistToFind = wishlistService.findWishlist(id);

        if (wishlistToFind.isPresent()) {
            return ResponseEntity.ok(wishlistToFind.get());
        }
        return ResponseEntity.notFound().build();
    }

    // cancella una wishlist:
    @DeleteMapping("/delete-wishlist/{id}")
    public ResponseEntity<String> deleteWishlist(@PathVariable Long id) {
        Optional<Wishlist> wishlistToDelete = wishlistService.deleteWishlist(id);

        if (wishlistToDelete.isPresent()) {
            return ResponseEntity.ok("Wishlist con ID '" + id + "' eliminata con successo.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Wishlist con ID '" + id + "' non trovata.");
    }

    // modifica una wishlist:
    @PutMapping("/update-wishlist/{id}")
    public ResponseEntity<Wishlist> updateWishlist(@PathVariable Long id,
                                                 @RequestBody Wishlist wishlistDetails) {
        Optional<Wishlist> wishlistToUpdate = wishlistService.updateWishlist(id, wishlistDetails);

        if (wishlistToUpdate.isPresent()) {
            return ResponseEntity.ok(wishlistToUpdate.get());
        }
        return ResponseEntity.notFound().build();
    }
}
