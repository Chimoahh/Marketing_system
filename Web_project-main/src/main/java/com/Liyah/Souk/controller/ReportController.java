package com.Liyah.Souk.controller;

import com.Liyah.Souk.model.Report;
import com.Liyah.Souk.repository.ReportRepository;
import com.Liyah.Souk.request.ReplyRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody Report report) {
        try {
            // Basic validation
            if (report.getSubject() == null || report.getSubject().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Subject is required");
            }
            
            if (report.getMessage() == null || report.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Message is required");
            }
            
            if (report.getCustomerName() == null || report.getCustomerName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Customer name is required");
            }
            
            if (report.getCustomerPhone() == null || report.getCustomerPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Customer phone is required");
            }

            // Save the report
            Report savedReport = reportRepository.save(report);
            return ResponseEntity.ok(savedReport);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to submit report: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        try {
            List<Report> reports = reportRepository.findAll();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        try {
            return reportRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        try {
            if (!reportRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            reportRepository.deleteById(id);
            return ResponseEntity.ok().body("Report deleted successfully");
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete report: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<?> replyToReport(@PathVariable Long id, @RequestBody ReplyRequest replyRequest) {
        try {
            // Find the report
            Report report = reportRepository.findById(id)
                    .orElse(null);
            
            if (report == null) {
                return ResponseEntity.notFound().build();
            }

            // Validate reply data
            if (replyRequest.getAdminReply() == null || replyRequest.getAdminReply().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Reply message is required");
            }
            
            if (replyRequest.getAdminName() == null || replyRequest.getAdminName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Admin name is required");
            }

            // Update the report with reply
            report.setAdminReply(replyRequest.getAdminReply());
            report.setAdminName(replyRequest.getAdminName());
            report.setRepliedAt(LocalDateTime.now());

            // Save the updated report
            Report updatedReport = reportRepository.save(report);
            return ResponseEntity.ok(updatedReport);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to reply to report: " + e.getMessage());
        }
    }

    @GetMapping("/customer/{phone}")
    public ResponseEntity<?> getReportsByCustomerPhone(@PathVariable String phone) {
        try {
            List<Report> reports = reportRepository.findByCustomerPhone(phone);
            if (reports.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch customer reports: " + e.getMessage());
        }
    }
}
