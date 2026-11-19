package com.example.money_manager.mapper;

import com.example.money_manager.domain.Profile;
import com.example.money_manager.dtos.ProfileDto;
import com.example.money_manager.dtos.ProfileRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    Profile toEntity(ProfileRequest profileRequest);

    @Mapping(target = "status", source = "status")
    ProfileDto toDto(Profile profile);
}