
export const AUTH_API = {
    LOGIN: "/login",
    LOGOUT: "/signout",
    REGISTER: "/register",
    REFRESH_TOKEN: "/refresh",
    CLUB_PRIVILEGE: (club_id)=>`/privilege/${club_id}`,
};