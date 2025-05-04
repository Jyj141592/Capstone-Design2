package com.moemhub.moem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
public class RegisterDto {
    private String username;
    private String password;
    private String name;
    private String profileImage;
    private Integer age;
    private String gender;
    private String region;
    private List<String> interests;
    private List<Long> guardianIds;
}