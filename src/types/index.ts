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