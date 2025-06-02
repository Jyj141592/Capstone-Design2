
export const ACCOUNT_API = {

    ACCOUNT_INFO: '/api/accounts/info',
    ADD_GUARDIAN: (ward, guardian) => `/api/accounts/${ward}/guardians/${guardian}`,
    ADD_WARD: (guardian, ward) => `/api/accounts/${guardian}/wards/${ward}`,
    REMOVE_GUARDIAN: (ward, guardian) => `/api/accounts/${ward}/guardians/${guardian}`,
    GET_GUARDIANS: (ward) => `/api/accounts/${ward}/guardians`,
    GET_WARDS: (guardian) => `/api/accounts/${guardian}/wards`,
    MY_CLUBS: '/api/accounts/my-clubs',
    JOIN_REQUESTS: '/api/accounts/join-requests',
};