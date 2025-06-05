package com.swp.bdss.repository;

import com.swp.bdss.entities.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findAllByUserUsername(String username);
}
