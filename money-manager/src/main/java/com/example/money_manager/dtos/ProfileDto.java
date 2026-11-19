package com.example.money_manager.dtos;

import com.example.money_manager.domain.enums.ProfileStatus;
import lombok.Builder;
import lombok.Data;
import org.apache.logging.log4j.message.StringFormattedMessage;

import java.time.LocalDateTime;

@Data
@Builder
public class ProfileDto {
    private Long id;
    private String fullName;
    private String email;
    private ProfileStatus status;
    private String profileImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String activationToken;
}
