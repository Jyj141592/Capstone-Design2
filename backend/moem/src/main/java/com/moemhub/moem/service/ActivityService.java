package com.moemhub.moem.service;

import com.moemhub.moem.dto.*;

import java.util.List;

public interface ActivityService {

    // Create activity
    ActivityDto create(ActivityDto dto);

    // Update activity
    ActivityDto update(Long activityId, ActivityDto dto);

    // Delete activity
    void delete(Long activityId);

    // Apply for activity(self + instead)
    void apply(Long activityId, String username, String wardUsername);

    // Mark for attended activity
    void markAttendance(Long activityId, String username);

    // Add comment for participated activity
    void addParticipationComment(Long activityId, String username, String comment);

    // Add comment for activity
    ActivityCommentDto addComment(Long activityId, String username, String content);

    // Retrieve activity by year/month
    List<ActivityDto> findByMonth(int year, int month);

    // Retrieve details for activity
    ActivityDetailDto getDetail(Long activityId);

    // Retrieve list for applied activity
    List<ActivityDto> getMyAppliedActivities(String username);
    List<ActivityDto> getWardAppliedActivities(String guardianUsername);

    // Retrieve participation for activity
    ActivityParticipationDto getMyParticipation(Long activityId, String username);
    ActivityParticipationDto getWardParticipation(Long activityId, String wardUsername);

    // Get summary for activity
    List<ActivitySummaryDto> getActivitySummaries(int year, int month);
}