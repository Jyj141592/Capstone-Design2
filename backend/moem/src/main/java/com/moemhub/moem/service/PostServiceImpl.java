package com.moemhub.moem.service;

import com.moemhub.moem.model.Post;
import com.moemhub.moem.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public Post createPost(Post post) {
        // Save and return new post
        return postRepository.save(post);
    }

    @Override
    public Post getPost(Long id) {
        // Find by ID or throw if not found
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Override
    public List<Post> getAllPosts() {
        // Return all posts
        return postRepository.findAll();
    }

    @Override
    public Post updatePost(Long id, Post updated) {
        // Fetch existing post
        Post post = getPost(id);
        // Apply updates
        post.setTitle(updated.getTitle());
        post.setContent(updated.getContent());
        // Save and return
        return postRepository.save(post);
    }

    @Override
    public void deletePost(Long id) {
        // Delete by ID
        postRepository.deleteById(id);
    }
}
