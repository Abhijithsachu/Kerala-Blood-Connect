import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api";
import DonorCard from "../components/DonorCard";

function FindDonors() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get("bloodGroup") || "",
    location: searchParams.get("location") || "",
    availableOnly: false
  });
  const [donors, setDonors] = useState([]);

  const load = async () => {
    const params = new URLSearchParams({
      ...filters,
      availableOnly: String(filters.availableOnly)
    });
    const { data } = await api.get(`/donors?${params}`);
    setDonors(data);
  };

  useEffect(() => {
    load().catch(() => setDonors([]));
  }, []);

  const submit = (event) => {
    event.preventDefault();
    load();
  };

  return (
    <section className="page section">
      <h1>Find Donors</h1>
      <form className="filters card" onSubmit={submit}>
        <select value={filters.bloodGroup} onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}>
          <option value="">All blood groups</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}
        </select>
        <input placeholder="City/location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <label className="check"><input type="checkbox" checked={filters.availableOnly} onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })} /> Available only</label>
        <button className="btn primary" type="submit">Search</button>
      </form>
      <div className="grid three donor-grid">
        {donors.length ? donors.map((donor) => <DonorCard key={donor._id} donor={donor} />) : <p>No donors found.</p>}
      </div>
    </section>
  );
}

export default FindDonors;
