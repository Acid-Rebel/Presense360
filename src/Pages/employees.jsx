import { useState, useMemo } from 'react';
import { useEmployees, useLocations, useDepartments, useAddEmployee, useDeleteEmployee, useUpdateFaceStatus } from './API/useEmployees';

function Employees() {
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    location: '',
    phone: '',
    department: '',
    id: ''
  });

  const { data: employees, isLoading, error } = useEmployees();
  const { data: locationOptions = [], isLoading: locationsLoading, error: locationsError } = useLocations();
  const { data: departmentOptions = [], isLoading: departmentsLoading, error: departmentsError } = useDepartments();

  const addEmployeeMutation = useAddEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();
  const updateFaceStatusMutation = useUpdateFaceStatus();

  const handleAdd = (e) => {
    e.preventDefault();
    const { id, name, phone, department, location } = newEmployee;
    if (!id || !name || !phone || !department || !location) return;

    addEmployeeMutation.mutate({ 
      id,
      name, 
      phone, 
      department: parseInt(department), // Send the department ID as an integer
      location 
    });
    setNewEmployee({ name: '', location: '', phone: '', department: '', id: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  const handleFaceRegister = (id) => {
    updateFaceStatusMutation.mutate({ id, status: 1 });
  };

  const handleFaceUnregister = (id) => {
    updateFaceStatusMutation.mutate({ id, status: 0 });
  };

  if (isLoading || locationsLoading || departmentsLoading) return <div className="p-4">Loading data...</div>;
  if (error || locationsError || departmentsError) return <div className="p-4 text-red-500">Error: {error?.message || locationsError?.message || departmentsError?.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Employees Management</h1>

      {/* Add Employee Form */}
      <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-2">
      <input
          type="text"
          placeholder="ID"
          value={newEmployee.id}
          onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={newEmployee.phone}
          onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
          className="border p-2"
        />
        {/* Department Dropdown */}
        <select
          value={newEmployee.department}
          onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
          className="border p-2"
        >
          <option value="">Select Department</option>
          {departmentOptions?.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.label}</option>
          ))}
        </select>
        {/* Location Dropdown */}
        <select
          value={newEmployee.location}
          onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
          className="border p-2"
        >
          <option value="">Select Location</option>
          {locationOptions?.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={addEmployeeMutation.isPending}
        >
          {addEmployeeMutation.isPending ? 'Adding...' : 'Add Employee'}
        </button>
      </form>

      {/* Employee Table */}
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Face Registered</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map(emp => (
            <tr key={emp.id}>
              <td className="border p-2">{emp.id}</td>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.mobile}</td>
              <td className="border p-2">{emp.dept_label}</td> {/* Use dept_label from backend */}
              <td className="border p-2">{emp.locid}</td>
              <td className="border p-2">{emp.face_status === 2 ? '✅' : '❌'}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(emp.id)}
                  disabled={deleteEmployeeMutation.isPending}
                >
                  {deleteEmployeeMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
                {emp.face_status === 1 ? (
                    <button
                        className="bg-orange-500 text-white px-2 py-1 rounded"
                        onClick={() => handleFaceUnregister(emp.id)}
                        disabled={updateFaceStatusMutation.isPending}
                    >
                        Face Registration Pending
                    </button>
                ) : emp.face_status === 0 ?(
                    <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handleFaceRegister(emp.id)}
                        disabled={updateFaceStatusMutation.isPending}
                    >
                        Enable Face Registration 
                    </button>
                ):
                (
                    <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handleFaceUnregister(emp.id)}
                        disabled={updateFaceStatusMutation.isPending}
                    >
                        Remove Face Registration
                    </button>
                )
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;