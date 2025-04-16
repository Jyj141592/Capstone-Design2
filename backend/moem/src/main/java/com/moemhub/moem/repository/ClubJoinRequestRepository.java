package com.moemhub.moem.repository;

import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.ClubJoinRequest;
import com.moemhub.moem.model.ClubJoinRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubJoinRequestRepository extends JpaRepository<ClubJoinRequest, Long> {
    // Find all join requests for given club
    List<ClubJoinRequest> findByClub(Club club);

    // Find join requests for given club filtered by status
    List<ClubJoinRequest> findByClubAndStatus(Club club, RequestStatus status);

    // Find all join requests submitted by particular account
    List<ClubJoinRequest> findByAccount(Account account);

    // Find join request for specific club and account
    Optional<ClubJoinRequest> findByClubAndAccount(Club club, Account account);

    // Check if a pending join request exists for a specific club and account
    boolean existsByClubAndAccountAndStatus(Club club, Account account, RequestStatus status);
}