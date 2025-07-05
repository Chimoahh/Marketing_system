package com.Liyah.Souk.repository;

import com.Liyah.Souk.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByCustomerPhone(String customerPhone);
}
