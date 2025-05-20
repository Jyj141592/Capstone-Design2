package com.moemhub.moem.service;

import com.moemhub.moem.dto.PostSummaryDto;
import org.springframework.data.domain.Page;
import com.moemhub.moem.model.Post;

import java.util.List;

public interface PostService {
    // Create new post
    Post createPost(Post post);

    // Get post by its ID
    Post getPostByID(Long id);

    // Update existing post
    Post updatePost(Long id, Post post);

    // Delete post by its ID
    void deletePost(Long id);

    // Get all posts by board ID
    Page<Post> getPostsByBoardId(Long boardId, int page, int size);

    // Get Post summary by board ID
    List<PostSummaryDto> getPostSummaryByBoardId(Long boardId, int page, int size);

    // Get Post by its ID and board ID
    Post getPostByClubAndBoard(Long clubId, Long boardId, Long postId);
}