package com.moemhub.moem.controller;

import com.moemhub.moem.dto.*;
import com.moemhub.moem.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Validated
public class ActivityController {
    private final ActivityService service;

    @PostMapping
    public ResponseEntity<ActivityDto> create(@RequestBody ActivityDto dto) {
        return ResponseEntity.status(201).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityDto> update(
            @PathVariable Long id,
            @RequestBody ActivityDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<Void> apply(
            @PathVariable Long id,
            @RequestParam(value = "wardUsername", required = false) String wardUsername,
            Authentication auth) {
        String username = auth.getName();
        service.apply(id, username, wardUsername);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/attendance")
    public ResponseEntity<Void> attend(
            @PathVariable Long id,
            Authentication auth) {
        service.markAttendance(id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/participation/comment")
    public ResponseEntity<Void> commentParticipation(
            @PathVariable Long id,
            @Valid @RequestBody ParticipationCommentRequestDto dto,
            Authentication auth) {
        service.addParticipationComment(id, auth.getName(), dto.getComment());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ActivityCommentDto> addComment(
            @PathVariable Long id,
            @Valid @RequestBody ActivityCommentRequestDto dto,
            Authentication auth) {
        return ResponseEntity.ok(
                service.addComment(id, auth.getName(), dto.getComment())
        );
    }

    @GetMapping
    public ResponseEntity<List<ActivityDto>> listByMonth(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(service.findByMonth(year, month));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityDetailDto> detail(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDetail(id));
    }

    @GetMapping("/summary")
    public ResponseEntity<List<ActivitySummaryDto>> summaryByMonth(
            @RequestParam int year,
            @RequestParam int month) {
        List<ActivitySummaryDto> summaries = service.getActivitySummaries(year, month);
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ActivityDto>> myApplications(Authentication auth) {
        return ResponseEntity.ok(service.getMyAppliedActivities(auth.getName()));
    }

    @GetMapping("/wards")
    public ResponseEntity<List<ActivityDto>> wardApplications(Authentication auth) {
        return ResponseEntity.ok(service.getWardAppliedActivities(auth.getName()));
    }

    @GetMapping("/{id}/my")
    public ResponseEntity<ActivityParticipationDto> myParticipation(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(service.getMyParticipation(id, auth.getName()));
    }

    @GetMapping("/{id}/wards/{wardUsername}")
    public ResponseEntity<ActivityParticipationDto> wardParticipation(
            @PathVariable Long id,
            @PathVariable String wardUsername) {
        return ResponseEntity.ok(service.getWardParticipation(id, wardUsername));
    }
}