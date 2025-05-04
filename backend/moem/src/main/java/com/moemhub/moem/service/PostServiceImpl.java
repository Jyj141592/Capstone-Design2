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
        return postRepository.save(post);
    }

    @Override
    public Post getPost(Long id) {
        // Find by ID or throw if not found
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));
    }

    @Override
    public List<Post> getAllPosts() {
        // Return all posts
        return postRepository.findAll();
    }

    @Override
    public Post updatePost(Long id, Post postData) {
        Post post = getPost(id);
        post.setTitle(postData.getTitle());
        post.setContent(postData.getContent());
        post.setSchedule(postData.getSchedule());
        post.setImages(postData.getImages());
        return postRepository.save(post);
    }

    @Override
    public void deletePost(Long id) {
        // Delete by ID
        postRepository.deleteById(id);
    }
}
