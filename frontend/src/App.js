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

  // 🔍 Search & Filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // 👤 Current User
  const user = JSON.parse(localStorage.getItem("user"));

  const API = "http://localhost:5000/api/equipment";

  // 🔐 AUTH HEADER
  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // 📥 FETCH EQUIPMENT
  const fetchEquipment = useCallback(async () => {

    try {

      const res = await axios.get(
        API,
        getAuthHeader()
      );

      setEquipment(res.data);

    } catch (err) {

      console.log(err);

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

    <div className="min-h-screen bg-gray-100">

      {/* 🔝 NAVBAR */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50 h-24 flex items-center">

        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full">

          <h1 className="text-3xl font-bold text-green-600">
            MediMaintain 🏥
          </h1>

          <div className="flex items-center">

            <p className="mr-4 font-semibold">
              Role: {user?.role}
            </p>

            <button
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
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

          {/* 📊 DASHBOARD */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            <div className="bg-white shadow rounded-2xl p-4 text-center">
              <p>Total</p>
              <h2 className="text-2xl font-bold">
                {equipment.length}
              </h2>
            </div>

            <div className="bg-green-100 shadow rounded-2xl p-4 text-center">
              <p>Active</p>
              <h2 className="text-2xl font-bold">
                {activeCount}
              </h2>
            </div>

            <div className="bg-yellow-100 shadow rounded-2xl p-4 text-center">
              <p>Maintenance</p>
              <h2 className="text-2xl font-bold">
                {maintenanceCount}
              </h2>
            </div>

            <div className="bg-red-100 shadow rounded-2xl p-4 text-center">
              <p>Out</p>
              <h2 className="text-2xl font-bold">
                {outOfServiceCount}
              </h2>
            </div>

            <div className="bg-red-200 shadow rounded-2xl p-4 text-center">
              <p>Overdue</p>
              <h2 className="text-2xl font-bold">
                {overdueCount}
              </h2>
            </div>

            <div className="bg-orange-100 shadow rounded-2xl p-4 text-center">
              <p>Due Soon</p>
              <h2 className="text-2xl font-bold">
                {dueSoonCount}
              </h2>
            </div>

          </div>

          {/* 👨‍💼 ADMIN ONLY FORM */}
          {user?.role === "Admin" && (

            <div className="bg-white shadow-md rounded-2xl p-6 mt-6">

              <h2 className="text-2xl font-bold mb-4">

                {editId
                  ? "Update Equipment"
                  : "Add Equipment"}

              </h2>

              <div className="space-y-4">

                <input
                  className="p-3 border rounded-xl w-full"
                  placeholder="Equipment Name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />

                <input
                  className="p-3 border rounded-xl w-full"
                  placeholder="Location"
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                />

                <input
                  className="p-3 border rounded-xl w-full"
                  placeholder="Department"
                  value={department}
                  onChange={(e) =>
                    setDepartment(
                      e.target.value
                    )
                  }
                />

                <input
                  className="p-3 border rounded-xl w-full"
                  placeholder="Asset Tag"
                  value={assetTag}
                  onChange={(e) =>
                    setAssetTag(
                      e.target.value
                    )
                  }
                />

                <select
                  className="p-3 border rounded-xl w-full"
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
                  className="p-3 border rounded-xl w-full"
                  value={date}
                  onChange={(e) =>
                    setDate(
                      e.target.value
                    )
                  }
                />

                <button
                  className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-xl transition"
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
              className="p-3 border rounded-xl w-full"
              placeholder="Search equipment..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              className="p-3 border rounded-xl"
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

            {filteredEquipment.map((item) => (

              <div
                key={item._id}
                className="bg-white shadow-md rounded-2xl p-5 border-l-4 border-green-500"
              >

                <h2 className="text-2xl font-bold">
                  {item.name}
                </h2>

                <p className="mt-2">
                  📍 {item.location}
                </p>

                <p>
                  🏢 {item.department}
                </p>

                <p>
                  🏷 {item.assetTag}
                </p>

                <p className="mt-2">

                  Status:
                  <strong>
                    {" "}
                    {item.status}
                  </strong>

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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                      onClick={() =>
                        handleEdit(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
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

    </div>
  );
}

export default App;