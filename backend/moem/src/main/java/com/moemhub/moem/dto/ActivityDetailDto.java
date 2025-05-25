package com.moemhub.moem.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDetailDto {
    private ActivityDto activity;
    private List<String> applicants;
    private List<String> attendees;
    private List<ActivityCommentDto> comments;
}