package com.example.backend.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.model.Offer;

import java.util.List;
import java.util.Optional;

public interface OfferRepository extends MongoRepository<Offer, Long> {
    List<Offer> findAll();
    List<Offer> findByUserId(String userId);

    Optional<Offer> findById(ObjectId objectId);
}