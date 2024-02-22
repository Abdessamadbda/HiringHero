package com.example.backend.service;

import org.springframework.stereotype.Repository;

import com.example.backend.model.user;

public interface UserService {
    public user loginValidation(String username, String password);

    user save(user user);

    user getUserById(Long id);





}
