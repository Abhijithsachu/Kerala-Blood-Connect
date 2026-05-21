import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaRightFromBracket, FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { getUser, logout } from "../api/api";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const links = [
    ["/", t("home")],
    ["/about", t("about")],
    ["/find-donors", t("findDonors")],
    ["/request-blood", t("requestBlood")],
    ["/blood-banks", t("bloodBanks")],
    ["/contact", t("contact")]
  ];

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <img src="/kerala-blood-connect-logo.png" alt="Kerala Blood Connect logo" />
        <span>Kerala Blood Connect</span>
      </Link>
      <button className="icon-btn mobile-only" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? <FaXmark /> : <FaBars />}
      </button>
      <nav className={open ? "nav-links show" : "nav-links"}>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}
        <LanguageSwitcher />
        <Link className="btn danger small" to="/requests" onClick={() => setOpen(false)}>
          {t("emergency")}
        </Link>
        {user ? (
          <>
            <Link className="btn outline small" to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <button className="icon-btn" onClick={handleLogout} aria-label="Logout">
              <FaRightFromBracket />
            </button>
          </>
        ) : (
          <Link className="btn primary small" to="/login" onClick={() => setOpen(false)}>
            {t("login")}
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
