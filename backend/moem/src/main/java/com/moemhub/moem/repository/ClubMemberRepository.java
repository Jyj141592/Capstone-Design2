package com.moemhub.moem.repository;

import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
    // Find members of club
    List<ClubMember> findByClub(Club club);

    // Find all clubs a user is a member of
    List<ClubMember> findByAccount(Account account);

    // Find membership of a user in a club
    Optional<ClubMember> findByClubAndAccount(Club club, Account account);

    // Find members with role
    List<ClubMember> findByClubAndRole(Club club, ClubMember.Role role);
}
