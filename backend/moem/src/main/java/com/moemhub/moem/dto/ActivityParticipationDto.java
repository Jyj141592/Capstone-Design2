package com.moemhub.moem.dto;

import com.moemhub.moem.model.ActivityParticipation;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityParticipationDto {
	private Long id;
    private Long activityId;
    private AccountInfoDto user;
    private boolean attended;
    
    public static ActivityParticipationDto toDto(ActivityParticipation ac) {
    		return ActivityParticipationDto.builder().id(ac.getId())
    				.activityId(ac.getActivity().getId())
    				.user(AccountInfoDto.toDto(ac.getAccount()))
    				.attended(ac.isAttended())
    				.build();
    }
}