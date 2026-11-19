package com.example.money_manager.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FilterDto {
    private  String type;
    private LocalDate  start;
    private LocalDate end;
    private String name;
    private String sortField;
    private String sortOrder;
}
