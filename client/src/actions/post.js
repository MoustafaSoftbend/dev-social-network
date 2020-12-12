import axios from 'axios';
import {setAlert} from './alert'
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from './types';

// Get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');

        dispatch ({
            type: GET_POSTS,
            payload: res.data
        })

    }catch(err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.data.statusText, status: err.response.data.status}
        })
    }
}

// Add like
export const addLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`);

        dispatch ({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}
        })

    }catch(err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.data.statusText, status: err.response.data.status}
        })
    }
}

// Remove like
export const removeLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`);

        dispatch ({
            type: UPDATE_LIKES,
            payload: {id, likes: res.data}
        })

    }catch(err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.data.statusText, status: err.response.data.status}
        })
    }
}

// Remove post
export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`);

        dispatch ({
            type: DELETE_POST,
            payload: id
        })

        dispatch(setAlert('Post removed', 'success'))

    }catch(err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.data.statusText, status: err.response.data.status}
        })
    }
}

// Add post
export const addPost = formData => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        
        const res = await axios.post('/api/posts',formData ,config);

        dispatch ({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert('Post created', 'success'))

    }catch(err) {
        console.log(err)
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.data.statusText, status: err.response.data.status}
        })
    }
}

// Get posts
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);

        dispatch ({
            type: GET_POST,
            payload: res.data
        })

    }catch(err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.data.statusText, status: err.response.data.status}
        })
    }
}

// Add Comment
export const addComment = (postId, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(formData)
        const res = await axios.post(`/api/posts/comment/${postId}`,formData ,config);

        dispatch ({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert('Comment added', 'success'))

    }catch(err) {
        console.error(err.response.data)
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.data.statusText, status: err.response.data.status}
        })
    }
}

// Remove comment
export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postId}/${commentId}`);

        dispatch ({
            type: REMOVE_COMMENT,
            payload: commentId
        })

        dispatch(setAlert('Comment removed', 'success'))

    }catch(err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: err.response.data.statusText, status: err.response.data.status}
        })
    }
}