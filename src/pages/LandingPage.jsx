import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.15 } },
};

// ---- Easily add more plots in the future by adding to this array ----
const PERFORMANCE_PLOTS = [
  "/plot1.png",
  "/plot2.png",
  "/plot3.png",
];

// ---- Dataset/Database Config ----
const DATASETS = [
  {
    key: "experimental",
    title: "Experimental",
    description: "High-fidelity lab data for training and validating predictive models.",
    icon: "🧪",
    models: ["CNN-GRU_attn"], 
  },
  {
    key: "physics",
    title: "Physics-Based",
    description: "Synthetic data from simulations to enhance model generalization and interpretability.",
    icon: "⚛️",
    models: ["CNN-GRU_attn"],
  },
  {
    key: "bms",
    title: "BMS",
    description: "Real-world operational data enabling robust, deployment-ready predictions.",
    icon: "🔋",
    models: ["CNN-GRU_attn"],
  },
  {
    key: "circular",
    title: "Circular Economy",
    description: "Lifecycle datasets supporting sustainability-aware and end-of-life predictions.",
    icon: "♻️",
    models: ["CNN-GRU_attn"],
  },
];

const features = [
  {
    icon: "⚙️",
    title: "Multiple Configurations",
    desc:  "Choose between different model setups (e.g., 64-in or 48-in cycles) to best fit your forecasting needs.",
  },
  {
    icon: "📊",
    title: "Interactive Visualization",
    desc:  "Zoomable historical SOH, stitched forecast, and real confidence bands rendered beautifully.",
  },
  {
    icon: "🎯",
    title: "Confidence Bands",
    desc:  "Honest uncertainty bands show upper and lower statistical confidence limits for future predictions.",
  },
  {
    icon: "⚡",
    title: "Fast Predictions",
    desc:  "Optimized processing ensures quick results without compromising on analytical accuracy.",
  }
];

export default function LandingPage() {
  const navigate = useNavigate();

  // ---- State for Database Action View ----
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedArchitecture, setSelectedArchitecture] = useState("");

  // ---- Handlers ----
  const handleScrollDown = () => {
    document.getElementById("database-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
  };

  const handleRun = () => {
    if (!file) {
      alert("Please upload a CSV file before continuing.");
      return;
    }
    // Navigate to dashboard and pass the file, architecture, and dataset via state
    navigate("/dashboard", { 
      state: { 
        file: file, 
        architecture: selectedArchitecture,
        dataset: selectedDataset.key
      } 
    });
  };

  // Duplicate array multiple times for a seamless infinite scroll loop
  const carouselItems = [...PERFORMANCE_PLOTS, ...PERFORMANCE_PLOTS, ...PERFORMANCE_PLOTS, ...PERFORMANCE_PLOTS, ...PERFORMANCE_PLOTS];

  return (
    <div className="landing-root">
      <nav className="landing-nav">
        <div 
          className="nav-brand-logos" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "16px" }}
        >
          <img src="/anrf-logo.jpeg" alt="ANRF" style={{ height: "40px" }} />
          <img src="/iit-bhu-logo.jpeg" alt="IIT BHU" style={{ height: "40px" }} />
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-glow" />
        
        {/* Left Side: Text Content */}
        <motion.div
          className="hero-content"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} style={{ marginBottom: "16px" }}>
            <img 
              src="/temobix-logo.png" 
              alt="Te-Mobix" 
              style={{ height: "64px", objectFit: "contain", marginLeft: "-8px", mixBlendMode: "multiply" }} 
            />
          </motion.div>

          <motion.h1 variants={fadeUp} className="hero-title">
            Battery Health <br />
            <span className="hero-accent">Forecaster</span>
          </motion.h1>

          <motion.div variants={fadeUp} className="intro-block">
            <p className="hero-sub">
              <strong>Introduction:</strong> Predict battery health and remaining useful life using historical cycle data. 
              Upload your CSV to instantly analyze degradation trends and pinpoint exact failure thresholds.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <button className="cta-btn" onClick={handleScrollDown}>
              Explore Database
              <span className="cta-arrow">↓</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side: Graphics & Plots Carousel */}
        <motion.div
          className="hero-graphic"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", width: "100%", maxWidth: "540px" }}
        >
          <img 
            src="/bhai-logo.png" 
            alt="BHAI Indicator" 
            style={{ width: "160px", objectFit: "contain", mixBlendMode: "multiply", filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.05))" }} 
          />

          {/* Seamless Infinite Horizontal Carousel */}
          <div className="plots-carousel-wrapper">
            <div className="plots-track">
              {carouselItems.map((plot, idx) => (
                <img key={idx} src={plot} alt={`Performance Plot ${idx}`} className="plot-item" />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 1. PLATFORM FEATURES */}
      <section className="features-section">
        <motion.div className="section-inner" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <motion.h2 variants={fadeUp} className="section-title">Platform Features</motion.h2>
          <motion.div variants={stagger} className="features-grid">
            {features.map(f => (
              <motion.div key={f.title} variants={fadeUp} className="feature-card" whileHover={{ y: -4, boxShadow: "0px 12px 28px rgba(0, 0, 0, 0.08)" }} transition={{ type: "spring", stiffness: 300 }}>
                <div className="feat-icon">{f.icon}</div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 2. OBJECTIVES */}
      <section className="about-section alt-bg">
        <motion.div className="section-inner" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 variants={fadeUp} className="section-title">Objectives</motion.h2>
          <motion.div variants={stagger} className="three-grid">
            {[
              { icon: "🔋", title: "State of Health (SOH)", desc: "Tracks the current and future functional capacity of the battery compared to when it was new." },
              { icon: "📉", title: "Degradation Trend", desc: "Maps the rate at which the battery will deteriorate over future cycles." },
              { icon: "⏳", title: "Remaining Useful Life (RUL)", desc: "Estimates the exact number of cycles left before the battery hits your specified failure threshold." },
            ].map(item => (
              <motion.div key={item.title} variants={fadeUp} className="simple-card">
                <div className="card-icon">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="about-section">
        <motion.div className="section-inner" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 variants={fadeUp} className="section-title">How It Works</motion.h2>
          <motion.div variants={stagger} className="about-steps">
            {[
              { n: "01", label: "Select Dataset",   desc: "Choose from Experimental, BMS, Physics, or Circular datasets." },
              { n: "02", label: "Select Architecture", desc: "Pick the base model (e.g., CNN-GRU_attn)." },
              { n: "03", label: "Set Configuration", desc: "In the dashboard, set parameters like 64-in cycles." },
              { n: "04", label: "View Results",   desc: "Explore charts, confidence bands, and export data." },
            ].map(s => (
              <motion.div key={s.n} variants={fadeUp} className="about-step">
                <div className="step-num">{s.n}</div>
                <h3 className="step-label">{s.label}</h3>
                <p className="step-desc">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 4. DATABASE SECTION */}
      <section className="ecosystem-section alt-bg" id="database-section">
        <div className="section-inner">
          
          {!selectedDataset ? (
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
              <motion.h2 variants={fadeUp} className="section-title">Battery Database</motion.h2>
              <motion.div variants={stagger} className="dataset-grid">
                {DATASETS.map((d) => (
                  <motion.div
                    key={d.key}
                    variants={fadeUp}
                    className="dataset-card"
                    onClick={() => {
                      setSelectedDataset(d);
                      setSelectedArchitecture(d.models[0]);
                      setFile(null);
                    }}
                    whileHover={{ y: -6, boxShadow: "0px 16px 32px rgba(138, 43, 73, 0.12)", borderColor: "#8A2B49" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="dataset-icon">{d.icon}</div>
                    <h2 className="dataset-title">{d.title}</h2>
                    <p className="dataset-desc">{d.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dataset-action-view">
              <button className="back-btn" onClick={() => setSelectedDataset(null)}>
                ← Back to Database
              </button>

              <div className="action-header">
                <span className="action-icon">{selectedDataset.icon}</span>
                <h2 className="action-title">{selectedDataset.title} Dataset</h2>
              </div>
              <p className="action-desc">{selectedDataset.description}</p>

              <div className="action-form">
                <label className="action-label">Upload CSV Data</label>
                <input type="file" accept=".csv" onChange={handleFileChange} className="action-input file-input" />

                <label className="action-label">Select Model Architecture</label>
                <select value={selectedArchitecture} onChange={(e) => setSelectedArchitecture(e.target.value)} className="action-input">
                  {selectedDataset.models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <button onClick={handleRun} className="action-run-btn primary-glow">
                  Proceed to Dashboard →
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="final-cta">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="cta-heading">Ready to forecast your battery life?</h2>
          <button className="cta-btn primary-glow" onClick={handleScrollDown}>
            Get Started Now <span className="cta-arrow">→</span>
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer alt-bg">
        <div className="footer-inner">
          <p className="footer-title">Battery Health Forecaster</p>
          <p className="footer-name">Indian Institute of Technology (BHU), Varanasi</p>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-root {
          min-height: 100vh;
          background: #FFFFFF;
          color: #1A1A1C;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 48px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #EAEAEA;
        }

        .hero-section {
          min-height: 55vh; 
          display: flex; align-items: center; justify-content: center;
          padding: 160px 48px 80px; 
          background: linear-gradient(135deg, #EBE0E4 0%, #FAFAFA 100%); 
          border-bottom: 1px solid rgba(138, 43, 73, 0.1); 
          position: relative; overflow: hidden;
          gap: 60px;
        }
        .hero-bg-glow {
          position: absolute; top: -200px; left: -200px;
          width: 800px; height: 800px; border-radius: 50%;
          background: radial-gradient(circle, rgba(138, 43, 73, 0.05) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-content { max-width: 650px; z-index: 1; }

        .hero-title {
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 700; 
          line-height: 1.1;
          letter-spacing: -1.5px; margin-bottom: 24px;
          color: #2D3748; 
        }
        .hero-accent { 
          color: #8A2B49; 
          border-bottom: 4px solid #8A2B49;
        }
        
        .intro-block {
          margin-bottom: 36px;
          padding-left: 16px;
          border-left: 3px solid #8A2B49;
        }
        .hero-sub {
          font-size: 1.05rem; line-height: 1.7; color: #4A5568;
        }
        .hero-sub strong { color: #2D3748; font-weight: 700; }

        .cta-btn {
          padding: 14px 36px; border-radius: 8px;
          background: #8A2B49;
          color: #FFFFFF; font-size: 1rem; font-weight: 600;
          border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
        }
        .cta-btn:hover { background: #6D223C; box-shadow: 0 6px 16px rgba(138, 43, 73, 0.25); }
        .cta-btn:active { transform: scale(0.98); }
        .cta-arrow { font-size: 1.1rem; }
        
        .hero-graphic { z-index: 1; }

        /* ----- PLOTS CAROUSEL ----- */
        .plots-carousel-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 20px 0;
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: -webkit-linear-gradient(left, transparent, black 15%, black 85%, transparent);
        }
        .plots-track {
          display: flex; gap: 20px; width: max-content;
          animation: scroll-plots 35s linear infinite; 
        }
        .plots-track:hover { animation-play-state: paused; }

        .plot-item {
          height: 240px; border-radius: 12px; box-shadow: 0px 8px 24px rgba(0,0,0,0.1);
          border: 1px solid #EAEAEA; background-color: #FFF; object-fit: cover;
          transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer;
        }
        .plot-item:hover {
          transform: scale(1.08); box-shadow: 0px 16px 40px rgba(138, 43, 73, 0.25); z-index: 10;
        }

        @keyframes scroll-plots {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* SECTIONS GENERAL */
        .ecosystem-section { padding: 90px 48px; background: #FFFFFF; min-height: 45vh;}
        .about-section, .features-section { padding: 90px 48px; background: #FFFFFF; }
        .alt-bg { background: #F8F9FA !important; }
        
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-title { font-size: 2.2rem; font-weight: 700; letter-spacing: -1px; color: #1A1A1C; margin-bottom: 56px; text-align: center; }

        .dataset-grid, .three-grid, .features-grid, .about-steps { display: grid; gap: 24px; }
        .dataset-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        .three-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        .features-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        .about-steps { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }

        .dataset-card, .simple-card, .about-step, .feature-card {
          background: #FFFFFF; border: 1px solid #EAEAEA; border-radius: 12px; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: all 0.2s ease;
        }
        .alt-bg .dataset-card, .alt-bg .simple-card, .alt-bg .about-step, .alt-bg .feature-card {
           box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }

        .dataset-card { padding: 40px 32px; text-align: left; cursor: pointer; border-radius: 16px;}
        .simple-card { padding: 32px 24px; text-align: center; }
        .about-step { padding: 32px 24px; }
        .feature-card { padding: 40px 32px; cursor: default; }

        .dataset-icon { font-size: 3rem; margin-bottom: 20px; }
        .dataset-title { font-size: 1.3rem; font-weight: 700; color: #1A1A1C; margin-bottom: 12px; }
        .dataset-desc { font-size: 0.95rem; color: #666666; line-height: 1.6; }

        .card-icon { font-size: 2.2rem; margin-bottom: 16px; }
        .card-title { font-size: 1.15rem; font-weight: 600; color: #1A1A1C; margin-bottom: 12px; }
        .card-desc { font-size: 0.95rem; color: #666666; line-height: 1.6; }

        .step-num { font-size: 2rem; font-weight: 700; color: #8A2B49; margin-bottom: 16px; font-variant-numeric: tabular-nums; }
        .step-label { font-size: 1.1rem; font-weight: 600; color: #1A1A1C; margin-bottom: 10px; }
        .step-desc { font-size: 0.95rem; color: #666666; line-height: 1.6; }

        .feat-icon { font-size: 2rem; margin-bottom: 20px; opacity: 0.9;}
        .feat-title { font-size: 1.1rem; font-weight: 600; color: #1A1A1C; margin-bottom: 12px; }
        .feat-desc  { font-size: 0.95rem; color: #666666; line-height: 1.6; }

        /* ACTION VIEW (Inside Database Section) */
        .dataset-action-view {
          max-width: 600px; margin: 0 auto; background: #FFFFFF; padding: 48px;
          border-radius: 16px; border: 1px solid #EAEAEA; box-shadow: 0 8px 32px rgba(0,0,0,0.04);
        }
        .back-btn {
          background: none; border: none; color: #8A2B49;
          font-size: 0.95rem; font-weight: 600; cursor: pointer; margin-bottom: 32px; display: inline-block;
        }
        .back-btn:hover { text-decoration: underline; }
        
        .action-header { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
        .action-icon { font-size: 2.2rem; }
        .action-title { font-size: 1.8rem; font-weight: 700; color: #1A1A1C; }
        .action-desc { font-size: 1rem; color: #666666; margin-bottom: 32px; line-height: 1.5;}

        .action-form { display: flex; flex-direction: column; gap: 20px; }
        .action-label { font-size: 0.9rem; font-weight: 600; color: #1A1A1C; margin-bottom: -12px; }
        
        .action-input {
          width: 100%; padding: 14px 16px; border: 1px solid #CCCCCC; border-radius: 8px;
          font-size: 1rem; color: #1A1A1C; background: #FFFFFF; outline: none; transition: border-color 0.2s;
        }
        .action-input:focus { border-color: #8A2B49; box-shadow: 0 0 0 3px rgba(138, 43, 73, 0.1); }
        .file-input { padding: 10px; background: #F8F9FA; cursor: pointer; color: #666666;}
        
        .action-run-btn {
          margin-top: 12px; background: #1A1A1C; color: #FFFFFF; padding: 16px; border-radius: 8px;
          font-weight: 600; font-size: 1.05rem; border: none; cursor: pointer; transition: background 0.2s, transform 0.1s;
        }
        .action-run-btn.primary-glow { background: #8A2B49; box-shadow: 0 4px 16px rgba(138, 43, 73, 0.25); }
        .action-run-btn.primary-glow:hover { background: #6D223C; box-shadow: 0 4px 12px rgba(138, 43, 73, 0.35); }
        .action-run-btn:active { transform: scale(0.98); }

        .final-cta { padding: 80px 48px; background: #FFFFFF; text-align: center; border-top: 1px solid #EAEAEA; }
        .cta-heading { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.5px; color: #1A1A1C; margin-bottom: 24px; }
        .landing-footer { border-top: 1px solid #EAEAEA; padding: 48px; text-align: center; }
        .footer-inner { display: flex; flex-direction: column; gap: 8px; align-items: center; }
        .footer-title { font-size: 0.95rem; font-weight: 600; color: #1A1A1C; }
        .footer-name  { font-size: 0.85rem; color: #8A2B49; font-weight: 600; }

        @media (max-width: 768px) {
          .hero-section  { flex-direction: column; padding: 120px 24px 60px; text-align: center; }
          .hero-graphic  { display: none; }
          .intro-block   { border-left: none; padding-left: 0; }
          .landing-nav   { padding: 12px 24px; }
          .ecosystem-section, .about-section, .features-section { padding: 60px 24px; }
          .dataset-action-view { padding: 32px 20px; }
          .final-cta     { padding: 60px 24px; }
        }
      `}</style>
    </div>
  );
}