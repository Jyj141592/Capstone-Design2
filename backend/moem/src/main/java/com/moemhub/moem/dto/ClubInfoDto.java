package com.moemhub.moem.dto;

import com.moemhub.moem.model.Club;

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
    
    public static ClubInfoDto toDto(Club club) {
        return ClubInfoDto.builder()
                .id(club.getId())
                .name(club.getName())
                .description(club.getDescription())
                .topic(club.getTopic())
                .region(club.getRegion())
                .applicationPrecautions(club.getApplicationPrecautions())
                .profileImageName(club.getProfileImageName())
                .noticeBoardId(club.getNoticeBoard().getId())
                .activityBoardId(club.getActivityBoard().getId())
                .build();
    }
}
