import { useState } from 'react';
import { useEmployees, useLocations, useDepartments, useAddEmployee, useDeleteEmployee, useUpdateFaceStatus, useUpdateEmployee } from './API/useEmployees';
import searchIcon from './Assets/2946467-200.png';


function Employees() {
  // State for a new or editing employee
  const [employeeData, setEmployeeData] = useState({
    id: '',
    name: '',
    location: '',
    phone: '',
    department: '',
  });
  
  // State to determine if we are editing an existing employee
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: employees, isLoading, error } = useEmployees();
  const { data: locationOptions = [], isLoading: locationsLoading, error: locationsError } = useLocations();
  const { data: departmentOptions = [], isLoading: departmentsLoading, error: departmentsError } = useDepartments();

  const addEmployeeMutation = useAddEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();
  const updateFaceStatusMutation = useUpdateFaceStatus();
  const updateEmployeeMutation = useUpdateEmployee();

  const openModal = () => {
    setIsModalOpen(true);
    setErrorMessage('');
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setEmployeeData({ id: '', name: '', location: '', phone: '', department: '' });
    setErrorMessage('');
  };
  
  // Sets the state to open the modal for updating
  const handleUpdateClick = (employee) => {
    setEditingEmployee(employee);
    setEmployeeData({
      id: employee.id,
      name: employee.name,
      location: employee.locid,
      phone: employee.mobile,
      department: employee.dept_id,
    });
    openModal();
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const { id, name, phone, department, location } = employeeData;
    if (!id || !name || !phone || !department || !location) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const employeeToMutate = {
      id,
      name,
      phone,
      department: parseInt(department),
      location,
    };

    if (editingEmployee) {
      updateEmployeeMutation.mutate(employeeToMutate, {
        onSuccess: () => {
          closeModal();
        },
        onError: (err) => {
          setErrorMessage(err.message || 'Failed to update employee.');
        },
      });
    } else {
      addEmployeeMutation.mutate(employeeToMutate, {
        onSuccess: () => {
          closeModal();
        },
        onError: (err) => {
          setErrorMessage(err.message || 'Failed to add employee.');
        },
      });
    }
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

  if (isLoading || locationsLoading || departmentsLoading) {
    return <div className="p-4">Loading data...</div>;
  }
  if (error || locationsError || departmentsError) {
    return <div className="p-4 text-red-500">Error: {error?.message || locationsError?.message || departmentsError?.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Employees Management</h1>
      
      <div className='bg-[#FFFFFF] px-3 py-3'>
        {/* Button to open the modal */}
        <div className='flex justify-between'>
          <div className='flex justify-between rounded border-1 py-2 px-1 mb-3'>
            <input type='text' placeholder="Search" className='focus:outline-none'></input>
            <img src={searchIcon} className='w-5 h-5 md:w-6 md:h-6 mr-3 object-contain' />
          </div>
          <button
            onClick={openModal}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-3 "
          >
            Add New Employee
          </button>
        </div>

        {/* Employee Table */}
      
        <table className="min-w-full border text-sm">
          <thead>
            <tr >
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
                <td className="border p-2">{emp.dept_label}</td>
                <td className="border p-2">{emp.locid}</td>
                <td className="border p-2">{emp.face_status === 2 ? '✅' : '❌'}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleUpdateClick(emp)}
                    disabled={updateEmployeeMutation.isPending}
                  >
                    Update
                  </button>
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
                  ) : emp.face_status === 0 ? (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleFaceRegister(emp.id)}
                      disabled={updateFaceStatusMutation.isPending}
                    >
                      Enable Face Registration 
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleFaceUnregister(emp.id)}
                      disabled={updateFaceStatusMutation.isPending}
                    >
                      Remove Face Registration
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding employee */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                  {editingEmployee ? 'Update Employee' : 'Add New Employee'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">&times;</button>
            </div>
             {errorMessage && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleAddOrUpdate} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="ID"
                value={employeeData.id}
                onChange={(e) => setEmployeeData({ ...employeeData, id: e.target.value })}
                className="border p-2 rounded w-full"
                disabled={!!editingEmployee}
              />
              <input
                type="text"
                placeholder="Name"
                value={employeeData.name}
                onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Phone"
                value={employeeData.phone}
                onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <select
                value={employeeData.department}
                onChange={(e) => setEmployeeData({ ...employeeData, department: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Department</option>
                {departmentOptions?.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.label}</option>
                ))}
              </select>
              <select
                value={employeeData.location}
                onChange={(e) => setEmployeeData({ ...employeeData, location: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Location</option>
                {locationOptions?.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                disabled={addEmployeeMutation.isPending || updateEmployeeMutation.isPending}
              >
                {editingEmployee ? 'Update Employee' : 'Add Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;