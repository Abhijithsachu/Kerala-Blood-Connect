import { useState } from "react";
import api from "../api/api";

const initialForm = {
  patientName: "",
  bloodGroupNeeded: "",
  unitsRequired: 1,
  hospitalName: "",
  location: "",
  contactNumber: "",
  urgencyLevel: "Medium",
  isPublic: true
};

function RequestBlood() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/requests", form);
    setMessage("Blood request submitted successfully.");
    setForm(initialForm);
  };

  return (
    <section className="page section narrow">
      <h1>Request Blood</h1>
      <form className="form card" onSubmit={submit}>
        {message && <p className="success">{message}</p>}
        <input name="patientName" placeholder="Patient name" value={form.patientName} onChange={update} required />
        <select name="bloodGroupNeeded" value={form.bloodGroupNeeded} onChange={update} required>
          <option value="">Blood group needed</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}
        </select>
        <input name="unitsRequired" type="number" min="1" placeholder="Units required" value={form.unitsRequired} onChange={update} required />
        <input name="hospitalName" placeholder="Hospital name" value={form.hospitalName} onChange={update} required />
        <input name="location" placeholder="Location" value={form.location} onChange={update} required />
        <input name="contactNumber" placeholder="Contact number" value={form.contactNumber} onChange={update} required />
        <select name="urgencyLevel" value={form.urgencyLevel} onChange={update}>
          {["Low", "Medium", "High", "Emergency"].map((level) => <option key={level}>{level}</option>)}
        </select>
        <label className="check"><input name="isPublic" type="checkbox" checked={form.isPublic} onChange={update} /> Show publicly</label>
        <button className="btn danger" type="submit">Submit Request</button>
      </form>
    </section>
  );
}

export default RequestBlood;

