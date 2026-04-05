import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "About",     path: "/" },
  ];

  return (
    <>
      <nav className="navbar">
        <div 
          className="nb-left" 
          onClick={() => navigate("/")} 
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "16px" }}
        >
          <img src="/anrf-logo.jpeg" alt="ANRF" style={{ height: "36px" }} />
          <img src="/iit-bhu-logo.jpeg" alt="IIT BHU" style={{ height: "36px" }} />
        </div>
        <div className="nb-links">
          {links.map(l => (
            <button
              key={l.path}
              className={`nb-link${location.pathname === l.path ? " active" : ""}`}
              onClick={() => navigate(l.path)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </nav>

      <style>{`
        .navbar {
          position: sticky; 
          top: 0; 
          z-index: 200;
          display: flex; 
          align-items: center; 
          justify-content: space-between;
          padding: 0 40px; 
          height: 64px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #EAEAEA;
          box-shadow: 0 2px 12px rgba(0,0,0,0.02);
        }
        
        .nb-links { display: flex; gap: 6px; }
        
        .nb-link {
          padding: 8px 16px; 
          border-radius: 6px;
          background: transparent; 
          border: none;
          color: #4A5568; /* Slate gray text */
          font-size: 0.9rem; 
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .nb-link:hover { 
          color: #8A2B49; 
          background: #F9F0F3;
        }
        
        .nb-link.active { 
          color: #8A2B49;
          background: #F9F0F3; 
        }
      `}</style>
    </>
  );
}