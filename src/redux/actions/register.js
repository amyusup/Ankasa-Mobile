import Axios from 'axios';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  EMAIL_CHECK,
} from '../type/register';
import {URI} from '../../utils';
import {ToastAndroid} from 'react-native';

export const registerRequest = () => {
  return {
    type: REGISTER_REQUEST,
  };
};

export const registerSuccess = (message) => {
  return {
    type: REGISTER_SUCCESS,
    payload: message,
  };
};

export const registerFailed = (message) => {
  return {
    type: REGISTER_FAILED,
    payload: message,
  };
};

export const checkEmail = (email) => async (dispatch) => {
  const res = await Axios.post(`${URI}/auth/check`, {email});

  dispatch({type: EMAIL_CHECK, payload: res.data.data.message});
};

export const signup = (data) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const res = await Axios.post(`${URI}/auth/register`, data);
    dispatch(registerSuccess(res.data));
  } catch (error) {
    ToastAndroid.show(error.response.data.data.message, ToastAndroid.SHORT);
    console.log(error.response.data.data.message)
    dispatch(registerFailed(error));
  }
};
