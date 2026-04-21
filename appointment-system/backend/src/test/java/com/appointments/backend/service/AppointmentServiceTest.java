package com.appointments.backend.service;

import com.appointments.backend.dto.AppointmentRequest;
import com.appointments.backend.dto.AppointmentResponse;
import com.appointments.backend.model.Appointment;
import com.appointments.backend.model.Role;
import com.appointments.backend.model.Status;
import com.appointments.backend.model.User;
import com.appointments.backend.repository.AppointmentRepository;
import com.appointments.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private AppointmentRequest request;
    private User user;

    @BeforeEach
    void setUp() {
        request = new AppointmentRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setPhone("1234567890");
        request.setAppointmentDate(LocalDate.now());
        request.setTimeSlot("10:00-10:30");

        user = new User("John Doe", "john@example.com", "1234567890", Role.CUSTOMER);
        user.setId(1L);
    }

    @Test
    void bookAppointment_Success() {
        when(appointmentRepository.existsByAppointmentDateAndTimeSlotAndStatusNot(
                request.getAppointmentDate(), request.getTimeSlot(), Status.CANCELLED)).thenReturn(false);
        
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(appointmentRepository.findMaxQueueNumberByDate(request.getAppointmentDate())).thenReturn(5);
        
        Appointment savedAppointment = new Appointment(user, request.getAppointmentDate(), request.getTimeSlot(), Status.SCHEDULED, 6);
        savedAppointment.setId(1L);
        
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(savedAppointment);

        AppointmentResponse response = appointmentService.bookAppointment(request);

        assertNotNull(response);
        assertEquals(6, response.getQueueNumber());
        assertEquals(Status.SCHEDULED, response.getStatus());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    @Test
    void bookAppointment_SlotAlreadyBooked_ThrowsException() {
        when(appointmentRepository.existsByAppointmentDateAndTimeSlotAndStatusNot(
                request.getAppointmentDate(), request.getTimeSlot(), Status.CANCELLED)).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> appointmentService.bookAppointment(request));
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }
}
