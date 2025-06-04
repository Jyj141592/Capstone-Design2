package com.moemhub.moem.repository;

import com.moemhub.moem.model.Activity;
import com.moemhub.moem.model.ActivityComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityCommentRepository extends JpaRepository<ActivityComment, Long> {
    List<ActivityComment> findByActivity(Activity activity);
}