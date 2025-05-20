package com.moemhub.moem.service;

import com.moemhub.moem.dto.BoardDto;
import com.moemhub.moem.model.Board;
import com.moemhub.moem.model.Club;
import com.moemhub.moem.repository.BoardRepository;
import com.moemhub.moem.repository.ClubRepository;
import com.moemhub.moem.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final ClubRepository clubRepository;
    private final PostRepository postRepository;
    public BoardDto createBoard(Long clubID, BoardDto boardDto) {
        Optional<Club> club = clubRepository.findById(clubID);
        if(club.isEmpty()) return null;
        Board board = new Board();
        board.setName(boardDto.getName());
        board.setDescription(boardDto.getDescription());
        board.setClub(club.get());
        Board newBoard = boardRepository.save(board);
        
        return new BoardDto(newBoard, postRepository.countByBoardId(newBoard.getId()));
    }
    public BoardDto updateBoard(Long clubID, Long boardID, BoardDto boardDto) {
        Optional<Club> club = clubRepository.findById(clubID);
        if(club.isEmpty()) return null;
        Optional<Board> board = boardRepository.findById(boardID);
        if(board.isEmpty()) return null;
        Board updatedBoard = board.get();
        updatedBoard.setName(boardDto.getName());
        updatedBoard.setDescription(boardDto.getDescription());
        Board newBoard = boardRepository.save(updatedBoard);
        
        return new BoardDto(newBoard, postRepository.countByBoardId(newBoard.getId()));
    }
    public boolean deleteBoard(Long clubID, Long boardID) {
        Optional<Club> club = clubRepository.findById(clubID);
        if(club.isEmpty()) return false;
        Optional<Board> board = boardRepository.findById(boardID);
        if(board.isEmpty()) return false;
        boardRepository.delete(board.get());
        return true;
    }
    public List<BoardDto> listBoard(Long clubID) {
        Optional<Club> club = clubRepository.findById(clubID);
        if(club.isEmpty()) return null;
        if(club.get().getBoards() == null) return null;
        return club.get().getBoards().stream().map(BoardDto::new).toList();
    }
    public BoardDto getBoard(Long clubID, Long boardID) {
    		Optional<Club> club = clubRepository.findById(clubID);
        if(club.isEmpty()) return null;
        Optional<Board> board = boardRepository.findById(boardID);
        if(board.isEmpty()) return null;
        return new BoardDto(board.get(), postRepository.countByBoardId(boardID));
    }
}
