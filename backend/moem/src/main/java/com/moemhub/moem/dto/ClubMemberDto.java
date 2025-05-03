package com.moemhub.moem.dto;

import com.moemhub.moem.model.ClubMember;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class ClubMemberDto {

    @Data
    public static class JoinRequest {
        private String message; // Optional message for join request
    }

    @Data
    public static class ChangeRoleRequest {
        @NotNull
        private ClubMember.Role role; // New role to assign
    }

    @Data
    public static class Response {
        private Long id;
        private Long accountId;
        private String username;
        private ClubMember.Role role;
    }
}
