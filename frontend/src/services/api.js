import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 📦 Equipment APIs
export const getEquipment = () => API.get("/equipment");

export const addEquipment = (data) => API.post("/equipment", data);

export const deleteEquipment = (id) =>
  API.delete(`/equipment/${id}`);

export const updateEquipment = (id, data) =>
  API.put(`/equipment/${id}`, data);

export default API;