package com.moemhub.moem.dto;

import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostSummaryDto {
    private long postID;
    private String title;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDateTime createdAt;
    private String thumbnail;
    private String authorName;
}