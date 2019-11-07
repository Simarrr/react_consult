export const SET_SOCKET = 'SET_SOCKET';
export const SET_NAME = 'SET_NAME';

const initialState = {
    socket: null,
    server: '192.168.8.100:3123',
    consultantName: ''
};
//
export default function settings (state = initialState, action ) {
    switch (action.type) {
        case SET_SOCKET:
            return { ...state, socket: action.payload };
        case SET_NAME:
            return { ...state, consultantName: action.payload };
        default:
            return state;
    }
}

