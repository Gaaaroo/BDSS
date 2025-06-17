package com.swp.bdss.repository;

import com.swp.bdss.entities.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findAllByUserUserId(int userId);
    Page<Blog> findAllByOrderByBlogIdDesc(Pageable pageable);
    List<Blog> findTop3ByOrderByBlogIdDesc();
    Page<Blog> findByUser_UsernameContainingIgnoreCaseOrUserUpdate_UsernameContainingIgnoreCase(
            String userCreate, String userUpdate, Pageable pageable
    );
}
