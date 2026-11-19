package com.example.money_manager.controller;

import com.example.money_manager.dtos.CategoryDto;
import com.example.money_manager.dtos.CategoryRequest;
import com.example.money_manager.dtos.UpdateCategoryRequest;
import com.example.money_manager.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@AllArgsConstructor
public class CategoryController {

    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryDto> create(
            @RequestBody CategoryRequest categoryRequest){
        CategoryDto dto = categoryService.create(categoryRequest);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategory(){
        List<CategoryDto> list = categoryService.getCategoryForCurrentUser();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<CategoryDto>> getType(@PathVariable(name = "type") String type){
        List<CategoryDto> list = categoryService.getCategoriesByType(type);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> update(
            @PathVariable(name = "id") Long id,
            @RequestBody UpdateCategoryRequest updateCategoryRequest
    ){
        CategoryDto dto = categoryService.update(id, updateCategoryRequest);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(dto);
    }
}
