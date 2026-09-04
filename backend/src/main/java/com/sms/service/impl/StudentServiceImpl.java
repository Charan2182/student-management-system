package com.sms.service.impl;

import com.sms.dto.StudentRequestDTO;
import com.sms.dto.StudentResponseDTO;
import com.sms.entity.Student;
import com.sms.exception.EmailAlreadyExistsException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.StudentRepository;
import com.sms.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional
    public StudentResponseDTO createStudent(StudentRequestDTO requestDTO) {
        if (studentRepository.existsByEmail(requestDTO.getEmail().trim())) {
            throw new EmailAlreadyExistsException("A student with email '" + requestDTO.getEmail() + "' already exists");
        }

        Student student = mapToEntity(requestDTO);
        Student savedStudent = studentRepository.save(student);
        return mapToDTO(savedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToDTO(student);
    }

    @Override
    @Transactional
    public StudentResponseDTO updateStudent(Long id, StudentRequestDTO requestDTO) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        // Check if new email is already taken by another student
        if (studentRepository.existsByEmailAndIdNot(requestDTO.getEmail().trim(), id)) {
            throw new EmailAlreadyExistsException("Email '" + requestDTO.getEmail() + "' is already in use by another student");
        }

        existingStudent.setFirstName(requestDTO.getFirstName().trim());
        existingStudent.setLastName(requestDTO.getLastName().trim());
        existingStudent.setEmail(requestDTO.getEmail().trim());
        existingStudent.setDepartment(requestDTO.getDepartment().trim());
        existingStudent.setPhone(requestDTO.getPhone());
        existingStudent.setDateOfBirth(requestDTO.getDateOfBirth());
        existingStudent.setEnrollmentDate(requestDTO.getEnrollmentDate());
        existingStudent.setStatus(requestDTO.getStatus());
        existingStudent.setGpa(requestDTO.getGPA());

        Student updatedStudent = studentRepository.save(existingStudent);
        return mapToDTO(updatedStudent);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> searchStudents(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(keyword.trim())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartmentIgnoreCase(department.trim())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Helper mapping methods
    private Student mapToEntity(StudentRequestDTO dto) {
        Student student = new Student();
        student.setFirstName(dto.getFirstName().trim());
        student.setLastName(dto.getLastName().trim());
        student.setEmail(dto.getEmail().trim());
        student.setDepartment(dto.getDepartment().trim());
        student.setPhone(dto.getPhone());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setEnrollmentDate(dto.getEnrollmentDate());
        student.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        student.setGpa(dto.getGPA());
        return student;
    }

    private StudentResponseDTO mapToDTO(Student student) {
        return new StudentResponseDTO(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getDepartment(),
                student.getPhone(),
                student.getDateOfBirth(),
                student.getEnrollmentDate(),
                student.getStatus(),
                student.getGpa()
        );
    }
}
