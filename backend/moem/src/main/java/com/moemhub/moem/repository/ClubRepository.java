package com.moemhub.moem.repository;

import com.moemhub.moem.model.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    // Provide basic CRUD operations for Club entity
}