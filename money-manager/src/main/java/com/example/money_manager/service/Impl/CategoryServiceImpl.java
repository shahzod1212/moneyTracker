package com.example.money_manager.service.Impl;

import com.example.money_manager.domain.Category;
import com.example.money_manager.domain.Profile;
import com.example.money_manager.dtos.CategoryDto;
import com.example.money_manager.dtos.CategoryRequest;
import com.example.money_manager.dtos.UpdateCategoryRequest;
import com.example.money_manager.exception.CategoryAlreadyExistsException;
import com.example.money_manager.exception.CategoryNotFoundException;
import com.example.money_manager.mapper.CategoryMapper;
import com.example.money_manager.repository.CategoryRepository;
import com.example.money_manager.service.CategoryService;
import com.example.money_manager.service.ProfileService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private ProfileService profileService;
    private CategoryMapper categoryMapper;
    private CategoryRepository categoryRepository;
    @Override
    public CategoryDto create(CategoryRequest categoryRequest) {
        Profile  profile   =profileService.getCurrentProfile();
        if(categoryRepository.existsByNameAndProfileId(categoryRequest.getName(), profile.getId())){
            throw new CategoryAlreadyExistsException("Category Already exists in your dashboard");
        }
        Category category = categoryMapper.toEntity(categoryRequest);
        category.setProfile(profile);
        category.setTotalSpending(BigDecimal.ZERO);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }

    @Override
    public List<CategoryDto> getCategoryForCurrentUser() {
        Profile  profile   =profileService.getCurrentProfile();
        List<CategoryDto> list = categoryRepository.findByProfileId(profile.getId())
                .stream().map(categoryMapper::toDto)
                .toList();
        return list;
    }

    @Override
    public List<CategoryDto> getCategoriesByType(String type) {
        Profile  profile   =profileService.getCurrentProfile();
        List<CategoryDto>  list = categoryRepository.findByTypeAndProfileId(type, profile.getId())
                .stream()
                .map(categoryMapper::toDto)
                .toList();
        return list;
    }

    @Override
    public CategoryDto update(Long id, UpdateCategoryRequest updateCategoryRequest) {
        Profile profile = profileService.getCurrentProfile();
        Category category = categoryRepository.findByIdAndProfileId(id, profile.getId())
                .orElseThrow(()->new CategoryNotFoundException("Category not found"));
        category.setName(updateCategoryRequest.getName());
        category.setType(updateCategoryRequest.getType());
        category.setIcon(updateCategoryRequest.getIcon());
        category.setProfile(profile);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }
}
