
export const CLUB_API = {
    RECOMMENDED_CLUB:"/api/clubs/recommend/interests",
    SEARCH_CLUB:"/api/clubs/search",
    CREATE_CLUB: "/api/clubs",
    UPDATE_CLUB: (club_id)=>"/api/clubs/"+club_id,
    DELETE_CLUB: (club_id)=>"/api/clubs/"+club_id,
    FETCH_CLUB_INFO: (club_id)=>"/api/clubs/"+club_id,
    FETCH_BOARD_LIST: (club_id)=>"/board/list/"+club_id,
    FETCH_POST_LIST: (club_id, board_id, page, size)=>{
        if(page && size){
            return `/api/clubs/${club_id}/boards/${board_id}/posts/summary?page=${page}&size=${size}`
        }
        else{
            return `/api/clubs/${club_id}/boards/${board_id}/posts/summary`
        }
    },
    FETCH_BOARD_INFO: (club_id, board_id)=>`/board/${club_id}/${board_id}`,
    UPLOAD_POST: (club_id, board_id) => `/api/clubs/${club_id}/boards/${board_id}/posts` 
}