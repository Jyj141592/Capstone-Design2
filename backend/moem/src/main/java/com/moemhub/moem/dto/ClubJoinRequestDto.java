package com.moemhub.moem.dto;

import lombok.Data;


import java.util.List;

import com.moemhub.moem.model.ClubJoinRequest;


public class ClubJoinRequestDto {

    // DTO for creating join request
    @Data
    public static class Request {
        private String message; // Join request message provided by user
        private List<String> usernames;
    }

    // DTO for processing join request (approve/reject)
    @Data
    public static class ProcessRequest {
        private Boolean approve;         // true for approval, false for rejection
        private String responseMessage;  // Optional message provided by admin
    }

    // DTO for join request response
    @Data
    public static class Response {
        private Long id;
        private Long clubId;
        private String clubName;
        private AccountInfoDto submitter;
        private List<AccountInfoDto> wards;
        private String message;
        private String status;
        private String responseMessage;
        
        public static ClubJoinRequestDto.Response toDto(ClubJoinRequest req){
        		ClubJoinRequestDto.Response res = new ClubJoinRequestDto.Response();
        		res.setId(req.getId());
        		res.setClubId(req.getClub().getId());
        		res.setClubName(req.getClub().getName());
        		res.setSubmitter(AccountInfoDto.toDto(req.getSubmitter()));
        		res.setWards(req.getWards().stream().map(AccountInfoDto::toDto).toList());
        		res.setMessage(req.getMessage());
        		res.setStatus(req.getStatus().toString());
        		res.setResponseMessage(req.getResponseMessage());
        		return res;
        }
    }
}