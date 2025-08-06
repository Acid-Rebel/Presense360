import { useState, useEffect } from 'react';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', location: '' });

 
  useEffect(() => {
    setEmployees([
      { id: 1, name: 'Alice', location: 'Office', faceRegistered: true },
      { id: 2, name: 'Bob', location: 'Remote', faceRegistered: false },
    ]);
  }, []);

  const handleAdd = () => {
    if (!newEmployee.name) return;
    const id = employees.length + 1;
    setEmployees([...employees, { id, ...newEmployee, faceRegistered: false }]);
    setNewEmployee({ name: '', location: '' });
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


      <div className="mb-6">
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={newEmployee.location}
          onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Employee
        </button>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
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
              <td className="border p-2">
                <input
                  value={emp.location}
                  onChange={(e) => handleLocationEdit(emp.id, e.target.value)}
                  className="border p-1 w-full"
                />
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
