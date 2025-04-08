package com.moemhub.moem.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

public class PostDto {

    @Data
    public static class CreateRequest {
        // Title of the post (required)
        @NotBlank(message = "Title is mandatory")
        private String title;
        // Content of the post
        private String content;
    }

    @Data
    public static class UpdateRequest {
        // Title of the post (required)
        @NotBlank(message = "Title is mandatory")
        private String title;
        // Content of the post
        private String content;
    }

    @Data
    public static class Response {
        // Post ID
        private Long id;
        // Title of the post
        private String title;
        // Content of the post
        private String content;
    }
}
