package com.moemhub.moem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubUpdateDto {
    @NotBlank(message = "Enter Club Name")
    private String name;
    private String description;
    @NotBlank(message = "Enter Club Topic")
    private String topic;
    private String profileImageName;
    private String region;
    private String applicationPrecautions;
}
