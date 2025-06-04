package com.moemhub.moem.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityCommentDto {
    private Long id;
    private String authorUsername;
    private String content;
    private LocalDateTime createdAt;
}