import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./App.css";
import Login from "./pages/Login";

function App() {
  const [equipment, setEquipment] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // 🔐 LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

 const API = "http://localhost:5000/api/equipment";

  // 🔑 AUTH HEADER
  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // 🔐 FETCH
  const fetchEquipment = useCallback(async () => {
    try {
      const res = await axios.get(API, getAuthHeader());
      setEquipment(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // ➕ ADD / ✏️ UPDATE
  const handleSave = async () => {
    if (!name) return alert("Enter equipment name");

    try {
      const data = {
        equipmentName: name,
        status,
        nextMaintenanceDate: date,
      };

      if (editId) {
        await axios.put(`${API}/${editId}`, data, getAuthHeader());
        setEditId(null);
      } else {
        await axios.post(API, data, getAuthHeader());
      }

      setName("");
      setStatus("Active");
      setDate("");
      fetchEquipment();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    await axios.delete(`${API}/${id}`, getAuthHeader());
    fetchEquipment();
  };

  // ✏️ EDIT
  const handleEdit = (item) => {
    setName(item.equipmentName);
    setStatus(item.status);
    setDate(item.nextMaintenanceDate?.split("T")[0] || "");
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔴 Overdue
  const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  // 🟠 Due Soon
  const isDueSoon = (date) => {
    if (!date) return false;

    const today = new Date();
    const maintenanceDate = new Date(date);

    const diffTime = maintenanceDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays > 0 && diffDays <= 3;
  };

  // 📊 Dashboard Counts
  const activeCount = equipment.filter(
    (e) => e.status === "Active"
  ).length;

  const maintenanceCount = equipment.filter(
    (e) => e.status === "Under Maintenance"
  ).length;

  const outOfServiceCount = equipment.filter(
    (e) => e.status === "Out of Service"
  ).length;

  const overdueCount = equipment.filter((e) =>
    isOverdue(e.nextMaintenanceDate)
  ).length;

  const dueSoonCount = equipment.filter((e) =>
    isDueSoon(e.nextMaintenanceDate)
  ).length;

  // 🔐 LOGIN CHECK
  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔝 Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 h-28 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-600">
            MediMaintain 🏥
          </h1>

          <button
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow transition"
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 📦 Main Layout */}
      <div className="max-w-7xl mx-auto px-6 pt-44 pb-8 grid lg:grid-cols-2 gap-8 items-start">

        {/* LEFT PANEL */}
        <div>

          {/* 📊 Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            <div className="bg-white shadow-md rounded-2xl p-4 text-center">
              <p className="text-gray-500">Total</p>
              <h2 className="text-2xl font-bold">{equipment.length}</h2>
            </div>

            <div className="bg-green-100 text-green-700 shadow-md rounded-2xl p-4 text-center">
              <p>Active</p>
              <h2 className="text-2xl font-bold">{activeCount}</h2>
            </div>

            <div className="bg-yellow-100 text-yellow-700 shadow-md rounded-2xl p-4 text-center">
              <p>Maintenance</p>
              <h2 className="text-2xl font-bold">{maintenanceCount}</h2>
            </div>

            <div className="bg-red-100 text-red-700 shadow-md rounded-2xl p-4 text-center">
              <p>Out</p>
              <h2 className="text-2xl font-bold">{outOfServiceCount}</h2>
            </div>

            <div className="bg-orange-100 text-orange-700 shadow-md rounded-2xl p-4 text-center">
              <p>Overdue</p>
              <h2 className="text-2xl font-bold">{overdueCount}</h2>
            </div>

            <div className="bg-blue-100 text-blue-700 shadow-md rounded-2xl p-4 text-center">
              <p>Due Soon</p>
              <h2 className="text-2xl font-bold">{dueSoonCount}</h2>
            </div>

          </div>

          {/* 🔍 Search */}
          <input
            className="mt-6 p-3 rounded-xl border shadow w-full"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* ➕ Form */}
          <div className="bg-white shadow-md rounded-2xl p-6 mt-6">

            <h2 className="text-xl font-bold text-gray-700 mb-4">
              {editId ? "Update Equipment" : "Add Equipment"}
            </h2>

            <div className="space-y-4">

              <input
                className="p-3 border rounded-xl w-full"
                placeholder="Equipment Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                className="p-3 border rounded-xl w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Active</option>
                <option>Under Maintenance</option>
                <option>Out of Service</option>
              </select>

              <input
                type="date"
                className="p-3 border rounded-xl w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl shadow transition"
                onClick={handleSave}
                disabled={!name}
              >
                {editId ? "Update Equipment" : "Add Equipment"}
              </button>

            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div>

          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Equipment List
          </h2>

          <div className="space-y-5">

            {equipment.length === 0 ? (
              <div className="bg-white shadow rounded-2xl p-6 text-center text-gray-500">
                No equipment found
              </div>
            ) : (
              equipment
                .filter((item) =>
                  item.equipmentName
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item._id}
                    className={`bg-white shadow-md rounded-2xl p-5 border-l-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${
                      isOverdue(item.nextMaintenanceDate)
                        ? "border-red-500"
                        : item.status === "Under Maintenance"
                        ? "border-yellow-500"
                        : item.status === "Out of Service"
                        ? "border-red-500"
                        : "border-green-500"
                    }`}
                  >

                    {/* Name */}
                    <h3 className="text-2xl font-bold text-gray-800">
                      {item.equipmentName}
                    </h3>

                    {/* Status */}
                    <p className="mt-2 text-sm font-medium">
                      Status:{" "}
                      <span
                        className={`${
                          item.status === "Active"
                            ? "text-green-600"
                            : item.status === "Under Maintenance"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </p>

                    {/* Date */}
                    <p className="mt-2 text-gray-600">
                      📅 Next:{" "}
                      {item.nextMaintenanceDate
                        ? item.nextMaintenanceDate.split("T")[0]
                        : "Not set"}
                    </p>

                    {/* Alerts */}
                    {isOverdue(item.nextMaintenanceDate) && (
                      <p className="text-red-500 font-semibold mt-2">
                        🔴 Overdue!
                      </p>
                    )}

                    {!isOverdue(item.nextMaintenanceDate) &&
                      isDueSoon(item.nextMaintenanceDate) && (
                        <p className="text-orange-500 font-semibold mt-2">
                          🟠 Due Soon (within 3 days)
                        </p>
                      )}

                    {/* Buttons */}
                    <div className="flex gap-3 mt-5">

                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;