import { useEffect, useState } from "react";
import api from "../api/api";
import BloodBankCard from "../components/BloodBankCard";
import BloodBankMap from "../components/BloodBankMap";

const initialBloodBankLimit = import.meta.env.VITE_BLOOD_BANK_INITIAL_LIMIT || "8";

function BloodBanks() {
  const [location, setLocation] = useState("");
  const [banks, setBanks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const load = async (showAllMatches = false) => {
    const trimmedLocation = location.trim();
    const params = new URLSearchParams();
    if (trimmedLocation) params.set("location", trimmedLocation);
    if (!showAllMatches) params.set("limit", initialBloodBankLimit);

    const { data } = await api.get(`/blood-banks?${params.toString()}`);
    setBanks(data);
    setHasSearched(showAllMatches && Boolean(trimmedLocation));
  };

  useEffect(() => {
    load(false).catch(() => setBanks([]));
  }, []);

  return (
    <section className="page section">
      <h1>Blood Banks</h1>
      <p className="lead">
        {hasSearched ? `Showing all matching blood centers for "${location.trim()}".` : "Showing 8 blood centers. Search a city or district to view all matching results."}
      </p>
      <form className="filters card" onSubmit={(e) => { e.preventDefault(); load(true); }}>
        <input placeholder="Search by city/location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <button className="btn primary" type="submit">Search</button>
        {hasSearched && (
          <button
            className="btn outline"
            type="button"
            onClick={() => {
              setLocation("");
              setHasSearched(false);
              api.get(`/blood-banks?limit=${initialBloodBankLimit}`).then((res) => setBanks(res.data)).catch(() => setBanks([]));
            }}
          >
            Reset
          </button>
        )}
      </form>
      <div className="map-layout">
        <BloodBankMap banks={banks} />
        <div className="bank-list">
          {banks.length ? banks.map((bank) => <BloodBankCard key={bank._id} bank={bank} />) : <p>No blood banks found.</p>}
        </div>
      </div>
    </section>
  );
}

export default BloodBanks;
