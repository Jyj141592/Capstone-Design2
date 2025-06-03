package com.moemhub.moem.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

import com.moemhub.moem.model.Account;

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
    
    public static AccountInfoDto toDto(Account account) {
	    	return AccountInfoDto.builder()
	                .id(account.getId())
	                .username(account.getUsername())
	                .name(account.getName())
	                .profileImage(account.getProfileImage())
	                .age(account.getAge())
	                .gender(account.getGender())
	                .region(account.getRegion())
	                .interests(account.getInterests())
	                .build();	
    }
}
