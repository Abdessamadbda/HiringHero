package com.example.backend.serviceImpl;

import com.example.backend.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class OfferServiceImpl implements OfferService {
    private final RestTemplate restTemplate;

    public OfferServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public String generateRandomString(int length) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[length];
        random.nextBytes(bytes);
        return new String(bytes);
    }

    @Override
    public void sharePostOnLinkedIn(String accessToken, String linkedinUserId, String postContent) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("author", "urn:li:person:" + linkedinUserId);
        requestBody.put("lifecycleState", "PUBLISHED");

        Map<String, Object> specificContent = new HashMap<>();
        Map<String, Object> shareContent = new HashMap<>();
        shareContent.put("shareCommentary", Map.of("text", postContent));
        shareContent.put("shareMediaCategory", "NONE");
        specificContent.put("com.linkedin.ugc.ShareContent", shareContent);

        requestBody.put("specificContent", specificContent);

        Map<String, String> visibility = new HashMap<>();
        visibility.put("com.linkedin.ugc.MemberNetworkVisibility", "CONNECTIONS");
        requestBody.put("visibility", visibility);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity("https://api.linkedin.com/v2/ugcPosts", request, Map.class);
        System.out.println("Post shared successfully: " + response.getBody());
    }
}
