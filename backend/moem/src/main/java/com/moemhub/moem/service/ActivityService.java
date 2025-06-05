package com.moemhub.moem.service;

import com.moemhub.moem.dto.*;

import java.util.List;

public interface ActivityService {

    // Create activity
    ActivitySummaryDto create(Long clubId, ActivityDto dto);

    // Update activity
    ActivitySummaryDto update(Long clubId, Long activityId, ActivityDto dto);

    // Delete activity
    void delete(Long clubId, Long activityId);

    // Apply for activity(self + instead)
    void apply(Long clubId, Long activityId, String username, ParticipationRequestDto dto);

    // Mark for attended activity
    void markAttendance(Long clubId, Long activityId, String username);

    // Add comment for participated activity
    void addParticipationComment(Long clubId, Long activityId, String username, String comment);



    // Retrieve details for activity
    ActivityDetailDto getDetail(Long clubId, Long activityId);

    // Retrieve list for applied activity
    List<ActivityHistoryDto> getMyAppliedActivities(String username);
    List<ActivityWardHistoryDto> getWardAppliedActivities(String guardianUsername);

    // Get summary for activity
    List<ActivitySummaryDto> getActivitySummaries(Long clubId, int year, int month);
}