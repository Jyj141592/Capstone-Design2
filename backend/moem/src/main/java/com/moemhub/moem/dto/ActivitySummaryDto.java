package com.moemhub.moem.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.moemhub.moem.model.Activity;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivitySummaryDto {
    private Long   id;
    private String name;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String location;
    private String description;
    
    public static ActivitySummaryDto toDto(Activity activity) {
    		return ActivitySummaryDto.builder().id(activity.getId())
    				.name(activity.getName())
    				.date(activity.getDate())
    				.location(activity.getLocation())
    				.description(activity.getDescription()).build();
    }
}