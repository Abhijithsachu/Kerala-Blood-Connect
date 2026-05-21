import { useEffect, useState } from "react";
import api from "../api/api";
import RequestCard from "../components/RequestCard";

function PublicRequests() {
  const [filters, setFilters] = useState({ bloodGroup: "", location: "", urgencyLevel: "" });
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const params = new URLSearchParams(filters);
    const { data } = await api.get(`/requests/public?${params}`);
    setRequests(data);
  };

  useEffect(() => {
    load().catch(() => setRequests([]));
  }, []);

  return (
    <section className="page section">
      <h1>Public Blood Requests</h1>
      <form className="filters card" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <select value={filters.bloodGroup} onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}>
          <option value="">All groups</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}
        </select>
        <input placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select value={filters.urgencyLevel} onChange={(e) => setFilters({ ...filters, urgencyLevel: e.target.value })}>
          <option value="">All urgency</option>
          {["Low", "Medium", "High", "Emergency"].map((level) => <option key={level}>{level}</option>)}
        </select>
        <button className="btn primary" type="submit">Filter</button>
      </form>
      <div className="grid three">
        {requests.length ? requests.map((request) => <RequestCard key={request._id} request={request} />) : <p>No public requests found.</p>}
      </div>
    </section>
  );
}

export default PublicRequests;

