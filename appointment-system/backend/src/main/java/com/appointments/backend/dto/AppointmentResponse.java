package com.appointments.backend.dto;

import com.appointments.backend.model.Status;
import java.time.LocalDate;

public class AppointmentResponse {
    private Long id;
    private String customerName;
    private String customerEmail;
    private LocalDate appointmentDate;
    private String timeSlot;
    private Status status;
    private Integer queueNumber;

    public AppointmentResponse() {}

    public AppointmentResponse(Long id, String customerName, String customerEmail, LocalDate appointmentDate, String timeSlot, Status status, Integer queueNumber) {
        this.id = id;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.status = status;
        this.queueNumber = queueNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Integer getQueueNumber() { return queueNumber; }
    public void setQueueNumber(Integer queueNumber) { this.queueNumber = queueNumber; }
}
