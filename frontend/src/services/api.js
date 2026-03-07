import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

// ── Automatically attach JWT token to every request ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrms_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getEmployees = () => api.get('/api/employees')
export const addEmployee = (data) => api.post('/api/employees', data)
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`)
export const updateEmployee = (id, data) => api.put(`/api/employees/${id}`, data)

export const markAttendance = (data) => api.post('/api/attendance', data)
export const getAttendance = (employeeId) => api.get(`/api/attendance/${employeeId}`)