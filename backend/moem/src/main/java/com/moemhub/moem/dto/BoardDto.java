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
    private Long id;
    private String name;
    private String description;
    private Long count;
    
    public BoardDto(Board board) {
        this.id = board.getId();
        this.name = board.getName();
        this.description = board.getDescription();
        this.count = null;
    }

    public BoardDto(Board board, Long count) {
        this.id = board.getId();
        this.name = board.getName();
        this.description = board.getDescription();
        this.count = count;
    }
}
