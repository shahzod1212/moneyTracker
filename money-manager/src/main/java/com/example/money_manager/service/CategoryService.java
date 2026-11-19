package com.example.money_manager.service;

import com.example.money_manager.dtos.CategoryDto;
import com.example.money_manager.dtos.CategoryRequest;
import com.example.money_manager.dtos.UpdateCategoryRequest;

import java.util.List;

public interface CategoryService {

    CategoryDto create(CategoryRequest categoryRequest);

    List<CategoryDto> getCategoryForCurrentUser();

    List<CategoryDto> getCategoriesByType(String type);

    CategoryDto update(Long id, UpdateCategoryRequest updateCategoryRequest);
}
