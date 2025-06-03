package com.moemhub.moem.controller;

import com.moemhub.moem.dto.ClubCreateDto;
import com.moemhub.moem.dto.ClubUpdateDto;
import com.moemhub.moem.dto.PostDto;
import com.moemhub.moem.dto.ClubInfoDto;
import com.moemhub.moem.dto.ClubJoinInfoDto;
import com.moemhub.moem.dto.ClubJoinRequestDto;
import com.moemhub.moem.dto.ClubMemberDto;
import com.moemhub.moem.dto.BoardDto;
import com.moemhub.moem.dto.PostSummaryDto;
import com.moemhub.moem.dto.RegisterDto;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.model.Board;
import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.ClubJoinRequest;
import com.moemhub.moem.model.Post;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.service.ClubService;
import com.moemhub.moem.service.BoardService;
import com.moemhub.moem.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubService clubService;
    private final AccountRepository accountRepository;
    private final BoardService boardService;
    private final PostService postService;

    public ClubController(
            ClubService clubService,
            AccountRepository accountRepository,
            BoardService boardService,
            PostService postService) {
        this.clubService = clubService;
        this.accountRepository = accountRepository;
        this.boardService = boardService;
        this.postService = postService;
    }

    // Endpoint for creating a new club
    @PostMapping
    public ResponseEntity<ClubInfoDto> createClub(
    			@RequestPart("data") ClubCreateDto req,
			@RequestPart(value="profile", required=false) MultipartFile profile,
            Authentication authentication) {

        String username = authentication.getName();
        Account owner = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Club created = clubService.createClub(req, profile, owner);

        ClubInfoDto resp = ClubInfoDto.builder()
                .id(created.getId())
                .name(created.getName())
                .description(created.getDescription())
                .topic(created.getTopic())
                .region(created.getRegion())
                .applicationPrecautions(created.getApplicationPrecautions())
                .profileImageName(created.getProfileImageName())
                .noticeBoardId(created.getNoticeBoard().getId())
                .activityBoardId(created.getActivityBoard().getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    // Endpoint for update club
    @PutMapping("/{clubId}")
    public ResponseEntity<ClubInfoDto> updateClub(
            @PathVariable(name="clubId") Long clubId,
            @Valid @RequestBody ClubUpdateDto req) {
    		
        Club updated = clubService.updateClub(clubId, req);

        ClubInfoDto resp = ClubInfoDto.builder()
                .id(updated.getId())
                .name(updated.getName())
                .description(updated.getDescription())
                .topic(updated.getTopic())
                .region(updated.getRegion())
                .applicationPrecautions(updated.getApplicationPrecautions())
                .profileImageName(updated.getProfileImageName())
                .noticeBoardId(updated.getNoticeBoard().getId())
                .activityBoardId(updated.getActivityBoard().getId())
                .build();

        return ResponseEntity.ok(resp);
    }

    // Endpoint for deleting a club
    @DeleteMapping("/{clubId}")
    public ResponseEntity<Void> deleteClub(@PathVariable(name="clubId") Long clubId) {
        clubService.deleteClub(clubId);
        return ResponseEntity.noContent().build();
    }

    // Endpoint for retrieving club info
    @GetMapping("/{clubId}/info")
    public ResponseEntity<ClubInfoDto> getClubInfo(@PathVariable(name="clubId") Long clubId) {
        Club club = clubService.getClubById(clubId);
        ClubInfoDto dto = ClubInfoDto.builder()
                .id(club.getId())
                .name(club.getName())
                .description(club.getDescription())
                .topic(club.getTopic())
                .region(club.getRegion())
                .applicationPrecautions(club.getApplicationPrecautions())
                .profileImageName(club.getProfileImageName())
                .noticeBoardId(club.getNoticeBoard().getId())
                .activityBoardId(club.getActivityBoard().getId())
                .build();
        return ResponseEntity.ok(dto);
    }
    @GetMapping("/{clubId}/join-info")
    public ResponseEntity<ClubJoinInfoDto> getClubJoinInfo(@PathVariable(name="clubId") Long clubId) {
    		Club club = clubService.getClubById(clubId);
    		return ResponseEntity.ok(ClubJoinInfoDto.builder().precaution(club.getApplicationPrecautions()).build());
    }
    
    @GetMapping("/{clubId}/activity")
    public ResponseEntity<List<PostSummaryDto>> getActivity(@PathVariable(name="clubId") Long clubId){
    		Club club = clubService.getClubById(clubId);
    		Board activityBoard = club.getActivityBoard();
    		List<PostSummaryDto> dto = postService.getPostSummaryByBoardId(activityBoard.getId(), 1, 5);
    		return ResponseEntity.ok(dto);
    }
    @GetMapping("/{clubId}/activity/{postId}")
    public ResponseEntity<PostDto.Response> getActivityPost(@PathVariable(name="clubId") Long clubId, @PathVariable(name="postId") Long postId){
    		Club club = clubService.getClubById(clubId);
    		Board activityBoard = club.getActivityBoard();
    		Post p = postService.getPostByClubAndBoard(clubId, activityBoard.getId(), postId);
    		return ResponseEntity.ok(toResponse(p));
    }
    private PostDto.Response toResponse(Post post) {
        PostDto.Response r = new PostDto.Response();
        r.setId(post.getId());
        r.setTitle(post.getTitle());
        r.setContent(post.getContent());
        r.setCreatedAt(post.getCreatedAt());
        r.setThumbnail(post.getThumbnail());
        r.setAuthorId(post.getAuthor().getId());
        r.setBoardId(post.getBoard().getId());
        return r;
    }
    // Change member role
    @PutMapping("/{clubId}/members/{username}/role")
    public ResponseEntity<Void> ChangeMemberRole(
            @PathVariable(name="clubId") Long clubId,
            @PathVariable(name="username") String username,
            @Valid @RequestBody ClubMemberDto.ChangeRoleRequest req) {

        clubService.changeMemberRole(clubId, username, req.getRole());
        return ResponseEntity.ok().build();
    }

    // Remove member from club
    @DeleteMapping("/{clubId}/members/{username}")
    public ResponseEntity<Void> removeMember(
            @PathVariable(name="clubId") Long clubId,
            @PathVariable(name="username") String username) {

        clubService.removeMember(clubId, username);
        return ResponseEntity.noContent().build();
    }

    // Leave from club
    @DeleteMapping("/{clubId}/members/me")
    public ResponseEntity<Void> leaveClub(
            @PathVariable(name="clubId") Long clubId,
            Authentication authentication) {

        String username = authentication.getName();
        Account me = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        clubService.leaveClub(clubId, me.getId());
        return ResponseEntity.noContent().build();
    }

    // Endpoint for creating join request
    @PostMapping("/{clubId}/join-requests")
    public ResponseEntity<ClubJoinRequestDto.Response> requestToJoin(
            @PathVariable(name="clubId") Long clubId,
            @RequestBody ClubJoinRequestDto.Request dto,
            Authentication authentication) {

        String requesterUsername = authentication.getName();
        List<String> targetUsernames = dto.getUsernames();
        String message = dto.getMessage();

        ClubJoinRequest request =
                clubService.requestToJoin(clubId, requesterUsername, targetUsernames, message);

        return ResponseEntity.ok(ClubJoinRequestDto.Response.toDto(request));
    }


    // Endpoint for retrieving pending join requests for a club
    @GetMapping("/{clubId}/join-requests")
    public ResponseEntity<List<ClubJoinRequestDto.Response>> getRequests(
            @PathVariable(name="clubId") Long clubId) {
        List<ClubJoinRequest> requests = clubService.getRequests(clubId);
        List<ClubJoinRequestDto.Response> response = requests.stream()
                .map(ClubJoinRequestDto.Response::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Endpoint for join request (approve/reject)
    @PutMapping("/join-requests/{requestId}")
    public ResponseEntity<ClubJoinRequestDto.Response> processJoinRequest(
            @PathVariable(name="requestId") Long requestId,
            @RequestBody ClubJoinRequestDto.ProcessRequest processRequest) {
        ClubJoinRequest processedRequest;
        if (processRequest.getApprove()) {
            processedRequest = clubService.approveJoinRequest(requestId, processRequest.getResponseMessage());
        } else {
            processedRequest = clubService.rejectJoinRequest(requestId, processRequest.getResponseMessage());
        }
        return ResponseEntity.ok(ClubJoinRequestDto.Response.toDto(processedRequest));
    }
    
    @GetMapping("/recommend")
    public ResponseEntity<List<ClubInfoDto>> mainRecommendClubs(@RequestParam("count") int count) {
    		return ResponseEntity.ok(clubService.mainRecommendClubs(count));
    }

    @GetMapping("/recommend/interests")
    public ResponseEntity<List<ClubInfoDto>> recommendByInterests(Authentication authentication) {
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<ClubInfoDto> recommendations =
                clubService.recommendClubsByInterests(account.getId());
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/recommend/region")
    public ResponseEntity<List<ClubInfoDto>> recommendByRegion(Authentication authentication) {
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<ClubInfoDto> recommendations =
                clubService.recommendClubsByRegion(account.getId());
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClubInfoDto>> searchClubs(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) List<String> topics,
            @RequestParam(required = false) String region) {
        List<ClubInfoDto> clubs = clubService.searchClubs(name, topics, region);
        return ResponseEntity.ok(clubs);
    }

    // Endpoint for retrieving club boards
    @GetMapping("/{clubId}/boards")
    public ResponseEntity<List<BoardDto>> listBoards(
            @PathVariable(name="clubId") Long clubId) {

        List<BoardDto> boards = boardService.listBoard(clubId);
        return ResponseEntity.ok(boards);
    }
}