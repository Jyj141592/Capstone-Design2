package com.moemhub.moem.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostSummaryDto {
    private long postID;
    private String title;
    private LocalDateTime createdAt;
    private String thumbnail;
    private String authorName;
}