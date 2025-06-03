package com.swp.bdss.repository;

import com.swp.bdss.entities.InvalidatedToken;
import com.swp.bdss.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
}
