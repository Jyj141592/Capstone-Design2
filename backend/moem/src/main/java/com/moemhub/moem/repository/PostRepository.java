package com.moemhub.moem.repository;

import com.moemhub.moem.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Provide basic CRUD and paging/sorting for Post
}