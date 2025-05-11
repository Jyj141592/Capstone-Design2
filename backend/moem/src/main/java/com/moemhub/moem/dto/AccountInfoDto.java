package com.moemhub.moem.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountInfoDto {
    private Long id;
    private String username;
    private String name;
    private String profileImage;
    private Integer age;
    private String gender;
    private String region;
    private List<String> interests;
}
