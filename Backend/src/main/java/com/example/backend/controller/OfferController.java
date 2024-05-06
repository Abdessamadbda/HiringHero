package com.example.backend.controller;

import com.example.backend.model.Offer;
import com.example.backend.model.user;
import com.example.backend.repository.OfferRepository;
import com.example.backend.security.JWTGenerator;
import com.example.backend.service.OfferService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.apache.pdfbox.pdmodel.PDDocument;

import org.apache.pdfbox.text.PDFTextStripper;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.bson.types.ObjectId;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@Configuration
public class OfferController {
    private final RestTemplate restTemplate;
    private final OfferService offerService;
    @Value("${linkedin.clientId}")
    private String clientId;

    @Value("${linkedin.clientSecret}")
    private String clientSecret;

    @Value("${linkedin.redirectUri}")
    private String redirectUri;
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
    @PostMapping("/exchange-code-for-access-token")
    public ResponseEntity<String> exchangeCodeForAccessToken(@RequestBody String code) {
        String tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
        String requestBody = "grant_type=authorization_code" +
                "&code=" + code +
                "&redirect_uri=" + redirectUri +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);
        return response;
    }

    @PostMapping("/share-on-linkedin")
    public ResponseEntity<String> shareOnLinkedIn(@RequestBody String content, @RequestBody String accessToken) {
        String shareUrl = "https://api.linkedin.com/v2/shares";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(content, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(shareUrl, request, String.class);

        return response;
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
            String userId = JWTGenerator.getIdFromJWT(token);
            // Parse currentUserString to your user object if necessary
            //user currentUser = new ObjectMapper().readValue(currentUserString, user.class); // Deserialize currentUser directly
            String email = formData.get("email");
            String position = formData.get("position");
            String experience = formData.get("experience");
            String education = formData.get("education");
            String description = formData.get("description");
            String address = formData.get("address");
            String keywords = formData.get("keywords");

            // Create an Offer object
            Offer offer = new Offer(userId, companyName, email, position, experience, education, description, address,keywords);

            // Process form data...
            offerRepository.save(offer);

            // Return success response
            return ResponseEntity.ok("Job offer saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the job offer.");
        }
    }

    // Helper method to parse user object
    private user parseUser(String userString) {
        // Assuming userString is in JSON format
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Deserialize the JSON string to User object
            return objectMapper.readValue(userString, user.class);
        } catch (JsonProcessingException e) {
            // Handle parsing exception
            e.printStackTrace();
            return null; // Or throw an exception based on your requirements
        }
    }
    @PostMapping("/file")
    public ResponseEntity<List<CVResult>> uploadFiles(@RequestParam("cvFiles") MultipartFile[] cvFiles) {
        List<CVResult> results = new ArrayList<>();
        try {
            for (MultipartFile file : cvFiles) {
                String text = parsePDF(file.getBytes());
                results.add(new CVResult(file.getOriginalFilename(), text));
            }
            return ResponseEntity.ok(results);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/upload-cvs")
    public ResponseEntity<List<CVMarkResult>> uploadCVsAndKeywords(@RequestParam("keywords") String keywords,
                                                                   @RequestPart("cvFiles") MultipartFile[] cvFiles) {
        // Your code to process cvFiles and keywords


    List<CVMarkResult> results = new ArrayList<>();
        try {
            for (MultipartFile file : cvFiles) {
                String text = parsePDF(file.getBytes());
                int mark = calculateMark(text, keywords);
                results.add(new CVMarkResult(file.getOriginalFilename(), mark));
            }
            return ResponseEntity.ok(results);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    private String parsePDF(byte[] pdfData) throws IOException {
        try (PDDocument document = PDDocument.load(new ByteArrayInputStream(pdfData))) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private int calculateMark(String text, String keywordsJson) {
        System.out.println("Text: " + text);
        System.out.println("Keywords: " + keywordsJson);
        String keywords;
        try {
            JSONObject jsonObject = new JSONObject(keywordsJson);
            keywords = jsonObject.getString("keywords");
        } catch (JSONException e) {
            e.printStackTrace();
            return -1; // Handle JSON parsing error
        }

        // Split the text into words
        String[] words = text.toLowerCase().split("\\W+");

        // Split the keywords
        String[] keywordArray = keywords.split(",\\s*");
        // Split by comma followed by optional whitespace
        int matchingWords = 0;
        for (String word : words) {
            for (String keyword : keywordArray) {
                if (word.equals(keyword)) {
                    matchingWords++;
                    break;
                }
            }
        }
        double matchPercentage = ((double) matchingWords / words.length) * 100;
        return (int) Math.round(matchPercentage);
    }


    static class CVResult {
        private String filename;
        private String text;

        public CVResult(String filename, String text) {
            this.filename = filename;
            this.text = text;
        }

        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    static class CVMarkResult {
        private String filename;
        private int mark;

        public CVMarkResult(String filename, int mark) {
            this.filename = filename;
            this.mark = mark;
        }

        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }

        public int getMark() {
            return mark;
        }

        public void setMark(int mark) {
            this.mark = mark;
        }
    }

    @GetMapping("/offers/{offerId}/keywords")
    public ResponseEntity<Map<String, String>> getOfferKeywords(@PathVariable String offerId) {
        try {
            ObjectId objectId = new ObjectId(offerId); // Convert offerId to ObjectId
            Optional<Offer> offerOptional = offerRepository.findById(objectId);
            if (offerOptional.isPresent()) {
                Offer offer = offerOptional.get();
                String keywords = offer.getKeywords();
                // Construct a map with "keywords" as the key and the actual keywords as the value
                Map<String, String> response = new HashMap<>();
                response.put("keywords", keywords);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Invalid ObjectId format
        }
    }

}