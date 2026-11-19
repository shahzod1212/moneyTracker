package com.example.money_manager.service;

import com.example.money_manager.domain.Profile;
import com.example.money_manager.dtos.AuthDto;
import com.example.money_manager.dtos.ProfileDto;
import com.example.money_manager.dtos.ProfileRequest;

import java.util.List;
import java.util.Map;

public interface ProfileService {
    ProfileDto register(ProfileRequest profileRequest);
    boolean activateProfile(String activationToken);
    boolean isActiveAccount(String email);

    Profile getCurrentProfile();

    ProfileDto getCurrentProfileDto(String email);

    Map<String, Object> generateToken(AuthDto authDto);

    List<ProfileDto> searchByName(String keyword);
}
