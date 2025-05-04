package com.moemhub.moem.service;

import com.moemhub.moem.model.Post;

import java.util.List;

public interface PostService {
    // Create new post
    Post createPost(Post post);

    // Get post by its ID
    Post getPost(Long id);

    // Get all posts
    List<Post> getAllPosts();

    // Update existing post
    Post updatePost(Long id, Post post);

    // Delete post by its ID
    void deletePost(Long id);
}