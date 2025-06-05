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
    private final ClubRepository clubRepo;

    @Override
    public ActivitySummaryDto create(Long clubId, ActivityDto dto) {
    		Club club = clubRepo.findById(clubId).orElseThrow(() -> new EntityNotFoundException());
    		
        Activity act = Activity.builder()
                .name(dto.getName())
                .club(club)
                .description(dto.getDescription())
                .location(dto.getLocation())
                .date(dto.getDate())
                .thumbnail(dto.getThumbnail())
                .build();
        return ActivitySummaryDto.toDto(activityRepo.save(act));
    }

    @Override
    public ActivitySummaryDto update(Long clubId, Long id, ActivityDto dto) {
    		Club club = clubRepo.findById(clubId).orElseThrow(() -> new EntityNotFoundException());
    	
        Activity act = activityRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found: " + id));
        act.setName(dto.getName());
        act.setDescription(dto.getDescription());
        act.setLocation(dto.getLocation());
        act.setDate(dto.getDate());
        return ActivitySummaryDto.toDto(activityRepo.save(act));
    }

    @Override
    public void delete(Long clubId, Long id) {
	    	Club club = clubRepo.findById(clubId).orElseThrow(() -> new EntityNotFoundException());
        activityRepo.deleteById(id);
    }

    @Override
    public void apply(Long clubId, Long activityId, String username, ParticipationRequestDto dto) {
	    	Club club = clubRepo.findById(clubId).orElseThrow(() -> new EntityNotFoundException());
			
        Activity activity = activityRepo.findById(activityId)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found: " + activityId));
        Account applicant = accountRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        
        if(dto.isIncludes()) {
        		partRepo.findByActivityAndAccount(activity, applicant).ifPresent(p -> {
                throw new IllegalStateException("Already applied: " + applicant.getUsername());
            });
            ActivityParticipation participation = ActivityParticipation.builder()
                    .activity(activity)
                    .account(applicant)
                    .attended(false)
                    .build();
            partRepo.save(participation);
        }
        for(String wardUsername : dto.getWards()) {
        		Account ward = accountRepo.findByUsername(wardUsername)
                    .orElseThrow(() -> new EntityNotFoundException("Ward not found: " + wardUsername));
            if (!ward.getGuardians().contains(applicant)) {
                throw new IllegalStateException(username + " is not a guardian of " + wardUsername);
            }
            partRepo.findByActivityAndAccount(activity, ward).ifPresent(p -> {
                String msg = ward.equals(applicant)
                        ? "Already applied"
                        : "Ward already applied";
                throw new IllegalStateException(msg + ": " + ward.getUsername());
            });
            ActivityParticipation participation = ActivityParticipation.builder()
                    .activity(activity)
                    .account(ward)
                    .attended(false)
                    .build();
            partRepo.save(participation);
        }
        
    }

    @Override
    public void markAttendance(Long clubId, Long id, String username) {
     	Club club = clubRepo.findById(clubId).orElseThrow(() -> new EntityNotFoundException());
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
    public void addParticipationComment(Long clubId, Long id, String username, String comment) {
        ActivityParticipation part = partRepo.findByActivityAndAccount(
                activityRepo.getReferenceById(id),
                accountRepo.findByUsername(username)
                        .orElseThrow(() -> new EntityNotFoundException("User not found: " + username))
        ).orElseThrow(() -> new IllegalStateException("No applied activity."));
        if (comment == null) {
        		comment = "";
        }
        
        ActivityComment comm = ActivityComment.builder()
        		.activityParticipation(part)
        		.content(comment).build();
        
        commentRepo.save(comm);
    }

    @Override
    @Transactional(readOnly = true)
    public ActivityDetailDto getDetail(Long clubId, Long id) {
    		Club club = clubRepo.findById(clubId).orElseThrow(() -> new EntityNotFoundException());
        Activity act = activityRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Activity not found: " + id));


        return ActivityDetailDto.toDto(act);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityHistoryDto> getMyAppliedActivities(String username) {
        com.moemhub.moem.model.Account acc = accountRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
       
        
        return partRepo.findByAccount(acc).stream()
                .map(p -> {
                		ActivityComment comm = commentRepo.findByActivityParticipation(p).orElse(null);
                		String comment = comm != null ? comm.getContent() : "";
                		return ActivityHistoryDto.toDto(p.getActivity().getClub(), p.getActivity(), p, comment);
                }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityWardHistoryDto> getWardAppliedActivities(String guardianUsername) {
        com.moemhub.moem.model.Account guardian = accountRepo.findByUsername(guardianUsername)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + guardianUsername));
        
        
        Map<Activity, List<ActivityParticipation>> groupedByActivity =
        	    guardian.getWards().stream()
        	        .flatMap(ward -> partRepo.findByAccount(ward).stream())
        	        .collect(Collectors.groupingBy(ActivityParticipation::getActivity));

        
        
        // 피보호자 목록 순회하여 각 활동 취합
        return groupedByActivity.entrySet().stream()
        		.map(entry -> {
        			Activity activity = entry.getKey();
        			List<ActivityParticipation> list = entry.getValue();
        			Collections.sort(list, new Comparator<ActivityParticipation>() {
        				public int compare(ActivityParticipation a, ActivityParticipation b) {
        					return (int)(a.getAccount().getId() - b.getAccount().getId());
        				}
        			});
        			List<String> comm = new ArrayList<>();
        			
        			for(int i = 0; i < list.size(); i++) {
        				ActivityComment c = commentRepo.findByActivityParticipation(list.get(i)).orElse(null);
                		String comment = c != null ? c.getContent() : "";
                		comm.add(comment);
        			}
        			return ActivityWardHistoryDto.toDto(activity.getClub(), activity, list, comm);
        		}).toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<ActivitySummaryDto> getActivitySummaries(Long clubId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end   = start.plusMonths(1);

        return activityRepo.findByDateBetween(start, end).stream().map(ActivitySummaryDto::toDto).toList();
    }

}