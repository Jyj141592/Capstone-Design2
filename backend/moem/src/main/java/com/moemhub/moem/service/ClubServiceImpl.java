package com.moemhub.moem.service;

import com.moemhub.moem.model.Club;
import com.moemhub.moem.repository.ClubRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ClubServiceImpl implements ClubService {

    private final ClubRepository clubRepository;

    public ClubServiceImpl(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    @Override
    public Club createClub(Club club) {
        // Save new club entity
        return clubRepository.save(club);
    }

    @Override
    public Club updateClub(Long id, Club updatedClub) {
        // Find club by id or throw exception if not found
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        // Update club fields
        club.setName(updatedClub.getName());
        club.setDescription(updatedClub.getDescription());
        club.setIsPublic(updatedClub.isPublic());
        // Save updated club
        return clubRepository.save(club);
    }

    @Override
    public void deleteClub(Long id) {
        // Find club by id or throw exception if not found
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found"));
        // Cleanup before deletion(Clear memeber list)
        club.deleteClub();
        // Delete club entity
        clubRepository.delete(club);
    }
}