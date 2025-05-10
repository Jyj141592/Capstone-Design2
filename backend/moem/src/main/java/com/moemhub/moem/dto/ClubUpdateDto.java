package com.moemhub.moem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubUpdateDto {
    @NotBlank(message = "클럽 이름을 입력해주세요")
    private String name;

    private String description;

    @NotBlank(message = "활동 주제를 입력해주세요")
    private String topic;

    private String profileImageName;
    private String region;
    private String applicationPrecautions;
}
