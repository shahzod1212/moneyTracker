package com.example.money_manager.mapper;

import com.example.money_manager.domain.Category;
import com.example.money_manager.dtos.CategoryDto;
import com.example.money_manager.dtos.CategoryRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "budget", source = "budget")
    Category toEntity(CategoryRequest categoryRequest);

    @Mapping(target = "budget", source = "budget")
    @Mapping(target = "totalSpending", source = "totalSpending")
    CategoryDto toDto(Category category);
}
