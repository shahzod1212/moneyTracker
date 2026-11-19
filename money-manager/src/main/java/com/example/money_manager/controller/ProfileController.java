package com.example.money_manager.controller;

import com.example.money_manager.domain.Profile;
import com.example.money_manager.dtos.AuthDto;
import com.example.money_manager.dtos.ProfileDto;
import com.example.money_manager.dtos.ProfileRequest;
import com.example.money_manager.service.ProfileService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@AllArgsConstructor
public class ProfileController {
    private ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<ProfileDto> register(
            @RequestBody ProfileRequest profileRequest
            ){
        ProfileDto dto = profileService.register(profileRequest);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activateProfile(@RequestParam String token){
        boolean isActive = profileService.activateProfile(token);
        if(isActive){
            return ResponseEntity.ok("Profile activated successfully");
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation token not found");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDto authDto){
        try {
            if(!profileService.isActiveAccount(authDto.getEmail())){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Please activate your account"));
            }
            Map<String, Object> response = profileService.generateToken(authDto);
            return ResponseEntity.ok(response);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("message", "error"+e));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDto> getProfile(){
        ProfileDto profile= profileService.getCurrentProfileDto(null);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/search-name")
    public ResponseEntity<List<ProfileDto>> searchByFullName(
            @RequestParam(name = "keyword") String keyword
    ){
        List<ProfileDto> list = profileService.searchByName(keyword);
        return ResponseEntity.ok().body(list);
    }


}
