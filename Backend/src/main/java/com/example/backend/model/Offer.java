package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Offer")
public class Offer {
    @Id
    private String id;
    private String userId;

    private String companyName;
    private String email;
    private String position;
    private String experience;
    private String education;
    private String description;
    private String address;
    private String keywords;

    public Offer() {
    }

    // Constructors, getters, setters
    public Offer(String id, String userId, String companyName, String email, String position, String experience, String education, String description, String address, String keywords) {
        this.id = id;
        this.userId = userId;
        this.companyName = companyName;
        this.email = email;
        this.position = position;
        this.experience = experience;
        this.education = education;
        this.description = description;
        this.address = address;
    }
    public Offer(String userId, String companyName, String email, String position, String experience, String education, String description, String address, String keywords) {
        this.companyName = companyName;
        this.email = email;
        this.position = position;
        this.experience = experience;
        this.education = education;
        this.description = description;
        this.address = address;
        this.userId = userId;
        this.keywords = keywords;

    }
    public Offer( String companyName, String email, String position, String experience, String education, String description, String address) {
        this.companyName = companyName;
        this.email = email;
        this.position = position;
        this.experience = experience;
        this.education = education;
        this.description = description;
        this.address = address;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    @Override
    public String toString() {
        return "JobOffer{" +
                "id='" + id + '\'' +
                "userId='" + userId + '\'' +
                ", companyName='" + companyName + '\'' +
                ", email='" + email + '\'' +
                ", position='" + position + '\'' +
                ", experience='" + experience + '\'' +
                ", education='" + education + '\'' +
                ", description='" + description + '\'' +
                ", address='" + address + '\'' +
                ", keywords=" + keywords +
                '}';
    }
}
