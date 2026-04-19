import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers : {
        'authorization' : `Bearer ${localStorage.getItem('token')}`
    }
})