export const SET_SOCKET = 'SET_SOCKET';
export const SET_DATABASE = 'SET_DATABASE';
export const SET_NAME = 'SET_NAME';
export const SET_SERVER = 'SET_SERVER';
export const SET_NAVIGATION = 'SET_NAVIGATION';

const initialState = {
    socket: null,
    server: '192.168.43.115:3000',
    consultantName: ''
};
//
export default function settings (state = initialState, action ) {
    switch (action.type) {
        case SET_SOCKET:
            return { ...state, socket: action.payload };
        case SET_DATABASE:
            return { ...state, database: action.payload };
        case SET_SERVER:
            return { ...state, server: action.payload };
        case SET_NAME:
            return { ...state, consultantName: action.payload };
        case SET_NAVIGATION:
            return { ...state, navigation: action.payload };
        default:
            return state;
    }
}

