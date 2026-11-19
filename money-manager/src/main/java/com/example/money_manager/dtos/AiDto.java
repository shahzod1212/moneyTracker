package com.example.money_manager.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiDto {
    private String type;
    private String question;
    private String summary;
    private List<String> recommendations;
}