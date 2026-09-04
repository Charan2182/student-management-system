package com.sms.service;

import com.sms.dto.StudentRequestDTO;
import com.sms.dto.StudentResponseDTO;

import java.util.List;

public interface StudentService {

    StudentResponseDTO createStudent(StudentRequestDTO studentRequestDTO);

    List<StudentResponseDTO> getAllStudents();

    StudentResponseDTO getStudentById(Long id);

    StudentResponseDTO updateStudent(Long id, StudentRequestDTO studentRequestDTO);

    void deleteStudent(Long id);

    List<StudentResponseDTO> searchStudents(String keyword);

    List<StudentResponseDTO> getStudentsByDepartment(String department);
}
