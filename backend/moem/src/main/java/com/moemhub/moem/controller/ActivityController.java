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
@RequestMapping("/api/{clubId}/activities")
@RequiredArgsConstructor
@Validated
public class ActivityController {
    private final ActivityService service;

    @PostMapping("/create")
    public ResponseEntity<ActivitySummaryDto> create(@PathVariable(name="clubId") Long clubId, @RequestBody ActivityDto dto) {
        return ResponseEntity.status(201).body(service.create(clubId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivitySummaryDto> update(
    			@PathVariable(name="clubId") Long clubId, 
            @PathVariable(name="id") Long id,
            @RequestBody ActivityDto dto) {
        return ResponseEntity.ok(service.update(clubId, id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable(name="clubId") Long clubId, @PathVariable(name="id") Long id) {
        service.delete(clubId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<Void> apply(
    			@PathVariable(name="clubId") Long clubId, 
            @PathVariable(name="id") Long id,
            @RequestBody ParticipationRequestDto dto,
            Authentication auth) {
        String username = auth.getName();
        service.apply(clubId, id, username, dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/attendance")
    public ResponseEntity<Void> attend(
    			@PathVariable(name="clubId") Long clubId, 
            @PathVariable(name="id") Long id,
            Authentication auth) {
        service.markAttendance(clubId, id, auth.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/participation/comment")
    public ResponseEntity<Void> commentParticipation(
    			@PathVariable(name="clubId") Long clubId, 
            @PathVariable(name="id") Long id,
            @Valid @RequestBody ParticipationCommentDto dto,
            Authentication auth) {
        service.addParticipationComment(clubId, id, auth.getName(), dto.getComment());
        return ResponseEntity.ok().build();
    }


    @GetMapping("/{id}")
    public ResponseEntity<ActivityDetailDto> detail(@PathVariable(name="clubId") Long clubId, @PathVariable(name="id") Long id) {
        return ResponseEntity.ok(service.getDetail(clubId, id));
    }

    @GetMapping("/summary")
    public ResponseEntity<List<ActivitySummaryDto>> summaryByMonth(
    			@PathVariable(name="clubId") Long clubId, 	
            @RequestParam(name="year") int year,
            @RequestParam(name="month") int month) {
        List<ActivitySummaryDto> summaries = service.getActivitySummaries(clubId, year, month);
        return ResponseEntity.ok(summaries);
    }

}