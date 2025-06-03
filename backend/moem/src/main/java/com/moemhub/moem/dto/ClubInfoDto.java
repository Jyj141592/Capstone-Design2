package com.moemhub.moem.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubInfoDto {
    private Long id;
    private String name;
    private String description;
    private String topic;
    private String profileImageName;
    private String region;
    private String applicationPrecautions;
    private Long noticeBoardId;
    private Long activityBoardId;
}
