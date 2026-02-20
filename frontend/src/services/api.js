import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export const getEmployees = () => api.get('/api/employees')
export const addEmployee = (data) => api.post('/api/employees', data)
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`)
export const markAttendance = (data) => api.post('/api/attendance', data)
export const getAttendance = (employeeId) => api.get(`/api/attendance/${employeeId}`)
