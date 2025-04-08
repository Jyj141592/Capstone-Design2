package com.moemhub.moem.service;

import com.moemhub.moem.model.Club;

public interface ClubService {
    // Create new club
    Club createClub(Club club);

    // Update existing club
    Club updateClub(Long id, Club club);

    // Delete club by id
    void deleteClub(Long id);

}