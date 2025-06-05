package com.moemhub.moem.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonProperty;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDto {
    private String name;
    private String description;
    private String thumbnail;
    private String location;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate date;
}