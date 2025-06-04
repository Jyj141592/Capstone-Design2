package com.moemhub.moem.repository;

import com.moemhub.moem.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByDateBetween(LocalDateTime start, LocalDateTime end);
}