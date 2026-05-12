import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./App.css";
import Login from "./pages/Login";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const [equipment, setEquipment] = useState([]);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [date, setDate] = useState("");

  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [assetTag, setAssetTag] = useState("");

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔍 Search & Filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // 👤 Current User
  const user = JSON.parse(localStorage.getItem("user"));

  const API = "https://medimaintain.onrender.com/api/equipment";

  // 🔐 AUTH HEADER
  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // 📥 FETCH EQUIPMENT
  const fetchEquipment = useCallback(async () => {

    try {

  setLoading(true);

      const res = await axios.get(
        API,
        getAuthHeader()
      );

      setEquipment(res.data);
      setLoading(false);

    } catch (err) {

      console.log(err);
      setLoading(false);

      toast.error(
        err.response?.data?.message ||
        "Failed to fetch equipment"
      );
    }

  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // ➕ ADD / ✏️ UPDATE
  const handleSave = async () => {

    if (!name) {
      return toast.error(
        "Enter equipment name"
      );
    }

    try {

      const data = {
        name,
        status,
        lastServiced: date,
        location,
        department,
        assetTag,
      };

      // ✏️ UPDATE
      if (editId) {

        await axios.put(
          `${API}/${editId}`,
          data,
          getAuthHeader()
        );

        toast.success(
          "Equipment updated successfully"
        );

        setEditId(null);

      } else {

        // ➕ ADD
        await axios.post(
          API,
          data,
          getAuthHeader()
        );

        toast.success(
          "Equipment added successfully"
        );
      }

      // 🔄 RESET
      setName("");
      setStatus("Active");
      setDate("");
      setLocation("");
      setDepartment("");
      setAssetTag("");

      fetchEquipment();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {

    if (!window.confirm(
      "Delete equipment?"
    )) return;

    try {

      await axios.delete(
        `${API}/${id}`,
        getAuthHeader()
      );

      toast.success(
        "Equipment deleted"
      );

      fetchEquipment();

    } catch (err) {

      toast.error("Delete failed");
    }
  };

  // ✏️ EDIT
  const handleEdit = (item) => {

    setName(item.name);

    setStatus(item.status);

    setDate(
      item.lastServiced?.split("T")[0] || ""
    );

    setLocation(item.location || "");

    setDepartment(item.department || "");

    setAssetTag(item.assetTag || "");

    setEditId(item._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 🔴 OVERDUE
  const isOverdue = (date) => {

    if (!date) return false;

    return new Date(date) < new Date();
  };

  // 🟠 DUE SOON
  const isDueSoon = (date) => {

    if (!date) return false;

    const today = new Date();

    const maintenanceDate =
      new Date(date);

    const diffTime =
      maintenanceDate - today;

    const diffDays =
      diffTime / (1000 * 60 * 60 * 24);

    return diffDays > 0 &&
      diffDays <= 3;
  };

  // 📊 COUNTS
  const activeCount =
    equipment.filter(
      (e) => e.status === "Active"
    ).length;

  const maintenanceCount =
    equipment.filter(
      (e) =>
        e.status ===
        "Under Maintenance"
    ).length;

  const outOfServiceCount =
    equipment.filter(
      (e) =>
        e.status ===
        "Out of Service"
    ).length;

  const overdueCount =
    equipment.filter((e) =>
      isOverdue(e.lastServiced)
    ).length;

  const dueSoonCount =
    equipment.filter((e) =>
      isDueSoon(e.lastServiced)
    ).length;

  // 🔍 FILTERED EQUIPMENT
  const filteredEquipment =
    equipment.filter((item) => {

      const matchesSearch =

        item.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.department
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.assetTag
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =

        filterStatus === "All" ||

        item.status === filterStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // 🔐 LOGIN CHECK
  if (!isLoggedIn) {
    return (
      <Login
        setIsLoggedIn={
          setIsLoggedIn
        }
      />
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-sky-50 to-emerald-100">

      {/* 🔝 NAVBAR */}
      <nav className="bg-white/70 backdrop-blur-lg shadow-xl border-b border-white/30 fixed top-0 left-0 w-full z-50 h-24 flex items-center">

        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full">

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent tracking-wide">
            MediMaintain 🏥
          </h1>

          <div className="flex items-center">

            <p className="mr-4 font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
              {user?.role}
            </p>

            <button
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 shadow-lg text-white px-5 py-2 rounded-xl transition duration-300"
              onClick={() => {

                localStorage.removeItem(
                  "token"
                );

                localStorage.removeItem(
                  "user"
                );

                setIsLoggedIn(false);
              }}
            >
              Logout
            </button>

          </div>

        </div>

      </nav>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 pt-36 pb-8 grid lg:grid-cols-2 gap-8">

        {/* LEFT */}
        <div>
        <div className="mb-8">

  <h2 className="text-4xl font-bold text-cyan-700">
    Welcome, {user?.name} 👋
  </h2>

  <p className="text-gray-600 mt-2 text-lg">
    Biomedical Equipment Monitoring Dashboard
  </p>

  <p className="text-gray-500 mt-1">
    {new Date().toDateString()}
  </p>

</div>
          {/* 📊 DASHBOARD */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            <div className="bg-white/70 backdrop-blur-lg shadow-xl hover:scale-105 transition duration-300 rounded-2xl p-4 text-center border border-white/30">
              <p className="text-gray-600">Total</p>
              <h2 className="text-3xl font-bold text-cyan-600">
                {equipment.length}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-green-200 to-emerald-100 shadow-xl rounded-2xl p-4 text-center hover:scale-105 transition duration-300">
              <p>Active</p>
              <h2 className="text-3xl font-bold">
                {activeCount}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-yellow-200 to-orange-100 shadow-xl rounded-2xl p-4 text-center hover:scale-105 transition duration-300">
              <p>Maintenance</p>
              <h2 className="text-3xl font-bold">
                {maintenanceCount}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-red-200 to-pink-100 shadow-xl rounded-2xl p-4 text-center hover:scale-105 transition duration-300">
              <p>Out</p>
              <h2 className="text-3xl font-bold">
                {outOfServiceCount}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-red-300 to-pink-200 shadow-xl rounded-2xl p-4 text-center hover:scale-105 transition duration-300">
              <p>Overdue</p>
              <h2 className="text-3xl font-bold">
                {overdueCount}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-orange-200 to-yellow-100 shadow-xl rounded-2xl p-4 text-center hover:scale-105 transition duration-300">
              <p>Due Soon</p>
              <h2 className="text-3xl font-bold">
                {dueSoonCount}
              </h2>
            </div>

          </div>

          {/* 👨‍💼 ADMIN ONLY FORM */}
          {user?.role === "Admin" && (

            <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-6 mt-6 border border-white/30">

              <h2 className="text-3xl font-bold mb-6 text-cyan-700">

                {editId
                  ? "Update Equipment"
                  : "Add Equipment"}

              </h2>

              <div className="space-y-4">
                {filteredEquipment.length === 0 && (

  <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-10 text-center border border-white/30">

    <h2 className="text-3xl font-bold text-gray-600">
      No Equipment Found 🏥
    </h2>

    <p className="text-gray-500 mt-3">
      Add equipment to begin monitoring
    </p>

  </div>

)}

                <input
                  className="p-3 border border-white/40 rounded-2xl w-full bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none shadow-sm"
                  placeholder="Equipment Name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />

                <input
                  className="p-3 border border-white/40 rounded-2xl w-full bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none shadow-sm"
                  placeholder="Location"
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                />

                <input
                  className="p-3 border border-white/40 rounded-2xl w-full bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none shadow-sm"
                  placeholder="Department"
                  value={department}
                  onChange={(e) =>
                    setDepartment(
                      e.target.value
                    )
                  }
                />

                <input
                  className="p-3 border border-white/40 rounded-2xl w-full bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none shadow-sm"
                  placeholder="Asset Tag"
                  value={assetTag}
                  onChange={(e) =>
                    setAssetTag(
                      e.target.value
                    )
                  }
                />

                <select
                  className="p-3 border border-white/40 rounded-2xl w-full bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none shadow-sm"
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                >

                  <option>
                    Active
                  </option>

                  <option>
                    Under Maintenance
                  </option>

                  <option>
                    Out of Service
                  </option>

                </select>

                <input
                  type="date"
                  className="p-3 border border-white/40 rounded-2xl w-full bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none shadow-sm"
                  value={date}
                  onChange={(e) =>
                    setDate(
                      e.target.value
                    )
                  }
                />

                <button
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:scale-105 shadow-xl text-white w-full py-3 rounded-2xl transition duration-300 font-bold"
                  onClick={handleSave}
                >

                  {editId
                    ? "Update Equipment"
                    : "Add Equipment"}

                </button>

              </div>

            </div>

          )}

        </div>

        {/* RIGHT */}
        <div>

          {/* 🔍 SEARCH + FILTER */}
          <div className="flex gap-3 mb-5">

            <input
              className="p-3 border border-white/40 rounded-2xl w-full bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none shadow-sm"
              placeholder="Search equipment..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              className="p-3 border border-white/40 rounded-2xl bg-white/60 backdrop-blur-md focus:ring-2 focus:ring-cyan-400 outline-none shadow-sm"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value
                )
              }
            >

              <option>
                All
              </option>

              <option>
                Active
              </option>

              <option>
                Under Maintenance
              </option>

              <option>
                Out of Service
              </option>

            </select>

          </div>

          {/* 📋 LIST */}
          <div className="space-y-4">
            {loading && (

  <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-10 text-center border border-white/30">

    <h2 className="text-2xl font-bold text-cyan-600 animate-pulse">
      Loading Equipment...
    </h2>

  </div>

)}

            {filteredEquipment.map((item) => (

              <div
                key={item._id}
                className="bg-white/75 backdrop-blur-lg shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition duration-300 rounded-3xl p-5 border-l-8 border-emerald-500 border border-white/30"
              >

                <h2 className="text-2xl font-bold text-cyan-700">
                  {item.name}
                </h2>

                <p className="mt-2 text-gray-700">
                  📍 {item.location}
                </p>

                <p className="text-gray-700">
                  🏢 {item.department}
                </p>

                <p className="text-gray-700">
                  🏷 {item.assetTag}
                </p>

                <p className="mt-2">

                  Status:
                  <span
  className={`px-3 py-1 rounded-full text-white text-sm font-semibold ml-2 ${
    item.status === "Active"
      ? "bg-green-500"
      : item.status === "Under Maintenance"
      ? "bg-yellow-500"
      : "bg-red-500"
  }`}
>
  {item.status}
</span>

                </p>

                <p>

                  📅 Last Serviced:

                  {" "}

                  {item.lastServiced
                    ? item.lastServiced.split("T")[0]
                    : "N/A"}

                </p>

                {isOverdue(
                  item.lastServiced
                ) && (

                  <p className="text-red-500 font-bold mt-2">
                    🔴 Overdue
                  </p>

                )}

                {!isOverdue(
                  item.lastServiced
                ) &&

                  isDueSoon(
                    item.lastServiced
                  ) && (

                    <p className="text-orange-500 font-bold mt-2">
                      🟠 Due Soon
                    </p>

                  )}

                {/* 👨‍💼 ADMIN ONLY BUTTONS */}
                {user?.role === "Admin" && (

                  <div className="flex gap-3 mt-5">

                    <button
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 shadow-lg text-white px-4 py-2 rounded-xl transition duration-300"
                      onClick={() =>
                        handleEdit(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 shadow-lg text-white px-4 py-2 rounded-xl transition duration-300"
                      onClick={() =>
                        handleDelete(
                          item._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* 🔔 TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    <footer className="text-center py-6 text-gray-600 font-medium">

  MediMaintain © 2026 • Biomedical Equipment Management System 🏥

</footer>
    </div>
  );
}

export default App;