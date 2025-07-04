import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  List, 
  Edit, 
  MoreHorizontal, 
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  BookOpen,
  TrendingUp
} from 'lucide-react';
// import { Employee } from '../types';
export interface Employee {
  _id: string;
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
}

import { employeeAPI } from '../services/api';
import EmployeeModal from '../components/EmployeeModal';
import LoadingSpinner from '../components/LoadingSpinner';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getEmployees(
        currentPage,
        itemsPerPage,
        searchTerm
      );
      setEmployees(response.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSave = async (id: string, data: any) => {
    try {
      setIsUpdating(true);
      await employeeAPI.updateEmployee(id, data);
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTileClick = (employee: Employee) => {
    setExpandedEmployee(expandedEmployee === employee._id ? null : employee._id);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Employee Dashboard</h1>
          <p>Manage your team efficiently</p>
        </div>
        <div className="header-right">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="view-toggle">
            <button
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
            >
              <List size={20} />
            </button>
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {viewMode === 'table' ? (
          <div className="table-view">
            <div className="table-container">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Position</th>
                    <th>Skills</th>
                    <th>Attendance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td>
                        <div className="employee-name">
                          <div className="avatar">
                            <User size={16} />
                          </div>
                          {employee.name}
                        </div>
                      </td>
                      <td>{employee.age}</td>
                      <td>{employee.class}</td>
                      <td>
                        <div className="skills-list">
                          {employee.subjects.slice(0, 2).map((subject, index) => (
                            <span key={index} className="skill-tag">{subject}</span>
                          ))}
                          {employee.subjects.length > 2 && (
                            <span className="skill-tag more">+{employee.subjects.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="attendance-badge">{employee.attendance}%</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(employee)}
                          >
                            <Edit size={16} />
                          </button>
                          <button className="btn-more">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="tile-view">
            <div className="tiles-container">
              {employees.map((employee) => (
                <div key={employee._id} className="employee-tile">
                  <div
                    className="tile-header"
                    onClick={() => handleTileClick(employee)}
                  >
                    <div className="tile-avatar">
                      <User size={24} />
                    </div>
                    <div className="tile-info">
                      <h3>{employee.name}</h3>
                      <p>{employee.class}</p>
                    </div>
                    <div className="tile-actions">
                      <button
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(employee);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button className="btn-more">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="tile-summary">
                    <div className="stat">
                      <Calendar size={16} />
                      <span>Age: {employee.age}</span>
                    </div>
                    <div className="stat">
                      <TrendingUp size={16} />
                      <span>Attendance: {employee.attendance}%</span>
                    </div>
                  </div>

                  {expandedEmployee === employee._id && (
                    <div className="tile-expanded">
                      <div className="expanded-header">
                        <h4>Skills & Subjects</h4>
                        <button
                          className="btn-collapse"
                          onClick={() => setExpandedEmployee(null)}
                        >
                          <ChevronLeft size={16} />
                        </button>
                      </div>
                      <div className="skills-grid">
                        {employee.subjects.map((subject, index) => (
                          <span key={index} className="skill-chip">
                            <BookOpen size={14} />
                            {subject}
                          </span>
                        ))}
                      </div>
                      <div className="expanded-stats">
                        <div className="stat-card">
                          <div className="stat-value">{employee.attendance}%</div>
                          <div className="stat-label">Attendance Rate</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-value">{employee.subjects.length}</div>
                          <div className="stat-label">Skills</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={employees.length < itemsPerPage}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      <EmployeeModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default Dashboard;