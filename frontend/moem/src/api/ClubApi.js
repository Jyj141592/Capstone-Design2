
export const CLUB_API = {
    CREATE_CLUB: "/api/clubs",
    UPDATE_CLUB: (club_id)=>"/api/clubs/"+club_id,
    DELETE_CLUB: (club_id)=>"/api/clubs/"+club_id,
    FETCH_CLUB_INFO: (club_id)=>"/api/clubs/"+club_id,
    FETCH_BOARD_LIST: (club_id)=>"/board/list/"+club_id,
    FETCH_POST_LIST: (club_id, board_id)=>`/api/clubs/${club_id}/boards/${board_id}/posts/summary`,
}