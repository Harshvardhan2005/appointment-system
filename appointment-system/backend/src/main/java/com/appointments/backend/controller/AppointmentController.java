package com.appointments.backend.controller;

import com.appointments.backend.dto.AppointmentRequest;
import com.appointments.backend.dto.AppointmentResponse;
import com.appointments.backend.model.Status;
import com.appointments.backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*") // Allow all for simplicity locally
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> bookAppointment(@Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(request));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments(@RequestParam(required = false) String phone) {
        return ResponseEntity.ok(appointmentService.getAllAppointments(phone));
    }

    @GetMapping("/queue/live")
    public ResponseEntity<Map<String, Object>> getLiveQueue(@RequestParam(required = false) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return ResponseEntity.ok(appointmentService.getLiveQueueNumber(date));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(@PathVariable Long id, @RequestParam Status status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @PutMapping("/{id}/slot")
    public ResponseEntity<AppointmentResponse> updateSlot(
            @PathVariable Long id,
            @RequestParam LocalDate date,
            @RequestParam String timeSlot) {
        return ResponseEntity.ok(appointmentService.updateAppointmentSlot(id, date, timeSlot));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
