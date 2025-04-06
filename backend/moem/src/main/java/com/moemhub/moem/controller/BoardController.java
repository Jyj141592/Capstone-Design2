package com.moemhub.moem.controller;

import com.moemhub.moem.dto.BoardDto;
import com.moemhub.moem.model.Board;
import com.moemhub.moem.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;
    @PostMapping("/create/{clubID}")
    public ResponseEntity<BoardDto> createBoard(@PathVariable Long clubID, @RequestBody BoardDto boardDto) {
        BoardDto response = boardService.createBoard(clubID, boardDto);
        if(response != null) return ResponseEntity.ok(response);
        return ResponseEntity.internalServerError().build();
    }
    @PostMapping("/update/{clubID}/{boardID}")
    public ResponseEntity<BoardDto> updateBoard(@PathVariable Long clubID, @PathVariable Long boardID, @RequestBody BoardDto boardDto) {
        BoardDto response = boardService.updateBoard(clubID, boardID, boardDto);
        if (response != null) return ResponseEntity.ok(response);
        return ResponseEntity.internalServerError().build();
    }
    @PostMapping("/delete/{clubID}/{boardID}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long clubID, @PathVariable Long boardID) {
        if (boardService.deleteBoard(clubID, boardID)) return ResponseEntity.ok().build();
        return ResponseEntity.internalServerError().build();
    }
    @GetMapping("/list/{clubID}")
    public ResponseEntity<List<BoardDto>> listBoard(@PathVariable Long clubID) {
        return ResponseEntity.ok(boardService.listBoard(clubID));
    }
}
