package com.example.backend.controller;

import com.example.backend.model.Offer;
import com.example.backend.repository.OfferRepository;
import com.example.backend.security.JWTGenerator;
import com.example.backend.service.OfferService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@Configuration
public class OfferController {
    private final RestTemplate restTemplate;
    private final OfferService offerService;
    @Autowired
    private JWTGenerator jwtGenerator;
    private final OfferRepository offerRepository;


    @Autowired
    public OfferController(RestTemplate restTemplate, OfferService offerService,JWTGenerator jwtGenerator,OfferRepository offerRepository) {
        this.restTemplate = restTemplate;
        this.offerService = offerService;
        this.jwtGenerator = jwtGenerator;
        this.offerRepository = offerRepository;

    }
    @GetMapping("/auth/linkedin")
    public String authLinkedin(HttpSession session) {
        String state = offerService.generateRandomString(32);
        session.setAttribute("state", state);

        return "redirect:https://www.linkedin.com/oauth/v2/authorization?"
                + "response_type=code"
                + "&client_id=" + System.getenv("CLIENT_ID")
                + "&redirect_uri=http://localhost:8080/auth/linkedin/callback"
                + "&state=" + state
                + "&scope=r_liteprofile%20w_member_social";
    }

    @GetMapping("/auth/linkedin/callback")
    public String authLinkedinCallback(HttpSession session, @RequestParam String code, @RequestParam String state) {
        String sessionState = (String) session.getAttribute("state");
        if (!state.equals(sessionState)) {
            return "State mismatch";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> data = new HashMap<>();
        data.put("grant_type", "authorization_code");
        data.put("code", code);
        data.put("redirect_uri", "http://localhost:8080/auth/linkedin/callback");
        data.put("client_id", System.getenv("CLIENT_ID"));
        data.put("client_secret", System.getenv("CLIENT_SECRET"));

        HttpEntity<Map<String, String>> request = new HttpEntity<>(data, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity("https://www.linkedin.com/oauth/v2/accessToken", request, Map.class);
        String accessToken = (String) response.getBody().get("access_token");

        session.setAttribute("accessToken", accessToken);

        return "redirect:/form";
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submit(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, String> formData) {
        try {
            // Validate JWT token
            String token = authorizationHeader.replace("Bearer ", "");
            if (!jwtGenerator.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT token is invalid or expired");
            }

            // Retrieve form data from the request body

            String companyName = formData.get("companyName");
            String email = formData.get("email");
            String position = formData.get("position");
            String experience = formData.get("experience");
            String education = formData.get("education");
            String description = formData.get("description");
            String address = formData.get("address");
Offer offer=new Offer(companyName,email,position,experience,education,description,address);
            // Process form data...
            offerRepository.save(offer);

            // Return success response
            return ResponseEntity.ok("Job offer saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the job offer.");
        }
    }

}