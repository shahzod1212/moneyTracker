package com.example.money_manager.exception;

public class ProfileEmailAlreadyExistsException extends RuntimeException{
    public ProfileEmailAlreadyExistsException(String message){
        super(message);
    }
}
