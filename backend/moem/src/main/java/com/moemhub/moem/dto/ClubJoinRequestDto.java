package com.moemhub.moem.dto;

import lombok.Data;

public class ClubJoinRequestDto {

    // DTO for creating join request
    @Data
    public static class Request {
        private String message; // Join request message provided by user
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
        private String username;
        private String message;
        private String status;
        private String responseMessage;
    }
}