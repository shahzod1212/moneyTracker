package com.example.money_manager.dtos;

import com.example.money_manager.domain.Profile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    private Long id;
    private String name;
    private String type;
    private String icon;
    private Profile profile;
    private BigDecimal budget;
    private BigDecimal totalSpending;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
