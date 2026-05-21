import { useEffect, useState } from "react";
import api, { saveSession } from "../api/api";

function DonorDashboard() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await api.get("/auth/profile");
    setProfile(data);
    saveSession({
      token: localStorage.getItem("keralaBloodConnectToken") || localStorage.getItem("lifedropToken"),
      user: data.user,
      donor: data.donor
    });
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const toggleAvailability = async () => {
    const donor = profile.donor;
    const { data } = await api.patch(`/donors/${donor._id}/availability`, {
      availabilityStatus: !donor.availabilityStatus
    });
    setProfile({ ...profile, donor: data });
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const { data } = await api.put("/auth/profile", payload);
    setProfile(data);
    setMessage("Profile updated.");
  };

  if (!profile) return <section className="section"><p>Loading dashboard...</p></section>;
  const { user, donor } = profile;
  const history = donor?.donationHistory?.slice(-5).reverse() || [];

  return (
    <section className="page section">
      <h1>Donor Dashboard</h1>
      <div className="grid two">
        <article className="card profile-summary">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{donor?.bloodGroup} donor in {donor?.location}</p>
          <p className={donor?.availabilityStatus ? "status available" : "status unavailable"}>
            {donor?.availabilityStatus ? "Available" : "Unavailable"}
          </p>
          <button className="btn primary" onClick={toggleAvailability}>Toggle Availability</button>
        </article>
        <article className="card">
          <h2>Badge / Certificate</h2>
          <div className="certificate">
            <strong>{donor?.badge || "Life Saver"}</strong>
            <span>Thank you for being part of Kerala Blood Connect.</span>
          </div>
        </article>
      </div>

      <div className="grid two">
        <article className="card">
          <h2>Last 5 Donations</h2>
          {history.length ? history.map((item, index) => (
            <p key={`${item.date}-${index}`}>{new Date(item.date).toLocaleDateString()} - {item.hospital || "Donation record"}</p>
          )) : <p>No donation records yet.</p>}
        </article>
        <form className="form card" onSubmit={updateProfile}>
          <h2>Edit Profile</h2>
          {message && <p className="success">{message}</p>}
          <input name="name" defaultValue={user.name} placeholder="Name" />
          <input name="phone" defaultValue={user.phone} placeholder="Phone" />
          <input name="location" defaultValue={donor?.location} placeholder="Location" />
          <input name="age" type="number" defaultValue={donor?.age} placeholder="Age" />
          <label>Last donation date<input name="lastDonationDate" type="date" defaultValue={donor?.lastDonationDate?.slice(0, 10) || ""} /></label>
          <input type="password" placeholder="Change password coming soon" disabled />
          <button className="btn primary" type="submit">Save Profile</button>
        </form>
      </div>
    </section>
  );
}

export default DonorDashboard;
