package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.model.Offer;
public interface OfferRepository extends MongoRepository<Offer, Long> {

}