package com.example.money_manager.exception;

public class ProfileEmailNotExistException extends RuntimeException{
    public ProfileEmailNotExistException(String message){
        super(message);
    }
}
