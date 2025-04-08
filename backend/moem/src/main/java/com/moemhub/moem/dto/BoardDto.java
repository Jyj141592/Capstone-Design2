package com.moemhub.moem.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.moemhub.moem.model.Board;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardDto {
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long id;
    private String name;
    private String description;

    public BoardDto(Board board) {
        this.id = board.getId();
        this.name = board.getName();
        this.description = board.getDescription();
    }
}
