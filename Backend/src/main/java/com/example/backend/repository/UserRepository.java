package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.model.user;
import java.util.Optional;

public interface UserRepository extends MongoRepository<user, Long> {
    Optional<user> findByEmail(String email);
    user findByEmailAndPassword(String email, String password);

    Boolean existsByEmail(String email);

    Optional<user> findById(Long id);

}