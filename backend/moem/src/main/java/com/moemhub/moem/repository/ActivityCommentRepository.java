package com.moemhub.moem.repository;

import com.moemhub.moem.model.Activity;
import com.moemhub.moem.model.ActivityComment;
import com.moemhub.moem.model.ActivityParticipation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityCommentRepository extends JpaRepository<ActivityComment, Long> {
    Optional<ActivityComment> findByActivityParticipation(ActivityParticipation activity);
}