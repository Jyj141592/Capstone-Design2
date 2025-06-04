package com.moemhub.moem.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivitySummaryDto {
    private Long   id;
    private String name;
    private String thumbnailUrl;
    private LocalDateTime date;
    private String location;
    private int    participantCount;
    private Integer maxCapacity;
    private String description;
    // Thumbnail for users
    private List<String> avatarUrls;
}