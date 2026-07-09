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
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "24px" }}
        >
          <img src="/anrf-logo.jpeg" alt="ANRF" style={{ height: "72px" }} />
          <img src="/iit-bhu-logo.jpeg" alt="IIT BHU" style={{ height: "72px" }} />
        </div>
        
        <div className="nb-right" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
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

          {/* BHAI Logo - Top Right Shortcut to Dataset */}
          <div 
            className="nav-bhai-logo"
            onClick={() => {
              navigate("/");
              // Tiny delay to ensure page loads before scrolling
              setTimeout(() => {
                document.getElementById("database-section")?.scrollIntoView({ behavior: "smooth" });
              }, 150);
            }}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            title="Jump to Datasets"
          >
            <img 
              src="/bhai-logo.png" 
              alt="BHAI Indicator" 
              style={{ 
                height: "64px", 
                objectFit: "contain", 
                mixBlendMode: "multiply",
                transition: "transform 0.2s ease",
              }} 
              onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            />
          </div>
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
          padding: 12px 40px; 
          min-height: 80px;
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
          color: #4A5568; 
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