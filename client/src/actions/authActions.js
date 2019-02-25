import axios from 'axios';
import jwt_decode from 'jwt-decode';

import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register user
export const registerUser = (userData, history) => dispatch => {
  axios.post('/api/user/register', userData, {
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(res => history.push('/login'))
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
}

// Login user - Get user token
export const loginUser = userData => dispatch => {
  axios.post('/api/user/login', userData, {
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(res => {
    console.log(res)
    // Save token to Local Storage
    const { token } = res.data;
    localStorage.setItem('jwtToken', token);
    //Set token to auth header
    setAuthToken(token);
    // Decode token to get user data
    const decoded = jwt_decode(token);
    //Set current user
    dispatch(setCurrentUser(decoded));
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// Logout user
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  //Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};