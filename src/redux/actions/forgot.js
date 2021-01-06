import Axios from 'axios'
import { URI } from '../../utils'
import { RESET_FAILED, RESET_REQUEST, RESET_SUCCESS, SEND_EMAIL_REQUEST, SEND_EMAIL_RESPONSE, CLEAR_FORGOT } from '../type/forgot'
import { ToastAndroid } from 'react-native'

export const clearForgotRequest = () => {
    return {
        type: CLEAR_FORGOT
    }
}
export const sendingEmailRequest = () => {
    return {
        type: SEND_EMAIL_REQUEST
    }
}

export const sendingEmailResponse = data => {
    return {
        type: SEND_EMAIL_RESPONSE,
        payload: data
    }
}

export const resetRequest = () => {
    return {
        type: RESET_REQUEST
    }
}

export const resetSuccess = data => {
    return {
        type: RESET_SUCCESS,
        payload: data
    }
}

export const resetFailed = message => {
    return {
        type: RESET_FAILED,
        payload: message
    }
}

export const reset = data => async dispatch => {
    dispatch(resetRequest())
    try {
        const res = await Axios.patch(`${URI}/auth/forgot`, data)
        dispatch(resetSuccess(res.data))
        ToastAndroid.show("Password has been changed", ToastAndroid.SHORT);
    } catch (error) {
        dispatch(resetFailed(error.message))
        ToastAndroid.show("Email is not registered", ToastAndroid.SHORT);
    }
}

export const sendingEmail = email => async dispatch => {
    // const res = await Axios.post(`${URI}/auth/check`, { email })
    dispatch(sendingEmailRequest())
    try{
        const res = await Axios.post(`${URI}/auth/sendEmail`,  email )
        dispatch(sendingEmailResponse(res.data.data))
    }catch(error){
        dispatch(sendingEmailResponse(error))
        ToastAndroid.show("Email not found", ToastAndroid.SHORT);
    }
    
}
export const clearForgot = () => async dispatch => {
    dispatch(clearForgotRequest())
}
