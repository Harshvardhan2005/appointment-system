package com.appointments.backend.repository;

import com.appointments.backend.model.Appointment;
import com.appointments.backend.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByAppointmentDate(LocalDate date);

    List<Appointment> findByUserPhone(String phone);

    boolean existsByAppointmentDateAndTimeSlotAndStatusNot(LocalDate date, String timeSlot, Status status);

    @Query("SELECT MAX(a.queueNumber) FROM Appointment a WHERE a.appointmentDate = :date")
    Integer findMaxQueueNumberByDate(@Param("date") LocalDate date);

    Optional<Appointment> findFirstByAppointmentDateAndStatusOrderByQueueNumberAsc(LocalDate date, Status status);
}
