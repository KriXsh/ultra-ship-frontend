import axios from 'axios';
// import {
//   SignUpData,
//   SignUpResponse,
//   EmployeesResponse,
//   UpdateEmployeeData,
//   UpdateEmployeeResponse,
// } from '../types';

export interface Employee {
  _id: string;
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
}

export interface SignUpResponse {
  code: number;
  message: string;
  token: string;
}

export interface EmployeesResponse {
  code: number;
  message: string;
  employees: Employee[];
}

export interface UpdateEmployeeResponse {
  code: number;
  message: string;
  updatedEmployee: Employee;
}

export interface SignUpData {
  username: string;
  password: string;
}

export interface UpdateEmployeeData {
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: string | number;
}
const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signUp: async (data: SignUpData): Promise<SignUpResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
};

export const employeeAPI = {
  getEmployees: async (
    page = 1,
    limit = 10,
    name = '',
    sortBy = 'name',
    sortOrder = 'asc'
  ): Promise<EmployeesResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });
    
    if (name) {
      params.append('name', name);
    }
    
    const response = await api.get(`/employees?${params}`);
    return response.data;
  },

  updateEmployee: async (
    id: string,
    data: UpdateEmployeeData
  ): Promise<UpdateEmployeeResponse> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },
};

export default api;