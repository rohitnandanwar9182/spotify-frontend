import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // required: backend auth uses an httpOnly-style cookie, not a bearer token
})

export default api
