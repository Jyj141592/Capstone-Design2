package com.moemhub.moem.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityParticipationDto {
    private Long activityId;
    private String username;
    private boolean attended;
    private String comment;
}