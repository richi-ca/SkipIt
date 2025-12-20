package com.skipit.backend.repository;

import com.skipit.backend.entity.Contest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Integer> {
    List<Contest> findByActiveTrue();
}
