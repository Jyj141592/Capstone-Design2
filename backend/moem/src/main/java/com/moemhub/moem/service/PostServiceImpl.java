package com.moemhub.moem.service;

import com.moemhub.moem.model.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import com.moemhub.moem.dto.PostSummaryDto;
import com.moemhub.moem.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
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
    public Post getPostByID(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found: " + id));
    }

    @Override
    public Post updatePost(Long id, Post postData) {
        Post post = getPostByID(id);
        post.setTitle(postData.getTitle());
        post.setContent(postData.getContent());

        return postRepository.save(post);
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    @Override
    public Page<Post> getPostsByBoardId(Long boardId, int page, int size) {
        // Find posts by board ID
    		Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return postRepository.findByBoardId(boardId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostSummaryDto> getPostSummaryByBoardId(Long boardId, int page, int size) {
    	Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
    		return postRepository.findByBoardId(boardId, pageable)
                .stream()
                .map(post -> PostSummaryDto.builder()
                        .postID(post.getId())
                        .title(post.getTitle())
                        .createdAt(post.getCreatedAt())
                        .authorName(post.getAuthor().getUsername())
                        .thumbnail(post.getThumbnail())
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Post getPostByClubAndBoard(Long clubId, Long boardId, Long postId) {
        Post post = postRepository.findByIdAndBoardId(postId, boardId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Post " + postId + " not found in board " + boardId));

        if (!post.getBoard().getClub().getId().equals(clubId)) {
            throw new EntityNotFoundException(
                    "Post " + postId + " not found in club " + clubId);
        }

        return post;
    }
}
