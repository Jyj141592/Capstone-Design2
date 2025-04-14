package com.moemhub.moem.service;

import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubMember;
import java.util.List;

public interface ClubService {
    // Create new club
    Club createClub(Club club);

    // Update existing club
    Club updateClub(Long id, Club club);

    // Delete club by id
    void deleteClub(Long id);

    // Request to join club (for public clubs)
    void requestToJoin(Long clubId, Long accountId);

    // Approve membership request
    void approveJoinRequest(Long clubId, Long accountId);

    // Reject membership request
    void rejectJoinRequest(Long clubId, Long accountId);

    // Member role management
    void changeMemberRole(Long clubId, Long accountId, ClubMember.Role role);

    // Remove member (admin function)
    void removeMember(Long clubId, Long accountId);

    // Leave club (self-initiated by member)
    void leaveClub(Long clubId, Long accountId);

    // Get all members of a club
    List<ClubMember> getClubMembers(Long clubId);

    // Get all pending membership requests
    List<ClubMember> getPendingMembers(Long clubId);

    // Get specific member information
    ClubMember getClubMember(Long clubId, Long accountId);

}