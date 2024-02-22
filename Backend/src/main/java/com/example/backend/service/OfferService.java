package com.example.backend.service;

import java.util.Map;

public interface OfferService {
    String generateRandomString(int length);
    void sharePostOnLinkedIn(String accessToken, String linkedinUserId, String postContent);
}
