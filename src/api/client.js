import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('atelier-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('atelier-token')
      localStorage.removeItem('atelier-user')
    }
    return Promise.reject(error)
  }
)

export default apiClient
