package com.moemhub.moem.dto;

import java.util.ArrayList;
import java.util.List;

import com.moemhub.moem.model.Activity;
import com.moemhub.moem.model.ActivityParticipation;
import com.moemhub.moem.model.Club;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

record Ward(AccountInfoDto user, boolean attended, String comment) {}

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityWardHistoryDto {
	private ClubInfoDto club;
	private ActivitySummaryDto activity;
	private List<Ward> wards;
	
	public static ActivityWardHistoryDto toDto(Club club, Activity activity, List<ActivityParticipation> ap, List<String> comments) {
		List<Ward> wards = new ArrayList<Ward>();
		for(int i = 0; i < ap.size(); i++) {
			wards.add(new Ward(AccountInfoDto.toDto(ap.get(i).getAccount()), ap.get(i).isAttended(), comments.get(i)));
		}
		
		return ActivityWardHistoryDto.builder().club(ClubInfoDto.toDto(club)).activity(ActivitySummaryDto.toDto(activity))
			.wards(wards).build();
	}
}