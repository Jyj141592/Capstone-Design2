package com.moemhub.moem.controller;

import com.moemhub.moem.model.Club;
import com.moemhub.moem.service.ClubService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    // Create new club
    @PostMapping
    public ResponseEntity<Club> createClub(@RequestBody Club club) {
        Club createdClub = clubService.createClub(club);
        return new ResponseEntity<>(createdClub, HttpStatus.CREATED);
    }

    // Update existing club
    @PutMapping("/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id, @RequestBody Club club) {
        Club updatedClub = clubService.updateClub(id, club);
        return new ResponseEntity<>(updatedClub, HttpStatus.OK);
    }

    // Delete club
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
