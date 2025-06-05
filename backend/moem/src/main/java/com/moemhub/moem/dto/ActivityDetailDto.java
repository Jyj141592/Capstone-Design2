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
public class ActivityDetailDto {
    private Long   id;
    private List<ActivityParticipationDto> applicants;
    private String name;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String location;
    private String description;
    private String thumbnail;
    
    public static ActivityDetailDto toDto(Activity activity) {
    		return ActivityDetailDto.builder().id(activity.getId())
    				.applicants(activity.getParticipations().stream().map(ActivityParticipationDto::toDto).toList())
    				.name(activity.getName())
    				.date(activity.getDate())
    				.location(activity.getLocation())
    				.description(activity.getDescription())
    				.thumbnail(activity.getThumbnail())
    				.build();
    }
}