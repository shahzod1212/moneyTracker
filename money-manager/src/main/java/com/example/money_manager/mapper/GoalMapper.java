package com.example.money_manager.mapper;

import com.example.money_manager.domain.Goal;
import com.example.money_manager.dtos.GoalDto;
import com.example.money_manager.dtos.GoalRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GoalMapper {

    Goal toEntity(GoalRequest goalRequest);

    @Mapping(target = "profileId", source = "profile.id")
    GoalDto toDto(Goal goal);
}
