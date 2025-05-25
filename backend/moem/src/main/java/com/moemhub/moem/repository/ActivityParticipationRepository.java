package com.moemhub.moem.repository;

import com.moemhub.moem.model.Activity;
import com.moemhub.moem.model.ActivityParticipation;
import com.moemhub.moem.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityParticipationRepository extends JpaRepository<ActivityParticipation, Long> {
    List<ActivityParticipation> findByActivity(Activity activity);
    List<ActivityParticipation> findByAccount(Account account);
    Optional<ActivityParticipation> findByActivityAndAccount(Activity activity, Account account);
}