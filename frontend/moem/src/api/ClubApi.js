
export const CLUB_API = {
    RECOMMENDED_CLUB:"/api/clubs/recommend/interests",
    MAIN_CLUB: (count) => {
        if(count) return `/api/clubs/recommend?count=${count}`;
        else return "/api/clubs/recommend";
    },
    SEARCH_CLUB:"/api/clubs/search",
    CREATE_CLUB: "/api/clubs",
    UPDATE_CLUB: (club_id)=>"/api/clubs/"+club_id,
    DELETE_CLUB: (club_id)=>"/api/clubs/"+club_id,
    FETCH_CLUB_INFO: (club_id)=>`/api/clubs/${club_id}/info`,
    FETCH_BOARD_LIST: (club_id)=>"/board/list/"+club_id,
    FETCH_ACTIVITY_BOARD: (club_id)=>`/api/clubs/${club_id}/activity`,
    FETCH_POST_LIST: (club_id, board_id, page, size)=>{
        if(page && size){
            return `/api/clubs/${club_id}/boards/${board_id}/posts/summary?page=${page}&size=${size}`
        }
        else{
            return `/api/clubs/${club_id}/boards/${board_id}/posts/summary`
        }
    },
    FETCH_BOARD_INFO: (club_id, board_id)=>`/board/${club_id}/${board_id}`,
    UPLOAD_POST: (club_id, board_id) => `/api/clubs/${club_id}/boards/${board_id}/posts`,
    FETCH_POST: (club_id, board_id, post_id) => `/api/clubs/${club_id}/boards/${board_id}/posts/${post_id}`,
    FETCH_ACTIVITY_POST: (club_id, post_id) => `/api/clubs/${club_id}/activity/${post_id}`,
    CLUB_JOIN_INFO: (club_id) => `/api/clubs/${club_id}/join-info`,
    CLUB_JOIN: (club_id) => `/api/clubs/${club_id}/join-requests`,
    JOIN_LIST: (club_id) => `/api/clubs/${club_id}/join-requests`,
    SET_JOIN_STATE: (request_id) => `/api/clubs/join-requests/${request_id}`,
    

}