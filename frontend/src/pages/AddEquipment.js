import React, { useState } from "react";
import { addEquipment } from "../services/api";

function AddEquipment() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [lastServiced, setLastServiced] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [assetTag, setAssetTag] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await addEquipment({
        name,
        status,
        lastServiced,
        location,
        department,
        assetTag,
      });

      alert("Equipment added successfully");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding equipment");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Add Equipment</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        placeholder="Status"
        onChange={(e) => setStatus(e.target.value)}
      />
      <br />

      <input
        type="date"
        onChange={(e) => setLastServiced(e.target.value)}
      />
      <br />

      <input
        placeholder="Location"
        onChange={(e) => setLocation(e.target.value)}
      />
      <br />

      <input
        placeholder="Department"
        onChange={(e) => setDepartment(e.target.value)}
      />
      <br />

      <input
        placeholder="Asset Tag"
        onChange={(e) => setAssetTag(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>
        Add Equipment
      </button>
    </div>
  );
}

export default AddEquipment;