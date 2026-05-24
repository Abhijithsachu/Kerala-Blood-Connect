import { useEffect, useState } from "react";
import api from "../api/api";
import DonorCard from "../components/DonorCard";
import RequestCard from "../components/RequestCard";
import { validateBloodRequest } from "../utils/validation";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const buildInitialRequest = (user = {}) => ({
  patientName: "",
  bloodGroupNeeded: "",
  unitsRequired: 1,
  hospitalName: user.name || "",
  location: "",
  contactNumber: user.phone || "",
  urgencyLevel: "High",
  isPublic: true
});

function HospitalDashboard() {
  const [profile, setProfile] = useState(null);
  const [requestForm, setRequestForm] = useState(buildInitialRequest());
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requests, setRequests] = useState([]);
  const [donorFilters, setDonorFilters] = useState({ bloodGroup: "", location: "" });
  const [donors, setDonors] = useState([]);
  const [donorMessage, setDonorMessage] = useState("");

  const load = async () => {
    const [profileRes, requestsRes] = await Promise.all([
      api.get("/auth/profile"),
      api.get("/requests/public")
    ]);
    setProfile(profileRes.data);
    setRequestForm(buildInitialRequest(profileRes.data.user));
    setRequests(requestsRes.data.slice(0, 4));
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const updateRequest = (event) => {
    const { name, value, type, checked } = event.target;
    setRequestForm({ ...requestForm, [name]: type === "checkbox" ? checked : value });
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setRequestError("");
    setRequestMessage("");

    const validationError = validateBloodRequest(requestForm);
    if (validationError) {
      setRequestError(validationError);
      return;
    }

    try {
      const payload = {
        ...requestForm,
        patientName: requestForm.patientName.trim(),
        hospitalName: requestForm.hospitalName.trim(),
        location: requestForm.location.trim(),
        contactNumber: requestForm.contactNumber.trim(),
        unitsRequired: Number(requestForm.unitsRequired)
      };
      await api.post("/requests", payload);
      setRequestMessage("Blood request published successfully.");
      setRequestForm(buildInitialRequest(profile?.user));
      const { data } = await api.get("/requests/public");
      setRequests(data.slice(0, 4));
    } catch (err) {
      setRequestError(err.response?.data?.message || "Could not publish blood request.");
    }
  };

  const searchDonors = async (event) => {
    event.preventDefault();
    setDonorMessage("");
    const params = new URLSearchParams({ availableOnly: "true" });
    if (donorFilters.bloodGroup) params.set("bloodGroup", donorFilters.bloodGroup);
    if (donorFilters.location.trim()) params.set("location", donorFilters.location.trim());

    try {
      const { data } = await api.get(`/donors?${params.toString()}`);
      setDonors(data);
      if (!data.length) setDonorMessage("No available donors matched your search.");
    } catch (err) {
      setDonorMessage(err.response?.data?.message || "Could not load donors.");
    }
  };

  if (!profile) return <section className="section"><p>Loading hospital dashboard...</p></section>;

  const { user } = profile;

  return (
    <section className="page section hospital-dashboard">
      <div className="section-heading">
        <div>
          <h1>Hospital Dashboard</h1>
          <p className="lead">Publish urgent blood requests and contact available donors.</p>
        </div>
      </div>

      <div className="grid three stats hospital-stats">
        <article className="card stat-card">
          <strong>{requests.length}</strong>
          <span>Recent public requests</span>
        </article>
        <article className="card stat-card">
          <strong>{donors.length}</strong>
          <span>Matched donors</span>
        </article>
        <article className="card profile-summary">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.phone}</p>
        </article>
      </div>

      <div className="grid two dashboard-grid dashboard-lower-grid">
        <form className="form card" onSubmit={submitRequest}>
          <h2>Create Blood Request</h2>
          {requestError && <p className="alert">{requestError}</p>}
          {requestMessage && <p className="success">{requestMessage}</p>}
          <input name="patientName" placeholder="Patient name" value={requestForm.patientName} onChange={updateRequest} required />
          <select name="bloodGroupNeeded" value={requestForm.bloodGroupNeeded} onChange={updateRequest} required>
            <option value="">Blood group needed</option>
            {bloodGroups.map((group) => <option key={group}>{group}</option>)}
          </select>
          <input name="unitsRequired" type="number" min="1" placeholder="Units required" value={requestForm.unitsRequired} onChange={updateRequest} required />
          <input name="hospitalName" placeholder="Hospital name" value={requestForm.hospitalName} onChange={updateRequest} required />
          <input name="location" placeholder="Location" value={requestForm.location} onChange={updateRequest} required />
          <input name="contactNumber" placeholder="Contact number" value={requestForm.contactNumber} onChange={updateRequest} required />
          <select name="urgencyLevel" value={requestForm.urgencyLevel} onChange={updateRequest}>
            {["Low", "Medium", "High", "Emergency"].map((level) => <option key={level}>{level}</option>)}
          </select>
          <label className="check"><input name="isPublic" type="checkbox" checked={requestForm.isPublic} onChange={updateRequest} /> Show publicly</label>
          <button className="btn danger" type="submit">Publish Request</button>
        </form>

        <article className="card">
          <h2>Find Available Donors</h2>
          <form className="form compact-form" onSubmit={searchDonors}>
            <select value={donorFilters.bloodGroup} onChange={(e) => setDonorFilters({ ...donorFilters, bloodGroup: e.target.value })}>
              <option value="">All blood groups</option>
              {bloodGroups.map((group) => <option key={group}>{group}</option>)}
            </select>
            <input placeholder="City/location" value={donorFilters.location} onChange={(e) => setDonorFilters({ ...donorFilters, location: e.target.value })} />
            <button className="btn primary" type="submit">Search Donors</button>
          </form>
          {donorMessage && <p className="alert hospital-inline-message">{donorMessage}</p>}
          <div className="hospital-results">
            {donors.map((donor) => <DonorCard key={donor._id} donor={donor} />)}
          </div>
        </article>
      </div>

      <section className="dashboard-grid">
        <div className="section-heading">
          <h2>Recent Public Requests</h2>
        </div>
        <div className="grid two">
          {requests.length ? requests.map((request) => <RequestCard key={request._id} request={request} />) : <p>No public requests found.</p>}
        </div>
      </section>
    </section>
  );
}

export default HospitalDashboard;
