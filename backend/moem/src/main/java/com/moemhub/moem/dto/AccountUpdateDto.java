package com.moemhub.moem.dto;

import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountUpdateDto {
    private String name;
    private String profileImage;
    private Integer age;
    private String gender;
    private String region;
    private List<String> interests;
}
