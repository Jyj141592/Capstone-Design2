package com.moemhub.moem.controller;

import com.moemhub.moem.dto.PostDto;
import com.moemhub.moem.model.Board;
import com.moemhub.moem.model.Post;
import com.moemhub.moem.model.Account;
import com.moemhub.moem.repository.BoardRepository;
import com.moemhub.moem.repository.AccountRepository;
import com.moemhub.moem.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @PathVariable Long boardId,
            @Valid @RequestBody PostDto.CreateRequest req) {

        Board board = boardRepo.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found: " + boardId));
        Account author = accountRepo.findById(req.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found: " + req.getAuthorId()));

        Post post = Post.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .schedule(req.getSchedule())
                .images(req.getImages())
                .board(board)
                .author(author)
                .build();

        Post saved = postService.createPost(post);
        return new ResponseEntity<>(toResponse(saved), HttpStatus.CREATED);
    }

    // Get post by its ID
    @GetMapping("/{postId}")
    public ResponseEntity<PostDto.Response> getById(
            @PathVariable Long postId) {

        Post post = postService.getPost(postId);
        return ResponseEntity.ok(toResponse(post));
    }

    // Get all posts
    @GetMapping
    public ResponseEntity<List<PostDto.Response>> getAll() {
        List<PostDto.Response> list = postService.getAllPosts()
                .stream().map(this::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // Update existing post
    @PutMapping("/{postId}")
    public ResponseEntity<PostDto.Response> update(
            @PathVariable Long postId,
            @Valid @RequestBody PostDto.UpdateRequest req) {

        Post postData = Post.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .schedule(req.getSchedule())
                .images(req.getImages())
                .build();

        Post updated = postService.updatePost(postId, postData);
        return ResponseEntity.ok(toResponse(updated));
    }

    // Delete post by its ID
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    private PostDto.Response toResponse(Post post) {
        PostDto.Response r = new PostDto.Response();
        r.setId(post.getId());
        r.setTitle(post.getTitle());
        r.setContent(post.getContent());
        r.setCreatedAt(post.getCreatedAt());
        r.setSchedule(post.getSchedule());
        r.setImages(post.getImages());
        r.setAuthorId(post.getAuthor().getId());
        r.setBoardId(post.getBoard().getId());
        return r;
    }
}