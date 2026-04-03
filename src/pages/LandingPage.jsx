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

const features = [
  {
    icon: "⚙️",
    title: "Multiple Configurations",
    desc:  "Choose between different model setups (e.g., 64 or 48 cycles) to best fit your forecasting needs.",
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

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <div className="landing-root">
      <nav className="landing-nav">
        <span 
          className="nav-brand" 
          onClick={() => navigate("/")} 
          style={{ cursor: "pointer" }}
        >
          ⚡ Battery Health Forecaster
        </span>
        <button className="nav-btn" onClick={() => navigate("/dashboard")}>
          Dashboard →
        </button>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg-glow" />
        <motion.div
          className="hero-content"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="hero-badge">
            <img 
              src="/college_logo.png" 
              alt="Institute Logo" 
              className="institute-logo"
              onError={e => e.target.style.display = 'none'} 
            />
            <div className="badge-text">
              <span className="badge-proj">2nd Year Exploratory Project</span>
              <span className="badge-inst">Indian Institute of Technology (BHU), Varanasi</span>
            </div>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="hero-title">
            Battery Health <br />
            <span className="hero-accent">Forecaster</span>
          </motion.h1>

          {/* Introduction before Get Started */}
          <motion.div variants={fadeUp} className="intro-block">
            <p className="hero-sub">
              <strong>Introduction:</strong> Predict battery health and remaining useful life using historical cycle data. 
              Upload your CSV to instantly analyze degradation trends and pinpoint exact failure thresholds.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <button
              className="cta-btn"
              onClick={() => navigate("/dashboard")}
            >
              Get Started
              <span className="cta-arrow">→</span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-graphic"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          <svg viewBox="0 0 200 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="battery-svg">
            <rect x="60" y="20" width="80" height="16" rx="4" fill="#444449" />
            <rect x="20" y="44" width="160" height="256" rx="12" fill="#303034" stroke="#444449" strokeWidth="4" />
            <rect x="34" y="58" width="132" height="50" rx="6" fill="rgba(124, 152, 182, 0.15)" />
            <rect x="34" y="116" width="132" height="50" rx="6" fill="rgba(124, 152, 182, 0.3)" />
            <rect x="34" y="174" width="132" height="50" rx="6" fill="rgba(124, 152, 182, 0.6)" />
            <rect x="34" y="232" width="132" height="50" rx="6" fill="#7C98B6" />
            <text x="100" y="265" textAnchor="middle" fill="#1A1A1C" fontSize="22" fontWeight="bold">87%</text>
            <text x="100" y="283" textAnchor="middle" fill="#28282B" fontSize="10" fontWeight="600">SOH</text>
          </svg>
        </motion.div>

        {/* Clean & Visible Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          onClick={handleScrollDown}
        >
          <span className="scroll-text">Scroll to explore</span>
          <motion.div 
            className="scroll-arrow"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            ↓
          </motion.div>
        </motion.div>

      </section>

      {/* 2. WHAT THIS PLATFORM DOES */}
      <section className="about-section alt-bg">
        <motion.div className="section-inner" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 variants={fadeUp} className="section-title">What This Platform Does</motion.h2>
          <motion.div variants={stagger} className="three-grid">
            {[
              { icon: "📁", title: "Input", desc: "Upload battery cycle CSV files containing voltage and current data." },
              { icon: "⚙️", title: "Processing", desc: "Analyze cycle behavior and extract critical degradation patterns." },
              { icon: "📈", title: "Output", desc: "Generate precise SOH predictions and future degradation curves." },
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

      {/* 3. WHAT IT PREDICTS */}
      <section className="about-section">
        <motion.div className="section-inner" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 variants={fadeUp} className="section-title">What It Predicts</motion.h2>
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

      {/* 4. HOW IT WORKS */}
      <section className="about-section alt-bg">
        <motion.div className="section-inner" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <motion.h2 variants={fadeUp} className="section-title">How It Works</motion.h2>
          <motion.div variants={stagger} className="about-steps">
            {[
              { n: "01", label: "Upload CSV",     desc: "Provide your cycle data file." },
              { n: "02", label: "Select Model",   desc: "Choose the forecasting configuration." },
              { n: "03", label: "Run Prediction", desc: "Let the engine analyze your cycles." },
              { n: "04", label: "View Results",   desc: "Explore charts, metrics, and raw data." },
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

      {/* 5. PLATFORM FEATURES */}
      <section className="features-section">
        <motion.div className="section-inner" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <motion.h2 variants={fadeUp} className="section-title">Platform Features</motion.h2>
          <motion.div variants={stagger} className="features-grid">
            {features.map(f => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="feature-card"
                whileHover={{ y: -4, boxShadow: "0px 12px 28px rgba(15, 15, 18, 0.3)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feat-icon">{f.icon}</div>
                <h3 className="feat-title">{f.title}</h3>
                <p className="feat-desc">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA SECTION */}
      <section className="final-cta">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="cta-heading">Ready to forecast your battery life?</h2>
          <button className="cta-btn primary-glow" onClick={() => navigate("/dashboard")}>
            Get Started Now <span className="cta-arrow">→</span>
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <p className="footer-title">Battery Health Forecaster</p>
          <p className="footer-sub">Team Members: Priyanshu Kumar & Mayank Singh</p>
          <p className="footer-name">Indian Institute of Technology (BHU), Varanasi</p>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-root {
          min-height: 100vh;
          background: #28282B;
          color: #E4E4E2;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 48px;
          background: rgba(48, 48, 52, 0.75);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        .nav-brand {
          font-size: 1.1rem; font-weight: 600; letter-spacing: -0.2px;
          color: #E4E4E2;
        }
        .nav-btn {
          padding: 8px 20px; border-radius: 6px;
          background: transparent; border: 1px solid #444449;
          color: #E4E4E2; font-size: 0.85rem; font-weight: 500; cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-btn:hover { background: #38383D; border-color: #525258; }

        .hero-section {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 100px 48px 80px;
          position: relative; overflow: hidden;
          gap: 60px;
        }
        .hero-bg-glow {
          position: absolute; top: -200px; left: -200px;
          width: 800px; height: 800px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124, 152, 182, 0.05) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-content { max-width: 650px; z-index: 1; }
        
        .hero-badge {
          display: inline-flex; align-items: center; gap: 16px;
          padding: 10px 18px; border-radius: 8px;
          background: rgba(124, 152, 182, 0.08);
          border: 1px solid rgba(124, 152, 182, 0.2);
          margin-bottom: 32px;
        }
        .institute-logo {
          height: 38px;
          object-fit: contain;
          filter: grayscale(1) opacity(0.9);
        }
        .badge-text {
          display: flex; flex-direction: column; justify-content: center;
        }
        .badge-proj { font-size: 0.7rem; letter-spacing: 0.5px; text-transform: uppercase; color: #A8A8AA; font-weight: 500; margin-bottom: 2px;}
        .badge-inst { font-size: 0.85rem; color: #7C98B6; font-weight: 600; }

        .hero-title {
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 600; line-height: 1.1;
          letter-spacing: -1.5px; margin-bottom: 24px;
          color: #E4E4E2;
        }
        .hero-accent { 
          color: #E4E4E2; 
          border-bottom: 3px solid #7C98B6;
        }
        
        .intro-block {
          margin-bottom: 36px;
          padding-left: 16px;
          border-left: 3px solid #444449;
        }
        .hero-sub {
          font-size: 1.05rem; line-height: 1.7; color: #A8A8AA;
        }
        .hero-sub strong { color: #E4E4E2; font-weight: 600; }

        .cta-btn {
          padding: 14px 36px; border-radius: 8px;
          background: #7C98B6;
          color: #1A1A1C; font-size: 1rem; font-weight: 600;
          border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: background 0.2s, transform 0.1s;
        }
        .cta-btn:hover { background: #8BA8C7; }
        .cta-btn:active { background: #6E88A3; transform: scale(0.98); }
        .cta-arrow { font-size: 1.1rem; }
        
        .hero-graphic { z-index: 1; }
        .battery-svg { width: 160px; filter: drop-shadow(0px 8px 24px rgba(15, 15, 18, 0.3)); }

        /* SIMPLE SCROLL INDICATOR */
        .scroll-indicator {
          position: absolute;
          bottom: 15%; /* Raised up into the middle void */
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          z-index: 10;
          opacity: 0.85;
          transition: opacity 0.3s ease;
        }
        .scroll-indicator:hover {
          opacity: 1;
        }
        .scroll-text {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
          color: #FFFFFF;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
        .scroll-arrow {
          font-size: 1.6rem;
          color: #7C98B6;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        .about-section, .features-section { padding: 90px 48px; }
        .about-section { background: #28282B; }
        .about-section.alt-bg { background: #303034; }
        
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-title {
          font-size: 2rem; font-weight: 600; letter-spacing: -1px;
          color: #E4E4E2; margin-bottom: 56px; text-align: center;
        }

        .three-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .simple-card {
          background: #28282B;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px; 
          padding: 32px 24px;
          text-align: center;
        }
        .alt-bg .simple-card { background: #303034; border-color: rgba(255, 255, 255, 0.05); }
        .card-icon { font-size: 2.2rem; margin-bottom: 16px; }
        .card-title { font-size: 1.15rem; font-weight: 600; color: #E4E4E2; margin-bottom: 12px; }
        .card-desc { font-size: 0.95rem; color: #A8A8AA; line-height: 1.6; }

        .about-steps {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
        }
        .about-step {
          background: #28282B;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px; 
          padding: 32px 24px;
        }
        .step-num {
          font-size: 2rem; font-weight: 700; color: #444449;
          margin-bottom: 16px; font-variant-numeric: tabular-nums;
        }
        .step-label {
          font-size: 1.1rem; font-weight: 600; color: #E4E4E2;
          margin-bottom: 10px;
        }
        .step-desc { font-size: 0.95rem; color: #A8A8AA; line-height: 1.6; }

        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        .feature-card {
          background: #303034;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 40px 32px;
          cursor: default;
          box-shadow: 0px 8px 24px rgba(15, 15, 18, 0.2);
        }
        .feat-icon { font-size: 2rem; margin-bottom: 20px; opacity: 0.9;}
        .feat-title { font-size: 1.1rem; font-weight: 600; color: #E4E4E2; margin-bottom: 12px; }
        .feat-desc  { font-size: 0.95rem; color: #A8A8AA; line-height: 1.6; }

        .final-cta {
          padding: 80px 48px;
          background: #303034;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }
        .cta-heading {
          font-size: 1.8rem; font-weight: 600; letter-spacing: -0.5px;
          color: #E4E4E2; margin-bottom: 24px;
        }
        .primary-glow {
          box-shadow: 0 0 24px rgba(124, 152, 182, 0.2);
        }

        .landing-footer {
          background: #28282B;
          border-top: 1px solid #444449;
          padding: 48px;
          text-align: center;
        }
        .footer-inner { display: flex; flex-direction: column; gap: 8px; align-items: center; }
        .footer-title { font-size: 0.95rem; font-weight: 600; color: #E4E4E2; }
        .footer-sub   { font-size: 0.85rem; color: #A8A8AA; }
        .footer-name  { font-size: 0.85rem; color: #7C98B6; font-weight: 500; }

        @media (max-width: 768px) {
          .hero-section  { flex-direction: column; padding: 100px 24px 60px; text-align: center; }
          .hero-graphic  { display: none; }
          .hero-badge    { flex-direction: column; text-align: center; }
          .institute-logo{ margin: 0 0 12px 0; }
          .intro-block   { border-left: none; padding-left: 0; }
          .landing-nav   { padding: 16px 24px; }
          .about-section,.features-section { padding: 70px 24px; }
          .final-cta     { padding: 60px 24px; }
          .scroll-indicator { display: none; }
        }
      `}</style>
    </div>
  );
}