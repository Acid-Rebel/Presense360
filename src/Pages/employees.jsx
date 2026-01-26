import { useState, useEffect, useRef } from "react";
import {
  useEmployees,
  useLocations,
  useDepartments,
  useAddEmployee,
  useDeleteEmployee,
  useUpdateFaceStatus,
  useUpdateEmployee,
  useAdmin, // 👈 Imported the new hook
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

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { data: employees, isLoading, error } = useEmployees();
  const { data: locationOptions = [] } = useLocations();
  const { data: departmentOptions = [] } = useDepartments();
  const { isAuthorized } = useAdmin(); // 👈 Get authorization status

  const addEmployeeMutation = useAddEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();
  const updateFaceStatusMutation = useUpdateFaceStatus();
  const updateEmployeeMutation = useUpdateEmployee();

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    setEmployeeData({
      id: employee.id,
      name: employee.name,
      location: employee.locid,
      phone: employee.mobile,
      department: employee.dept, 
    });
    setOpenMenuId(null);
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
      department: parseInt(department),
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
    setOpenMenuId(null);
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  const handleFaceRegister = (id) => {
    setOpenMenuId(null);
    updateFaceStatusMutation.mutate({ id, status: 1 }); 
  };

  const handleFaceUnregister = (id) => {
    setOpenMenuId(null);
    updateFaceStatusMutation.mutate({ id, status: 0 });
  };

  if (isLoading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  const filteredEmployees = employees?.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="text-sm text-gray-500 mb-4">Home / Employees</div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Company Employees</h1>
          <div className="space-x-2">
            {/* 👈 ONLY SHOW ADD BUTTON IF AUTHORIZED */}
            {isAuthorized && (
              <button
                onClick={openModal}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
              >
                + Add Employees
              </button>
            )}
          </div>
        </div>

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

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Department</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Face Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees?.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{emp.id}</td>
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`}
                      alt={emp.name}
                      className="h-8 w-8 rounded-full shadow-sm"
                    />
                    <span
                      className="text-blue-600 font-semibold cursor-pointer hover:underline"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      {emp.name}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{emp.dept_label}</td>
                  <td className="p-4">
                    <div className="text-gray-900 font-medium">{emp.mobile}</div>
                    <div className="text-[10px] text-gray-400">{emp.email || "-"}</div>
                  </td>
                  <td className="p-4 text-gray-600">{emp.locid}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                        emp.face_status === 0
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : emp.face_status === 1
                          ? "bg-orange-50 text-orange-600 border border-orange-100"
                          : "bg-green-50 text-green-600 border border-green-100"
                      }`}
                    >
                      {emp.face_status === 0
                        ? "Not Enabled"
                        : emp.face_status === 1
                        ? "Pending Reg."
                        : "Registered"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === emp.id ? null : emp.id)
                        }
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                      </button>

                      {openMenuId === emp.id && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100"
                          ref={menuRef}
                        >
                          {/* 👈 ONLY SHOW UPDATE/DELETE IF AUTHORIZED */}
                          {isAuthorized && (
                            <>
                              <button
                                className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => handleUpdateClick(emp)}
                              >
                                Update Info
                              </button>
                              <button
                                className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                onClick={() => handleDelete(emp.id)}
                              >
                                Delete Employee
                              </button>
                              <div className="border-t border-gray-50 my-1"></div>
                            </>
                          )}
                          
                          {/* FACE REGISTRATION (UNTOUCHED) */}
                          {emp.face_status === 2 ? (
                            <button
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
                              onClick={() => handleFaceUnregister(emp.id)}
                            >
                              Reset Face Data
                            </button>
                          ) : (
                            <button
                              className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors"
                              onClick={() => handleFaceRegister(emp.id)}
                            >
                              Enable Face Reg.
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

        {/* Modal Logic remains unchanged */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-800 tracking-tight">
                  {editingEmployee ? "Update Record" : "Register Employee"}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-800 transition-colors">
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              {errorMessage && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-xs font-bold uppercase border border-red-100">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleAddOrUpdate} className="space-y-4">
                <input
                  type="text"
                  placeholder="Employee ID"
                  value={employeeData.id}
                  onChange={(e) => setEmployeeData({ ...employeeData, id: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                  disabled={!!editingEmployee}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={employeeData.name}
                  onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={employeeData.phone}
                  onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                />
                <select
                  value={employeeData.department}
                  onChange={(e) => setEmployeeData({ ...employeeData, department: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-gray-700 bg-gray-50"
                >
                  <option value="">Select Department</option>
                  {departmentOptions?.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.label}</option>
                  ))}
                </select>
                <select
                  value={employeeData.location}
                  onChange={(e) => setEmployeeData({ ...employeeData, location: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-gray-700 bg-gray-50"
                >
                  <option value="">Select Primary Location</option>
                  {locationOptions?.map((loc, index) => (
                    <option key={index} value={loc}>{loc}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                  disabled={addEmployeeMutation.isPending || updateEmployeeMutation.isPending}
                >
                  {editingEmployee ? "Commit Changes" : "Create Record"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal (Selected Employee) */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4" onClick={() => setSelectedEmployee(null)}>
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-center mb-8">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedEmployee.name)}&background=random&size=128`}
                  alt={selectedEmployee.name}
                  className="h-24 w-24 rounded-3xl shadow-xl mb-4 border-4 border-white"
                />
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{selectedEmployee.name}</h3>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">{selectedEmployee.dept_label}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee ID</span>
                  <span className="text-sm font-bold text-gray-700">{selectedEmployee.id}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</span>
                  <span className="text-sm font-bold text-gray-700">{selectedEmployee.mobile}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</span>
                  <span className="text-sm font-bold text-gray-700">{selectedEmployee.locid}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Face Bio</span>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    selectedEmployee.face_status === 2 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {selectedEmployee.face_status === 2 ? "Verified" : "Unset"}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedEmployee(null)}
                className="w-full mt-8 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-800 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Employees;