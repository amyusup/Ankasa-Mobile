import { RESET_FAILED, RESET_REQUEST, RESET_SUCCESS, SEND_EMAIL_REQUEST, SEND_EMAIL_RESPONSE, CLEAR_FORGOT } from '../type/forgot'

const initialState = {
    verificationCode: '',
    // isEmailFilled: false,
    loading: false,
    isSuccess: false,
    isFailed: false,
    email: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        // case EMAIL_FILLED:
        //     return {
        //         ...state,
        //         email: action.payload,
        //         isEmailFilled: true
        //     }
        // case EMAIL_CHECK:
        //     return {
        //         ...state,
        //         Email: action.payload
        //     }
        case SEND_EMAIL_REQUEST:
            return {
                ...state,
                loading: true
            }
        case SEND_EMAIL_RESPONSE:
            return {
                ...state,
                loading: false,
                email:action.payload.email,
                verificationCode:action.payload.data,

            }
        case RESET_REQUEST:
            return {
                ...state,
                loading: true
            }
        case RESET_SUCCESS: 
            return {
                ...state,
                loading: false,
                isSuccess: true,
                isFailed: false
            }
        case RESET_FAILED:
            return {
                ...state,
                loading: false,
                isFailed: true,
                isSuccess: false
            }
        case CLEAR_FORGOT:
            return {
                verificationCode: '',
                // isEmailFilled: false,
                loading: false,
                isSuccess: false,
                isFailed: false,
                email: ''
                }    
        default:
            return {
                ...state,
                isSuccess: false,
                isFailed: false
            }
            // return state
    }
}
