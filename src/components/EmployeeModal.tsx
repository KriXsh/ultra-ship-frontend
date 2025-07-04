import React, { useState, useEffect } from 'react';
import { X, Save, User, Calendar, BookOpen, Users } from 'lucide-react';
// import { Employee, UpdateEmployeeData } from '../types/index.ts';

export interface Employee {
  _id: string;
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
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

interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateEmployeeData) => void;
  isLoading?: boolean;
}

export interface UpdateEmployeeData {
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: string | number;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<UpdateEmployeeData>({
    name: '',
    age: 0,
    class: '',
    subjects: [],
    attendance: ''
  });

  const [subjectInput, setSubjectInput] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        age: employee.age,
        class: employee.class,
        subjects: employee.subjects,
        attendance: employee.attendance.toString()
      });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee) {
      onSave(employee._id, formData);
    }
  };

  const addSubject = () => {
    if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput.trim()]
      }));
      setSubjectInput('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            <User size={24} />
            Edit Employee
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>
              <User size={16} />
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Calendar size={16} />
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: Number(e.target.value) }))}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <BookOpen size={16} />
              Class/Position
            </label>
            <input
              type="text"
              value={formData.class}
              onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Users size={16} />
              Subjects/Skills
            </label>
            <div className="subjects-container">
              <div className="subjects-list">
                {formData.subjects.map((subject) => (
                  <span key={subject} className="subject-tag">
                    {subject}
                    <button 
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="remove-subject"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="add-subject">
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Add subject/skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                />
                <button type="button" onClick={addSubject}>Add</button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>
              <Calendar size={16} />
              Attendance
            </label>
            <input
              type="text"
              value={formData.attendance}
              onChange={(e) => setFormData(prev => ({ ...prev, attendance: e.target.value }))}
              placeholder="e.g., 95% or 95"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;