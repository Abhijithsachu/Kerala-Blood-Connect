import { useEffect, useState } from "react";
import api from "../api/api";
import { validateBloodBank, validateSiteSettings } from "../utils/validation";

const tabs = ["Dashboard", "Donors", "Blood Requests", "Users", "Blood Banks", "Contact Messages", "Reports", "Settings"];
const initialSettings = { emergencyPhone: "", whatsappNumber: "", email: "", address: "", emergencyNote: "" };

function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [stats, setStats] = useState({});
  const [data, setData] = useState({ users: [], donors: [], requests: [], bloodBanks: [], contacts: [], reports: [] });
  const [bankForm, setBankForm] = useState({ name: "", address: "", city: "", phone: "", openingHours: "", latitude: "", longitude: "" });
  const [bankError, setBankError] = useState("");
  const [settingsForm, setSettingsForm] = useState(initialSettings);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsError, setSettingsError] = useState("");

  const load = async () => {
    const [statsRes, collectionsRes] = await Promise.all([api.get("/admin/stats"), api.get("/admin/collections")]);
    setStats(statsRes.data);
    setData(collectionsRes.data);
  };

  const loadSettings = async () => {
    const { data: settings } = await api.get("/admin/settings");
    setSettingsForm({ ...initialSettings, ...settings });
  };

  useEffect(() => {
    load().catch(() => {});
    loadSettings().catch(() => {});
  }, []);

  const blockUser = async (id, isBlocked) => {
    await api.patch(`/admin/users/${id}/block`, { isBlocked: !isBlocked });
    load();
  };

  const blockDonor = async (id, isBlocked) => {
    await api.patch(`/admin/donors/${id}/block`, { isBlocked: !isBlocked });
    load();
  };

  const blockRequest = async (id, isBlocked) => {
    await api.patch(`/admin/requests/${id}/block`, { isBlocked: !isBlocked });
    load();
  };

  const deleteDonor = async (id) => {
    if (window.confirm("Delete this donor?")) {
      await api.delete(`/donors/${id}`);
      load();
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm("Delete this request?")) {
      await api.delete(`/requests/${id}`);
      load();
    }
  };

  const markCompleted = async (id) => {
    await api.patch(`/requests/${id}/status`, { status: "Completed" });
    load();
  };

  const saveBank = async (event) => {
    event.preventDefault();
    setBankError("");
    const validationError = validateBloodBank(bankForm);
    if (validationError) {
      setBankError(validationError);
      return;
    }
    const payload = { ...bankForm, latitude: Number(bankForm.latitude) || undefined, longitude: Number(bankForm.longitude) || undefined };
    if (bankForm._id) {
      await api.put(`/blood-banks/${bankForm._id}`, payload);
    } else {
      await api.post("/blood-banks", payload);
    }
    setBankForm({ name: "", address: "", city: "", phone: "", openingHours: "", latitude: "", longitude: "" });
    load();
  };

  const deleteBank = async (id) => {
    if (window.confirm("Delete this blood bank?")) {
      await api.delete(`/blood-banks/${id}`);
      load();
    }
  };

  const updateReport = async (id, status) => {
    await api.patch(`/reports/${id}/status`, { status });
    load();
  };

  const updateSettings = (event) => {
    setSettingsForm({ ...settingsForm, [event.target.name]: event.target.value });
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setSettingsError("");
    setSettingsMessage("");
    const validationError = validateSiteSettings(settingsForm);
    if (validationError) {
      setSettingsError(validationError);
      return;
    }
    try {
      const payload = Object.fromEntries(Object.entries(settingsForm).map(([key, value]) => [key, value.trim()]));
      const { data: savedSettings } = await api.patch("/admin/settings", payload);
      setSettingsForm({ ...initialSettings, ...savedSettings });
      setSettingsMessage("Settings saved successfully.");
    } catch (err) {
      setSettingsError(err.response?.data?.message || "Could not save settings.");
    }
  };

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <h2>Kerala Blood Connect Admin</h2>
        {tabs.map((tab) => (
          <button key={tab} className={active === tab ? "active" : ""} onClick={() => setActive(tab)}>
            {tab}
          </button>
        ))}
      </aside>
      <div className="admin-content">
        {active === "Dashboard" && (
          <>
            <h1>Dashboard</h1>
            <div className="grid three">
              <Stat label="Total donors" value={stats.totalDonors} />
              <Stat label="Available donors" value={stats.availableDonors} />
              <Stat label="Total blood requests" value={stats.totalBloodRequests} />
              <Stat label="Emergency requests" value={stats.emergencyRequests} />
              <Stat label="Blocked users" value={stats.blockedUsers} />
              <Stat label="Reports" value={stats.reports} />
            </div>
          </>
        )}

        {active === "Donors" && (
          <Table title="Donor Management" headers={["Name", "Blood", "Location", "Available", "Blocked", "Actions"]}>
            {data.donors.map((donor) => (
              <tr key={donor._id}>
                <td>{donor.name}</td><td>{donor.bloodGroup}</td><td>{donor.location}</td><td>{donor.availabilityStatus ? "Yes" : "No"}</td><td>{donor.isBlocked ? "Yes" : "No"}</td>
                <td><button onClick={() => blockDonor(donor._id, donor.isBlocked)}>{donor.isBlocked ? "Unblock" : "Block"}</button><button onClick={() => deleteDonor(donor._id)}>Delete</button></td>
              </tr>
            ))}
          </Table>
        )}

        {active === "Blood Requests" && (
          <Table title="Blood Request Management" headers={["Patient", "Blood", "Hospital", "Urgency", "Status", "Actions"]}>
            {data.requests.map((request) => (
              <tr key={request._id}>
                <td>{request.patientName}</td><td>{request.bloodGroupNeeded}</td><td>{request.hospitalName}</td><td>{request.urgencyLevel}</td><td>{request.status}</td>
                <td><button onClick={() => markCompleted(request._id)}>Complete</button><button onClick={() => blockRequest(request._id, request.isBlocked)}>{request.isBlocked ? "Unblock" : "Block"}</button><button onClick={() => deleteRequest(request._id)}>Delete</button></td>
              </tr>
            ))}
          </Table>
        )}

        {active === "Users" && (
          <Table title="User Management" headers={["Name", "Email", "Role", "Blocked", "Actions"]}>
            {data.users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.isBlocked ? "Yes" : "No"}</td>
                <td><button onClick={() => blockUser(user._id, user.isBlocked)}>{user.isBlocked ? "Unblock" : "Block"}</button></td>
              </tr>
            ))}
          </Table>
        )}

        {active === "Blood Banks" && (
          <>
            <h1>Blood Bank Management</h1>
            <form className="form card admin-form" onSubmit={saveBank}>
              {bankError && <p className="alert admin-form-message">{bankError}</p>}
              <input placeholder="Name" value={bankForm.name} onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })} required />
              <input placeholder="Address" value={bankForm.address} onChange={(e) => setBankForm({ ...bankForm, address: e.target.value })} required />
              <input placeholder="City" value={bankForm.city} onChange={(e) => setBankForm({ ...bankForm, city: e.target.value })} required />
              <input placeholder="Phone" value={bankForm.phone} onChange={(e) => setBankForm({ ...bankForm, phone: e.target.value })} required />
              <input placeholder="Opening hours" value={bankForm.openingHours} onChange={(e) => setBankForm({ ...bankForm, openingHours: e.target.value })} required />
              <input placeholder="Latitude" value={bankForm.latitude} onChange={(e) => setBankForm({ ...bankForm, latitude: e.target.value })} />
              <input placeholder="Longitude" value={bankForm.longitude} onChange={(e) => setBankForm({ ...bankForm, longitude: e.target.value })} />
              <button className="btn primary" type="submit">{bankForm._id ? "Update Bank" : "Add Bank"}</button>
            </form>
            <Table title="Blood Banks" headers={["Name", "City", "Phone", "Source", "Actions"]}>
              {data.bloodBanks.map((bank) => (
                <tr key={bank._id}>
                  <td>{bank.name}</td><td>{bank.city}</td><td>{bank.phone}</td><td>{bank.isStatic ? "Static" : "Admin"}</td>
                  <td>
                    {bank.isStatic ? (
                      <span>Static</span>
                    ) : (
                      <>
                        <button onClick={() => setBankForm(bank)}>Edit</button>
                        <button onClick={() => deleteBank(bank._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </Table>
          </>
        )}

        {active === "Contact Messages" && (
          <Table title="Contact Messages" headers={["Name", "Email", "Phone", "Message", "Status"]}>
            {data.contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td><td>{contact.email}</td><td>{contact.phone}</td><td>{contact.message}</td><td>{contact.status}</td>
              </tr>
            ))}
          </Table>
        )}

        {active === "Reports" && (
          <Table title="Reports" headers={["Type", "Reason", "Status", "Actions"]}>
            {data.reports.map((report) => (
              <tr key={report._id}>
                <td>{report.reportedType}</td><td>{report.reason}</td><td>{report.status}</td>
                <td><button onClick={() => updateReport(report._id, "Reviewed")}>Reviewed</button><button onClick={() => updateReport(report._id, "Dismissed")}>Dismiss</button></td>
              </tr>
            ))}
          </Table>
        )}

        {active === "Settings" && (
          <div>
            <h1>Settings</h1>
            <form className="form card admin-settings-form" onSubmit={saveSettings}>
              {settingsError && <p className="alert admin-form-message">{settingsError}</p>}
              {settingsMessage && <p className="success admin-form-message">{settingsMessage}</p>}
              <label>
                Emergency phone
                <input name="emergencyPhone" placeholder="9876543210" value={settingsForm.emergencyPhone} onChange={updateSettings} />
              </label>
              <label>
                WhatsApp number
                <input name="whatsappNumber" placeholder="9876543210" value={settingsForm.whatsappNumber} onChange={updateSettings} />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="help@example.com" value={settingsForm.email} onChange={updateSettings} />
              </label>
              <label>
                Address
                <input name="address" placeholder="Kerala Blood Connect office address" value={settingsForm.address} onChange={updateSettings} />
              </label>
              <label className="admin-settings-wide">
                Emergency note
                <textarea name="emergencyNote" placeholder="Call 108 or your nearest hospital immediately." value={settingsForm.emergencyNote} onChange={updateSettings} />
              </label>
              <button className="btn primary admin-settings-wide" type="submit">Save Settings</button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value = 0 }) {
  return <article className="card stat-card"><strong>{value}</strong><span>{label}</span></article>;
}

function Table({ title, headers, children }) {
  return (
    <div className="table-wrap card">
      <h1>{title}</h1>
      <table>
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
