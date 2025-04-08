package com.moemhub.moem.controller;

import com.moemhub.moem.model.Post;
import com.moemhub.moem.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    // Constructor injection for PostService
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Create new post
    @PostMapping
    public ResponseEntity<Post> create(@Valid @RequestBody Post post) {
        Post createdPost = postService.createPost(post);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    // Get single post by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getById(@PathVariable Long id) {
        Post post = postService.getPost(id);
        return ResponseEntity.ok(post);
    }

    // Get all posts
    @GetMapping
    public ResponseEntity<List<Post>> getAll() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // Update existing post
    @PutMapping("/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @Valid @RequestBody Post updatedPost) {
        Post post = postService.updatePost(id, updatedPost);
        return ResponseEntity.ok(post);
    }

    // Delete post by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}