package com.example.money_manager.repository;

import com.example.money_manager.domain.Goal;
import com.example.money_manager.domain.Profile;
import com.example.money_manager.domain.enums.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByProfile(Profile profile);

    List<Goal> findByProfileId(Long profileId);

    List<Goal> findByStatus(GoalStatus status);

    List<Goal> findByProfileIdAndStatus(Long profileId, GoalStatus status);

    boolean existsByProfileIdAndName(Long profileId, String name);
}