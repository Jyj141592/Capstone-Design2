
export const ACCOUNT_API = {

    ACCOUNT_INFO: '/api/accounts/info',
    ADD_GUARDIAN: (ward, guardian) => `/api/accounts/${ward}/guardians/${guardian}`,
    ADD_WARD: (guardian, ward) => `/api/accounts/${guardian}/wards/${ward}`,
    REMOVE_GUARDIAN: (ward, guardian) => `/api/accounts/${ward}/guardians/${guardian}`,
    GET_GUARDIANS: (ward) => `/api/accounts/${ward}/guardians`,
    GET_WARDS: (guardian) => `/api/accounts/${guardian}/wards`,
    GET_WARDS_WITH_CLUB: (club_id) => `/api/accounts/wards/club/${club_id}`,
    MY_CLUBS: '/api/accounts/my-clubs',
    JOIN_REQUESTS: '/api/accounts/join-requests',
    FETCH_MY_ACTIVITIES: '/api/accounts/my-activity',
    FETCH_WARD_ACTIVITIES: '/api/accounts/wards-activity',
};