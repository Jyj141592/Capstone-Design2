package com.moemhub.moem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class ClubDTO {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String name;
        private String description;
        private boolean isPublic;
    }

    @Data
    public static class UpdateRequest {
        @NotBlank
        private String name;
        private String description;
        private boolean isPublic;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private boolean isPublic;
    }
}
