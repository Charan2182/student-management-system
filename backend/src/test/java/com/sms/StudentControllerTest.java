package com.sms;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sms.dto.StudentRequestDTO;
import com.sms.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private StudentRepository studentRepository;

    @BeforeEach
    void setUp() {
        studentRepository.deleteAll();
    }

    @Test
    void shouldCreateStudentSuccessfully() throws Exception {
        StudentRequestDTO request = new StudentRequestDTO(
                "John", "Doe", "john.doe@example.com", "Computer Science",
                "+1234567890", LocalDate.of(2000, 1, 15), LocalDate.of(2022, 9, 1),
                "ACTIVE", 3.8
        );

        mockMvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", notNullValue()))
                .andExpect(jsonPath("$.data.firstName", is("John")))
                .andExpect(jsonPath("$.data.email", is("john.doe@example.com")))
                .andExpect(jsonPath("$.data.department", is("Computer Science")));
    }

    @Test
    void shouldReturnConflictWhenEmailAlreadyExists() throws Exception {
        StudentRequestDTO firstStudent = new StudentRequestDTO(
                "Alice", "Smith", "alice.smith@example.com", "Mathematics",
                "+1987654321", LocalDate.of(2001, 5, 20), LocalDate.of(2023, 9, 1),
                "ACTIVE", 3.9
        );

        mockMvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstStudent)))
                .andExpect(status().isCreated());

        // Attempt to create another student with same email
        StudentRequestDTO duplicateStudent = new StudentRequestDTO(
                "Bob", "Smith", "alice.smith@example.com", "Physics",
                "+1122334455", LocalDate.of(2002, 3, 10), LocalDate.of(2023, 9, 1),
                "ACTIVE", 3.5
        );

        mockMvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateStudent)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    void shouldReturnBadRequestWhenValidationFails() throws Exception {
        StudentRequestDTO invalidStudent = new StudentRequestDTO(
                "", "", "not-an-email", "",
                "invalid-phone", null, null, "INVALID_STATUS", 5.5
        );

        mockMvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidStudent)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.validationErrors.firstName", notNullValue()))
                .andExpect(jsonPath("$.validationErrors.email", notNullValue()))
                .andExpect(jsonPath("$.validationErrors.department", notNullValue()));
    }

    @Test
    void shouldGetAllStudentsAndFilter() throws Exception {
        StudentRequestDTO student1 = new StudentRequestDTO(
                "Emily", "Clark", "emily.clark@example.com", "Computer Science",
                null, null, null, "ACTIVE", 3.7
        );
        StudentRequestDTO student2 = new StudentRequestDTO(
                "Michael", "Brown", "michael.brown@example.com", "Electrical Engineering",
                null, null, null, "ACTIVE", 3.4
        );

        mockMvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(student1)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(student2)))
                .andExpect(status().isCreated());

        // Get All
        mockMvc.perform(get("/api/v1/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)));

        // Search by keyword
        mockMvc.perform(get("/api/v1/students").param("search", "Emily"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].firstName", is("Emily")));
    }
}
