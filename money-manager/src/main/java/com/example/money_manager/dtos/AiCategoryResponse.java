package com.example.money_manager.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCategoryResponse {
    private Long categoryId;
    private String categoryName;
    private String type;
    private BigDecimal budget;
    private String icon;
    private boolean isNew;
}