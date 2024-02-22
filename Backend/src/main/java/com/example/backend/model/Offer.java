package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Offer")
public class Offer {
    @Id
    private String id;
    private String companyName;
    private String email;
    private String position;
    private String experience;
    private String education;
    private String description;
    private String address;

    // Constructors, getters, setters

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

    @Override
    public String toString() {
        return "JobOffer{" +
                "id='" + id + '\'' +
                ", companyName='" + companyName + '\'' +
                ", email='" + email + '\'' +
                ", position='" + position + '\'' +
                ", experience='" + experience + '\'' +
                ", education='" + education + '\'' +
                ", description='" + description + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}
