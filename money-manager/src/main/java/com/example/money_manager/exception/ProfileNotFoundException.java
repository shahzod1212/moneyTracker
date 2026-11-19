package com.example.money_manager.exception;

public class ProfileNotFoundException extends RuntimeException{
    public ProfileNotFoundException(String message){
        super(message);
    }
}
