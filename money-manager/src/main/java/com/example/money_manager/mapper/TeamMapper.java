package com.example.money_manager.mapper;

import com.example.money_manager.domain.Team;
import com.example.money_manager.dtos.TeamDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    TeamDto toDto(Team team);
}
