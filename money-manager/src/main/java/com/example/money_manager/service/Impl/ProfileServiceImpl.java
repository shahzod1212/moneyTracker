package com.example.money_manager.service.Impl;

import com.example.money_manager.config.util.JwtUtil;
import com.example.money_manager.domain.Profile;
import com.example.money_manager.domain.enums.ProfileStatus;
import com.example.money_manager.dtos.AuthDto;
import com.example.money_manager.dtos.ProfileDto;
import com.example.money_manager.dtos.ProfileRequest;
import com.example.money_manager.exception.ProfileEmailAlreadyExistsException;
import com.example.money_manager.exception.ProfileEmailNotExistException;
import com.example.money_manager.mapper.ProfileMapper;
import com.example.money_manager.repository.ProfileRepository;
import com.example.money_manager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public ProfileDto register(ProfileRequest profileRequest) {
        Profile profile = profileMapper.toEntity(profileRequest);

        if(profileRepository.findByEmail(profile.getEmail()).isPresent()){
            throw new ProfileEmailAlreadyExistsException(
                    "Already user registered with this email");
        }

        profile.setActivationToken(UUID.randomUUID().toString());
        profile.setPassword(
                passwordEncoder.encode(profileRequest.getPassword()));
        profile.setStatus(ProfileStatus.SINGLE);

        Profile saved = profileRepository.save(profile);

        return profileMapper.toDto(saved);
    }

    @Override
    public boolean activateProfile(String activationToken) {
        return profileRepository.findByActivationToken(activationToken)
                .map(profile -> {
                    profile.setIsActive(true);
                    profileRepository.save(profile);
                    return true;
                }).orElse(false);
    }

    public boolean isActiveAccount(String email){
        return profileRepository.findByEmail(email)
                .map(Profile::getIsActive)
                .orElse(false);
    }

    @Override
    public Profile getCurrentProfile() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return profileRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ProfileEmailNotExistException("Profile not exists"));
    }

    @Override
    public ProfileDto getCurrentProfileDto(String email) {
        Profile current;

        if(email == null){
            current = getCurrentProfile();
        } else {
            current = profileRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new ProfileEmailNotExistException("Email not exists"));
        }

        return profileMapper.toDto(current);
    }

    @Override
    public Map<String, Object> generateToken(AuthDto authDto) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authDto.getEmail(),
                            authDto.getPassword()
                    )
            );
            String jwt = jwtUtil.generateToken(authDto.getEmail());

            return Map.of(
                    "token", jwt,
                    "user", getCurrentProfileDto(authDto.getEmail())
            );

        } catch (Exception e){
            throw new RuntimeException("Invalid email or password");
        }
    }

    @Override
    public List<ProfileDto> searchByName(String keyword) {
        return profileRepository.findByFullNameContaining(keyword)
                .stream()
                .map(profileMapper::toDto)
                .toList();
    }
}