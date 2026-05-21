import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import DonorRegister from "./pages/DonorRegister";
import Login from "./pages/Login";
import FindDonors from "./pages/FindDonors";
import RequestBlood from "./pages/RequestBlood";
import PublicRequests from "./pages/PublicRequests";
import BloodBanks from "./pages/BloodBanks";
import DonorDashboard from "./pages/DonorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import Education from "./pages/Education";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<DonorRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find-donors" element={<FindDonors />} />
          <Route path="/request-blood" element={<RequestBlood />} />
          <Route path="/requests" element={<PublicRequests />} />
          <Route path="/blood-banks" element={<BloodBanks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/education" element={<Education />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

