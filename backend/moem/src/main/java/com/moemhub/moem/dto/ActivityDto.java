package com.moemhub.moem.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDto {
    private Long id;
    private String name;
    private String description;
    private String location;
    private LocalDateTime date;
}