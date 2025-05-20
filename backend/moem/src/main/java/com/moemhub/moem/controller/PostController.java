package com.moemhub.moem.controller;

import com.moemhub.moem.dto.PostDto;
import org.springframework.data.domain.Page;
import com.moemhub.moem.dto.PostSummaryDto;
import com.moemhub.moem.model.Board;
import com.moemhub.moem.model.Post;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.repository.BoardRepository;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clubs/{clubId}/boards/{boardId}/posts")
public class PostController {

    private final PostService postService;
    private final BoardRepository boardRepo;
    private final AccountRepository accountRepo;

    public PostController(PostService postService,
                          BoardRepository boardRepo,
                          AccountRepository accountRepo) {
        this.postService = postService;
        this.boardRepo   = boardRepo;
        this.accountRepo = accountRepo;
    }

    // Create new post
    @PostMapping
    public ResponseEntity<PostDto.Response> create(
            @PathVariable Long clubId,
            @PathVariable Long boardId,
            @Valid @RequestBody PostDto.CreateRequest req) {
    		String username = SecurityContextHolder.getContext().getAuthentication().getName();
    		
        Board board = boardRepo.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found: " + boardId));
        Account author = accountRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Author not found: " + username));

        Post post = Post.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .board(board)
                .author(author)
                .build();

        Post saved = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    // Get post by its ID
    @GetMapping("/{postId}")
    public ResponseEntity<PostDto.Response> getById(
            @PathVariable Long clubId,
            @PathVariable Long boardId,
            @PathVariable Long postId
            ) {

        Post post = postService.getPostByClubAndBoard(clubId, boardId, postId);
        return ResponseEntity.ok(toResponse(post));
    }

    // Update existing post
    @PutMapping("/{postId}")
    public ResponseEntity<PostDto.Response> update(
            @PathVariable Long clubId,
            @PathVariable Long boardId,
            @PathVariable Long postId,
            @Valid @RequestBody PostDto.UpdateRequest req) {

        Post postData = Post.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .build();

        Post updated = postService.updatePost(postId, postData);
        return ResponseEntity.ok(toResponse(updated));
    }

    // Delete post by its ID
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long clubId,
            @PathVariable Long boardId,
            @PathVariable Long postId) {

        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    // Get all posts by board ID
    @GetMapping
    public ResponseEntity<List<PostDto.Response>> getPostsByBoardId(
            @PathVariable Long clubId,
            @PathVariable Long boardId,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="10") int size) {

        Page<Post> posts = postService.getPostsByBoardId(boardId, page, size);
        List<PostDto.Response> dtoList = posts.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }


    // Get Post summary by board ID
    @GetMapping("/summary")
    public ResponseEntity<List<PostSummaryDto>> getPostSummaries(
            @PathVariable Long clubId,
            @PathVariable Long boardId,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="10") int size) {

        List<PostSummaryDto> summaries = postService.getPostSummaryByBoardId(boardId, page, size);
        return ResponseEntity.ok(summaries);
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
}