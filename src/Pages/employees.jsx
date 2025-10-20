import { useState, useEffect, useRef } from "react";
import {
  useEmployees,
  useLocations,
  useDepartments,
  useAddEmployee,
  useDeleteEmployee,
  useUpdateFaceStatus,
  useUpdateEmployee,
} from "./API/useEmployees";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

function Employees() {
  const [employeeData, setEmployeeData] = useState({
    id: "",
    name: "",
    location: "",
    phone: "",
    department: "",
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");

  const [selectedEmployee, setSelectedEmployee] = useState(null); // 👈 for details popup

  const { data: employees, isLoading, error } = useEmployees();
  const { data: locationOptions = [] } = useLocations();
  const { data: departmentOptions = [] } = useDepartments();

  const addEmployeeMutation = useAddEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();
  const updateFaceStatusMutation = useUpdateFaceStatus();
  const updateEmployeeMutation = useUpdateEmployee();

  const menuRef = useRef(null); // Ref applied to the dropdown container

  // 👇 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click occurred outside the dropdown menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setErrorMessage("");
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setEmployeeData({
      id: "",
      name: "",
      location: "",
      phone: "",
      department: "",
    });
    setErrorMessage("");
  };

  const handleUpdateClick = (employee) => {
    setEditingEmployee(employee);
    // Note: dept_id is the integer ID required by the backend
    setEmployeeData({
      id: employee.id,
      name: employee.name,
      location: employee.locid,
      phone: employee.mobile,
      department: employee.dept, 
    });
    setOpenMenuId(null); // Close the menu immediately
    openModal();
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const { id, name, phone, department, location } = employeeData;
    if (!id || !name || !phone || !department || !location) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const employeeToMutate = {
      id,
      name,
      phone,
      department: parseInt(department), // Ensure department is an integer ID
      location,
    };

    if (editingEmployee) {
      updateEmployeeMutation.mutate(employeeToMutate, {
        onSuccess: closeModal,
        onError: (err) =>
          setErrorMessage(err.message || "Failed to update employee."),
      });
    } else {
      addEmployeeMutation.mutate(employeeToMutate, {
        onSuccess: closeModal,
        onError: (err) =>
          setErrorMessage(err.message || "Failed to add employee."),
      });
    }
  };

  const handleDelete = (id) => {
    setOpenMenuId(null); // Close the menu immediately
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  const handleFaceRegister = (id) => {
    setOpenMenuId(null); // Close the menu immediately
    // 1 corresponds to "Face registration is enabled, user needs to register from phone"
    updateFaceStatusMutation.mutate({ id, status: 1 }); 
  };

  const handleFaceUnregister = (id) => {
    setOpenMenuId(null); // Close the menu immediately
    // 0 corresponds to "Face registration not enabled" (Clear local embeddings/disable access)
    updateFaceStatusMutation.mutate({ id, status: 0 });
  };

  if (isLoading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  const filteredEmployees = employees?.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">Home / Employees</div>

        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Company Employees</h1>
          <div className="space-x-2">
            <button
              onClick={openModal}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Add Employees
            </button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">
              Import Employees
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Employee"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Face Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees?.map((emp) => (
                <tr key={emp.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        emp.name
                      )}&background=random`}
                      alt={emp.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setSelectedEmployee(emp)} // 👈 Open details modal
                    >
                      {emp.name}
                    </span>
                  </td>
                  <td className="p-3">{emp.dept_label}</td>
                  <td className="p-3">
                    <div>{emp.mobile}</div>
                    <div className="text-xs text-gray-500">{emp.email || "-"}</div>
                  </td>
                  <td className="p-3">{emp.locid}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        emp.face_status === 0
                          ? "bg-red-100 text-red-700"
                          : emp.face_status === 1
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {emp.face_status === 0
                        ? "Not Enabled"
                        : emp.face_status === 1
                        ? "Pending Reg."
                        : "Registered"}
                    </span>
                  </td>
                  <td className="p-3 text-center relative">
                    {/* Inner wrapper for the menu with the ref */}
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === emp.id ? null : emp.id)
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                      </button>

                      {/* Dropdown Container */}
                      {openMenuId === emp.id && (
                        <div 
                          className="absolute right-6 top-8 w-48 bg-white border rounded shadow-lg z-20"
                          ref={menuRef} // Apply ref here for external click detection
                        >
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                            onClick={() => handleUpdateClick(emp)}
                          >
                            Update Info
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500"
                            onClick={() => handleDelete(emp.id)}
                          >
                            Delete
                          </button>
                          <div className="border-t my-1"></div>
                          
                          {/* Face Status Actions */}
                          {emp.face_status === 2 ? (
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-orange-600"
                              onClick={() => handleFaceUnregister(emp.id)}
                            >
                              Reset/Remove Face
                            </button>
                          ) : (
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-green-600"
                              onClick={() => handleFaceRegister(emp.id)}
                            >
                              Enable Face Registration
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal (No change needed here, logic is sound) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingEmployee ? "Update Employee" : "Add New Employee"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
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
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, id: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  disabled={!!editingEmployee}
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={employeeData.name}
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, name: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={employeeData.phone}
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, phone: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <select
                  value={employeeData.department}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      department: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Department</option>
                  {departmentOptions?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.label}
                    </option>
                  ))}
                </select>
                <select
                  value={employeeData.location}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      location: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Location</option>
                  {locationOptions?.map((loc, index) => (
                    <option key={index} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                  disabled={
                    addEmployeeMutation.isPending ||
                    updateEmployeeMutation.isPending
                  }
                >
                  {editingEmployee ? "Update Employee" : "Add Employee"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal when clicking employee name (No change needed here, logic is sound) */}
        {selectedEmployee && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setSelectedEmployee(null)}
          >
            <div
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800">
                  Employee Details
                </h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-gray-700 transition"
                >
                  &times;
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedEmployee.name
                  )}&background=random&size=128`}
                  alt={selectedEmployee.name}
                  className="h-20 w-20 rounded-full shadow-md mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedEmployee.name}
                </h3>
                <p className="text-sm text-gray-500">{selectedEmployee.email || "-"}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Employee ID</p>
                  <p className="font-medium text-gray-800">{selectedEmployee.id}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Phone</p>
                  <p className="font-medium text-gray-800">{selectedEmployee.mobile}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Department</p>
                  <p className="font-medium text-gray-800">
                    {selectedEmployee.dept_label}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Location</p>
                  <p className="font-medium text-gray-800">{selectedEmployee.locid}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 text-xs">Face Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      selectedEmployee.face_status === 0
                        ? "bg-red-100 text-red-700"
                        : selectedEmployee.face_status === 1
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selectedEmployee.face_status === 0
                      ? "Not Enabled"
                      : selectedEmployee.face_status === 1
                      ? "Pending"
                      : "Registered"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Employees;