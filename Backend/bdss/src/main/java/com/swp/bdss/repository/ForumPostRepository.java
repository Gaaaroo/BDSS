package com.swp.bdss.repository;

import com.swp.bdss.entities.ForumPost;
import com.swp.bdss.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    List<ForumPost> findByTitleContainingOrContentContainingOrderByPostIdDesc(String title, String content);

    List<ForumPost> findByUser(User user);

    @Query("SELECT p FROM ForumPost p ORDER BY postId DESC")
    List<ForumPost> findAll();
}
