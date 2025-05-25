package com.moemhub.moem.service;

import com.moemhub.moem.dto.*;
import com.moemhub.moem.model.*;
import com.moemhub.moem.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {
    private final ActivityRepository activityRepo;
    private final ActivityParticipationRepository partRepo;
    private final ActivityCommentRepository commentRepo;
    private final com.moemhub.moem.repository.AccountRepository accountRepo;

    @Override
    public ActivityDto create(ActivityDto dto) {
        Activity act = Activity.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .date(dto.getDate())
                .build();
        return toDto(activityRepo.save(act));
    }

    @Override
    public ActivityDto update(Long id, ActivityDto dto) {
        Activity act = activityRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found: " + id));
        act.setName(dto.getName());
        act.setDescription(dto.getDescription());
        act.setLocation(dto.getLocation());
        act.setDate(dto.getDate());
        return toDto(activityRepo.save(act));
    }

    @Override
    public void delete(Long id) {
        activityRepo.deleteById(id);
    }

    @Override
    public void apply(Long activityId, String username, String wardUsername) {
        Activity activity = activityRepo.findById(activityId)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found: " + activityId));
        Account applicant = accountRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));

        final Account target;
        if (wardUsername != null && !wardUsername.isBlank()) {
            Account ward = accountRepo.findByUsername(wardUsername)
                    .orElseThrow(() -> new EntityNotFoundException("Ward not found: " + wardUsername));
            if (!ward.getGuardians().contains(applicant)) {
                throw new IllegalStateException(username + " is not a guardian of " + wardUsername);
            }
            target = ward;
        } else {
            target = applicant;
        }

        partRepo.findByActivityAndAccount(activity, target).ifPresent(p -> {
            String msg = target.equals(applicant)
                    ? "Already applied"
                    : "Ward already applied";
            throw new IllegalStateException(msg + ": " + target.getUsername());
        });

        ActivityParticipation participation = ActivityParticipation.builder()
                .activity(activity)
                .account(target)
                .attended(false)
                .comment(null)
                .build();
        partRepo.save(participation);
    }

    @Override
    public void markAttendance(Long id, String username) {
        Activity act = activityRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found: " + id));
        com.moemhub.moem.model.Account acc = accountRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));

        ActivityParticipation part = partRepo.findByActivityAndAccount(act, acc)
                .orElseThrow(() -> new IllegalStateException("No applied activity."));
        part.setAttended(true);
        partRepo.save(part);
    }

    @Override
    public void addParticipationComment(Long id, String username, String comment) {
        ActivityParticipation part = partRepo.findByActivityAndAccount(
                activityRepo.getReferenceById(id),
                accountRepo.findByUsername(username)
                        .orElseThrow(() -> new EntityNotFoundException("User not found: " + username))
        ).orElseThrow(() -> new IllegalStateException("No applied activity."));
        part.setComment(comment);
        partRepo.save(part);
    }

    @Override
    public ActivityCommentDto addComment(Long id, String username, String content) {
        Activity act = activityRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found: " + id));
        com.moemhub.moem.model.Account acc = accountRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));

        ActivityComment cm = ActivityComment.builder()
                .activity(act)
                .author(acc)
                .content(content)
                .build();
        return toCommentDto(commentRepo.save(cm));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDto> findByMonth(int year, int month) {
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end   = start.plusMonths(1);
        return activityRepo.findByDateBetween(start, end)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ActivityDetailDto getDetail(Long id) {
        Activity act = activityRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found: " + id));

        List<ActivityParticipation> parts = partRepo.findByActivity(act);
        List<String> applicants = parts.stream()
                .map(p -> p.getAccount().getUsername()).toList();
        List<String> attendees  = parts.stream()
                .filter(ActivityParticipation::isAttended)
                .map(p -> p.getAccount().getUsername()).toList();

        List<ActivityCommentDto> commentDtos = commentRepo.findByActivity(act)
                .stream().map(this::toCommentDto).toList();

        return ActivityDetailDto.builder()
                .activity(toDto(act))
                .applicants(applicants)
                .attendees(attendees)
                .comments(commentDtos)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDto> getMyAppliedActivities(String username) {
        com.moemhub.moem.model.Account acc = accountRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        return partRepo.findByAccount(acc).stream()
                .map(p -> toDto(p.getActivity())).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityDto> getWardAppliedActivities(String guardianUsername) {
        com.moemhub.moem.model.Account guardian = accountRepo.findByUsername(guardianUsername)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + guardianUsername));

        // 피보호자 목록 순회하여 각 활동 취합
        return guardian.getWards().stream()
                .flatMap(ward -> partRepo.findByAccount(ward).stream())
                .map(p -> toDto(p.getActivity()))
                .distinct()
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ActivityParticipationDto getMyParticipation(Long id, String username) {
        ActivityParticipation p = partRepo.findByActivityAndAccount(
                activityRepo.getReferenceById(id),
                accountRepo.findByUsername(username)
                        .orElseThrow(() -> new EntityNotFoundException("User not found: " + username))
        ).orElseThrow(() -> new IllegalStateException("No applied activity."));
        return ActivityParticipationDto.builder()
                .activityId(id)
                .username(username)
                .attended(p.isAttended())
                .comment(p.getComment())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ActivityParticipationDto getWardParticipation(Long id, String wardUsername) {
        ActivityParticipation p = partRepo.findByActivityAndAccount(
                activityRepo.getReferenceById(id),
                accountRepo.findByUsername(wardUsername)
                        .orElseThrow(() -> new EntityNotFoundException("User not found: " + wardUsername))
        ).orElseThrow(() -> new IllegalStateException("No applied activity."));
        return ActivityParticipationDto.builder()
                .activityId(id)
                .username(wardUsername)
                .attended(p.isAttended())
                .comment(p.getComment())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivitySummaryDto> getActivitySummaries(int year, int month) {
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end   = start.plusMonths(1);

        return activityRepo.findByDateBetween(start, end).stream().map(act -> {
            List<ActivityParticipation> parts = partRepo.findByActivity(act);
            List<String> avatars = parts.stream()
                    .map(p -> p.getAccount().getProfileImage())
                    .filter(Objects::nonNull)
                    .limit(5)
                    .toList();

            return ActivitySummaryDto.builder()
                    .id(act.getId())
                    .name(act.getName())
                    .thumbnailUrl(act.getThumbnailUrl())
                    .date(act.getDate())
                    .location(act.getLocation())
                    .participantCount(parts.size())
                    .maxCapacity(act.getMaxCapacity())
                    .description(act.getDescription())
                    .avatarUrls(avatars)
                    .build();
        }).toList();
    }

    private ActivityDto toDto(Activity act) {
        return ActivityDto.builder()
                .id(act.getId())
                .name(act.getName())
                .description(act.getDescription())
                .location(act.getLocation())
                .date(act.getDate())
                .build();
    }
    private ActivityCommentDto toCommentDto(ActivityComment cm) {
        return ActivityCommentDto.builder()
                .id(cm.getId())
                .authorUsername(cm.getAuthor().getUsername())
                .content(cm.getContent())
                .createdAt(cm.getCreatedAt())
                .build();
    }
}