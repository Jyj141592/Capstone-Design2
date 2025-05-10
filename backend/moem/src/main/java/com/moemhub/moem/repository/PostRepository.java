package com.moemhub.moem.repository;

import com.moemhub.moem.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByBoardId(Long boardId);
    Optional<Post> findByIdAndBoardId(Long postId, Long boardId);
}