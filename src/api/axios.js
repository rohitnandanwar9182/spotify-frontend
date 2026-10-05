import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  withCredentials: true, // required: backend auth uses an httpOnly-style cookie, not a bearer token
})

export default api
