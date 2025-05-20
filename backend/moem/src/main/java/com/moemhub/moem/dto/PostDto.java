package com.moemhub.moem.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.List;

public class PostDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Title is mandatory")
        private String title;
        private String content;
        private String thumbnail;
    }

    @Data
    public static class UpdateRequest {
        @NotBlank(message = "Title is mandatory")
        private String title;
        private String content;
        private String schedule;
        private List<String> images;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private LocalDateTime createdAt;
        private String schedule;
        private List<String> images;
        private String thumbnail;
        private Long authorId;
        private Long boardId;
    }
}
