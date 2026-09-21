package com.sms.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class StudentRequestDTO {

    @NotBlank(message = "First name is mandatory")
    @Size(min = 2, max = 60, message = "First name must be between 2 and 60 characters")
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    @Size(min = 1, max = 60, message = "Last name must be between 1 and 60 characters")
    private String lastName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Please provide a valid email address")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Department is mandatory")
    @Size(max = 80, message = "Department cannot exceed 80 characters")
    private String department;

    @Pattern(regexp = "^$|^[+0-9- ]{7,20}$", message = "Phone number must be valid (7-20 digits)")
    private String phone;

    @Past(message = "Date of birth must be a past date")
    private LocalDate dateOfBirth;

    private LocalDate enrollmentDate;

    @Pattern(regexp = "^(ACTIVE|INACTIVE|GRADUATED|SUSPENDED)$", message = "Status must be ACTIVE, INACTIVE, GRADUATED, or SUSPENDED")
    private String status = "ACTIVE";

    @Min(value = 1, message = "GPA cannot be less than 1.0")
    @Max(value = 10, message = "GPA cannot exceed 10.0")
    private Double gpa;

    public StudentRequestDTO() {
    }

    public StudentRequestDTO(String firstName, String lastName, String email, String department,
                             String phone, LocalDate dateOfBirth, LocalDate enrollmentDate, String status, Double gpa) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.enrollmentDate = enrollmentDate;
        this.status = status;
        this.gpa = gpa;
    }

    // Getters and Setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getGPA() {
        return gpa;
    }

    public void setGPA(Double gpa) {
        this.gpa = gpa;
    }
}
