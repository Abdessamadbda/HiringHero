package com.example.backend.security;

import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JWTGenerator {
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);	
    public String generateToken(String id,String username, String role) {
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + com.example.backend.security.SecurityConstants.JWT_EXPIRATION);

        String token = Jwts.builder()
                .setSubject(username)
				.claim("id", id)
				//     .claim("role", role)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(SECRET_KEY)
                .compact();
        
        return token;
    }
	public static String getEmailFromJWT(String token){
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(SECRET_KEY)
				.build()
				.parseClaimsJws(token)
				.getBody();
		return claims.getSubject();
	}
	public static String getIdFromJWT(String token){
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(SECRET_KEY)
				.build()
				.parseClaimsJws(token)
				.getBody();
		return (String) claims.get("id");
	}
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder()
			.setSigningKey(SECRET_KEY)
			.build()
			.parseClaimsJws(token);
			return true;
		} catch (Exception ex) {
			throw new AuthenticationCredentialsNotFoundException("JWT was exprired or incorrect",ex.fillInStackTrace());
		}
	}

}
