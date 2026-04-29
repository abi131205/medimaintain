import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getEquipment = () => API.get("/equipment");
export const addEquipment = (data) => API.post("/equipment", data);
export const deleteEquipment = (id) => API.delete(`/equipment/${id}`);
export const updateEquipment = (id, data) =>
  API.put(`/equipment/${id}`, data);