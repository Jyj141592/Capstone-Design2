

export const ACTIVITY_API = {
    CREATE_ACTIVITY: (club_id) => `/api/${club_id}/activities/create`,
    APPLY_ACTIVITY: (club_id, act_id) => `/api/${club_id}/activities/${act_id}/apply`,
    ATTEND_ACTIVITY: (club_id, act_id) => `/api/${club_id}/activities/${act_id}/attendance`,
    SET_COMMENT: (club_id, act_id) => `/api/${club_id}/activities/${act_id}/participation/comment`,
    FETCH_ACTIVITY_DETAIL: (club_id, act_id) => `/api/${club_id}/activities/${act_id}`,
    FETCH_ACTIVITY_LIST: (club_id, year, month) => `/api/${club_id}/activities/summary?year=${year}&month=${month}`,
}