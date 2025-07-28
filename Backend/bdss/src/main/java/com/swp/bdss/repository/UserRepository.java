package com.swp.bdss.repository;

import com.swp.bdss.entities.OtpCode;
import com.swp.bdss.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    Page<User> findByUsernameNot(String username, Pageable pageable);

    List<User> findByBloodTypeAndIsActiveTrue(String bloodType);

    @Query("SELECT u FROM User u " +
            "WHERE u.username <> :excludedUsername AND " +
            "(" +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            ")")
    Page<User> searchUsersExcludingAdmin(
            @Param("excludedUsername") String excludedUsername,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
