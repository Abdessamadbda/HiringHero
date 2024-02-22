package com.example.backend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.model.LoginRequest;
import com.example.backend.model.UserDTO;
import com.example.backend.model.user;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JWTGenerator;
import org.json.JSONObject; // Import the JSONObject class

import com.example.backend.service.UserService;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@Configuration
public class UserController {
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private JWTGenerator jwtGenerator;
    @Autowired
    private final UserService userService;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository,JWTGenerator jwtGenerator) {
        this.userService = userService;
        this.jwtGenerator = jwtGenerator;
        this.userRepository = userRepository;
    }
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> authLogin(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        user user = userService.loginValidation(username, password);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new UserLoginResponse(null, null));
        }

        String token = jwtGenerator.generateToken(user.getEmail(), "user");
        UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getLastName(), user.getFirstName(),
                user.getCompany());
        return ResponseEntity.ok(new UserLoginResponse(userDTO, token));
    }

    private UserDTO createUserDTO(user user) {
        return new UserDTO(user.getId(), user.getEmail(), user.getLastName(), user.getFirstName(),
                user.getCompany());
    }

    public class UserLoginResponse {
        private UserDTO user;
        private String token;

        public UserLoginResponse(UserDTO user, String token) {
            this.user = user;
            this.token = token;
        }

        public UserDTO getUser() {
            return user;
        }

        public void setUser(UserDTO user) {
            this.user = user;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyToken(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Check if Authorization header is present
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Invalid token\"}");
            }

            // Extract token from Authorization header
            String token = authorizationHeader.replace("Bearer ", "");
            // Print token for debugging
            System.out.println("Token: " + token);

            // Check if jwtGenerator is null
            if (jwtGenerator == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"JWTGenerator is null\"}");
            }

            // Verify token using your JWTGenerator or any other method you prefer
            boolean isValid = jwtGenerator.validateToken(token);

            if (isValid) {
                // Create a JSON object for the response
                JSONObject responseJson = new JSONObject();
                responseJson.put("message", "Token is valid");

                // Return the JSON response
                return ResponseEntity.ok(responseJson.toString());
            } else {
                // Create a JSON object for the response
                JSONObject responseJson = new JSONObject();
                responseJson.put("message", "Invalid token");

                // Return the JSON response
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseJson.toString());
            }
        } catch (Exception e) {
            // Create a JSON object for the response
            JSONObject responseJson = new JSONObject();
            responseJson.put("message", "Invalid token");

            // Return the JSON response
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseJson.toString());
        }
    }




    @PostMapping("/user/save")
    public ResponseEntity<user> saveUser(@RequestBody user user) {
        user savedUser = userService.save(user);
        if (savedUser != null) {
            return ResponseEntity.ok(savedUser);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}