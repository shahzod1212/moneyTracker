package com.example.money_manager.dtos;

import lombok.Data;

@Data
public class ProfileRequest {
    private String fullName;
    private String email;
    private String password;
    private String profileImageUrl;
}
