package com.moemhub.moem.service;

import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubJoinRequest;
import com.moemhub.moem.model.ClubMember;

import java.util.List;

public interface ClubService {

    // Create new club
    Club createClub(Club club);

    // Update existing club information
    Club updateClub(Long id, Club club);

    // Delete club by its ID
    void deleteClub(Long id);

    // Retrieve all members of given club
    List<ClubMember> getClubMembers(Long clubId);

    // Change role of club member
    void changeMemberRole(Long clubId, Long accountId, ClubMember.Role role);

    // Remove member from club (for admins)
    void removeMember(Long clubId, Long accountId);

    // Allow member to leave club on their own
    void leaveClub(Long clubId, Long accountId);

    // Create join request with given message
    ClubJoinRequest requestToJoin(Long clubId, Long accountId, String message);

    // Retrieve all join requests pending for club
    List<ClubJoinRequest> getPendingRequests(Long clubId);

    // Retrieve join request by request ID
    ClubJoinRequest getJoinRequest(Long requestId);

    // Approve join request
    ClubJoinRequest approveJoinRequest(Long requestId, String responseMessage);

    // Reject join request and update response message
    ClubJoinRequest rejectJoinRequest(Long requestId, String responseMessage);
}
