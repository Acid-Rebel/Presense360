import { useState, useEffect } from 'react';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    location: '',
    phone: '',
    department: ''
  });

  const locationOptions = ['Head Office', 'Branch A', 'Branch B', 'Remote'];
  const departmentOptions = ['HR', 'Engineering', 'Sales', 'Support'];

  useEffect(() => {
    setEmployees([
      {
        id: 1,
        name: 'Alice',
        phone: '9876543210',
        department: 'HR',
        location: 'Head Office',
        faceRegistered: true
      },
      {
        id: 2,
        name: 'Bob',
        phone: '9123456780',
        department: 'Engineering',
        location: 'Remote',
        faceRegistered: false
      }
    ]);
  }, []);

  const handleAdd = () => {
    const { name, phone, department, location } = newEmployee;
    if (!name || !phone || !department || !location) return;

    const id = employees.length + 1;
    setEmployees([...employees, { id, ...newEmployee, faceRegistered: false }]);
    setNewEmployee({ name: '', location: '', phone: '', department: '' });
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleLocationEdit = (id, newLocation) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, location: newLocation } : emp));
  };

  const handleFaceRegister = (id) => {
    alert(`Triggering face registration for employee ID ${id} (to be implemented)`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Employees Management</h1>

      {/* Add Employee */}
      <div className="mb-6 flex flex-wrap gap-2">
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
        <select
          value={newEmployee.department}
          onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
          className="border p-2"
        >
          <option value="">Select Department</option>
          {departmentOptions.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          value={newEmployee.location}
          onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
          className="border p-2"
        >
          <option value="">Select Location</option>
          {locationOptions.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Employee
        </button>
      </div>

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
          {employees.map(emp => (
            <tr key={emp.id}>
              <td className="border p-2">{emp.id}</td>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.phone}</td>
              <td className="border p-2">{emp.department}</td>
              <td className="border p-2">
                <select
                  value={emp.location}
                  onChange={(e) => handleLocationEdit(emp.id, e.target.value)}
                  className="border p-1 w-full"
                >
                  {locationOptions.map((loc, index) => (
                    <option key={index} value={loc}>{loc}</option>
                  ))}
                </select>
              </td>
              <td className="border p-2">{emp.faceRegistered ? '✅' : '❌'}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(emp.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => handleFaceRegister(emp.id)}
                >
                  Face Register
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
