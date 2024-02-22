package com.example.backend.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.user;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public user loginValidation(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    @Override
    public user save(user user) {
        return userRepository.save(user);
    }

    @Override
    public user getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Other methods can be implemented similarly using userRepository
}
