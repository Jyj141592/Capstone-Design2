package com.moemhub.moem.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class RegisterDto {
    private String username;
    private String password;
}
