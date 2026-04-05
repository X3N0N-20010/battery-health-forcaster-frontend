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
        <div className="nb-left">
          <img
            src="/college_logo.png"
            alt="College Logo"
            className="nb-logo"
            onError={e => { e.target.style.display = "none"; }}
          />
          <span 
            className="nb-brand" 
            onClick={() => navigate("/")} 
            style={{ cursor: "pointer" }}
          >
            ⚡ Battery Health Forecaster
          </span>
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
          background: #FF4B4B;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        
        .nb-left { display: flex; align-items: center; gap: 12px; }
        .nb-logo { height: 32px; filter: brightness(0) invert(1); object-fit: contain; }
        
        .nb-brand { 
          font-size: 1.1rem; 
          font-weight: 700; 
          color: #FFFFFF;
          letter-spacing: -0.2px; 
        }
        
        .nb-links { display: flex; gap: 6px; }
        
        .nb-link {
          padding: 8px 16px; 
          border-radius: 6px;
          background: transparent; 
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem; 
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .nb-link:hover { 
          color: #FF4B4B; 
          background: #FFFFFF;
        }
        
        .nb-link.active { 
          color: #FF4B4B;
          background: #FFFFFF; 
        }
      `}</style>
    </>
  );
}