package com.moemhub.moem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipationCommentRequestDto {
    @NotBlank(message = "comment is necessary")
    private String comment;
}