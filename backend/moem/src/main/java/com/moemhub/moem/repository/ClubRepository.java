package com.moemhub.moem.repository;

import com.moemhub.moem.model.Club;
import com.moemhub.moem.model.Post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByTopicIn(List<String> topics);
    List<Club> findByRegion(String region);
    @Query("""
      SELECT c FROM Club c
      WHERE (:name    IS NULL OR LOWER(c.name)   LIKE LOWER(CONCAT('%', :name, '%')))
        AND (:topics  IS NULL OR c.topic IN :topics)
        AND (:region  IS NULL OR c.region = :region)
      """)
    List<Club> searchByNameAndTopicsAndRegion(
            @Param("name")   String name,
            @Param("topics") List<String> topics,
            @Param("region") String region
    );
    Page<Club> findAll(Pageable pageable);
}