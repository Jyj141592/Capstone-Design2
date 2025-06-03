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
    List<ClubJoinRequest> findByClubOrderByIdDesc(Club club);

    // Find join requests for given club filtered by status
    List<ClubJoinRequest> findByClubAndStatus(Club club, RequestStatus status);

    // Find all join requests submitted by particular account
    List<ClubJoinRequest> findBySubmitter(Account submitter);
    List<ClubJoinRequest> findBySubmitterOrderByIdDesc(Account submitter);

    // Find join request for specific club and account
    Optional<ClubJoinRequest> findByClubAndSubmitter(Club club, Account submitter);

    // Check if a pending join request exists for a specific club and account
    boolean existsByClubAndSubmitterAndStatus(Club club, Account submitter, RequestStatus status);
}