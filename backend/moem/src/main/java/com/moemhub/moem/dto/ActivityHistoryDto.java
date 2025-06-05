package com.moemhub.moem.dto;


import com.moemhub.moem.model.Activity;
import com.moemhub.moem.model.ActivityComment;
import com.moemhub.moem.model.ActivityParticipation;
import com.moemhub.moem.model.Club;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityHistoryDto {
	private ClubInfoDto club;
	private ActivitySummaryDto activity;
	private boolean attended;
	private String comment;
	
	public static ActivityHistoryDto toDto(Club club, Activity ac, ActivityParticipation ap, String comment) {
		return ActivityHistoryDto.builder().activity(ActivitySummaryDto.toDto(ac))
				.club(ClubInfoDto.toDto(club))
				.attended(ap.isAttended())
				.comment(comment)
				.build();
				
	}
}
