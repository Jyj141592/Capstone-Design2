package com.moemhub.moem.service;

import com.moemhub.moem.dto.ClubInfoDto;
import com.moemhub.moem.dto.ClubCreateDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubJoinRequest;
import com.moemhub.moem.model.ClubMember;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ClubService {

    // Create new club
    Club createClub(ClubCreateDto club, MultipartFile profile, Account owner);

    // Update existing club information
    Club updateClub(Long clubId, Club club);

    // Delete club by its ID
    void deleteClub(Long clubId);

    // Retrieve club by its ID
    Club getClubById(Long clubId);

    // Retrieve all members of given club
    List<ClubMember> getClubMembers(Long clubId);

    // Change role of club member
    void changeMemberRole(Long clubId, String username, ClubMember.Role role);

    // Remove member from club (for admins)
    void removeMember(Long clubId, String username);

    // Allow member to leave club on their own
    void leaveClub(Long clubId, Long accountId);

    // Create join request with given message
    List<ClubJoinRequest> requestToJoin(Long clubId, String requesterUsername, List<String> targetUsernames, String message);

    // Retrieve all join requests pending for club
    List<ClubJoinRequest> getPendingRequests(Long clubId);

    // Retrieve join request by request ID
    ClubJoinRequest getJoinRequest(Long requestId);

    // Approve join request
    ClubJoinRequest approveJoinRequest(Long requestId, String responseMessage);

    // Reject join request and update response message
    ClubJoinRequest rejectJoinRequest(Long requestId, String responseMessage);
    
    List<ClubInfoDto> mainRecommendClubs(int count);
    // Recommend clubs based on interests
    List<ClubInfoDto> recommendClubsByInterests(Long accountId);

    // Recommend clubs based on region
    List<ClubInfoDto> recommendClubsByRegion(Long accountId);

    // Search for clubs by name, topics, and region
    List<ClubInfoDto> searchClubs(String name, List<String> topics, String region);

}
