package com.example.money_manager.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(
            MethodArgumentNotValidException ex
    ){
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(ProfileNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProfileNotFoundException(
            ProfileNotFoundException ex
    ){
        Map<String, String> errors = new HashMap<>();

        errors.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(ProfileEmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleProfileAlreadyExistException(
            ProfileEmailAlreadyExistsException ex
    ){
        Map<String, String> errors = new HashMap<>();

        errors.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(ProfileEmailNotExistException.class)
    public ResponseEntity<Map<String, String>> handleProfileEmailNotExistException(
            ProfileEmailNotExistException ex
    ){
        Map<String, String> errors = new HashMap<>();

        errors.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(CategoryAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleCategoryException(
            CategoryAlreadyExistsException ex
    ){
        Map<String, String> errors = new HashMap<>();

        errors.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleCategoryNotFound(
            CategoryNotFoundException ex
    ){
        Map<String, String> errors = new HashMap<>();

        errors.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }
}
