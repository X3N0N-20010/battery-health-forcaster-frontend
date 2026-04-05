import { motion } from "framer-motion";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

function KPICard({ icon, label, value, sub, highlight }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`kpi-card${highlight ? " kpi-warn" : ""}`}
      whileHover={{ y: -4, boxShadow: "0px 8px 24px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </motion.div>
  );
}

export default function MetricsCards({ metrics, threshold }) {
  const {
    current_soh, min_forecast_soh, remaining_life,
    degradation_rate, failed, useful_life_pct, n_forecast,
  } = metrics;

  const cards = [
    {
      icon: "📈",
      label: "Last Known SOH",
      value: `${(current_soh * 100).toFixed(2)}%`,
      sub: null,
      highlight: false,
    },
    {
      icon: "🎯",
      label: "Min Forecast SOH",
      value: `${(min_forecast_soh * 100).toFixed(2)}%`,
      sub: `${((min_forecast_soh - threshold) * 100).toFixed(2)}% vs threshold`,
      highlight: min_forecast_soh < threshold,
    },
    {
      icon: "⏳",
      label: "Remaining Useful Life",
      value: remaining_life !== null ? `${remaining_life} cycles` : "Beyond window",
      sub: null,
      highlight: remaining_life !== null && remaining_life < 20,
    },
    {
      icon: "📉",
      label: "Degradation Rate",
      value: `${(degradation_rate * 100).toFixed(4)}%/cycle`,
      sub: `Over ${n_forecast} forecast cycles`,
      highlight: false,
    },
    {
      icon: "⚡",
      label: "Useful Life Used",
      value: `${useful_life_pct}%`,
      sub: "of forecast window",
      highlight: useful_life_pct > 80,
    },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="kpi-grid">
      {cards.map(c => <KPICard key={c.label} {...c} />)}

      <style>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px; /* Generous spacing */
        }
        .kpi-card {
          background: #FFFFFF; /* Light Surface */
          border: 1px solid #EAEAEA; /* Clean edge */
          border-radius: 12px; 
          padding: 24px;
          display: flex; 
          flex-direction: column; 
          gap: 6px;
          cursor: default;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03); /* Diffuse shadow */
        }
        .kpi-card.kpi-warn {
          border-color: rgba(255, 75, 75, 0.3); /* Danger subtle */
          background: rgba(255, 75, 75, 0.05); 
        }
        .kpi-icon { 
          font-size: 1.4rem; 
          opacity: 0.9; 
          margin-bottom: 4px;
        }
        .kpi-value { 
          font-size: 1.6rem; 
          font-weight: 700; 
          color: #1A1A1C; /* Dark Charcoal Text */
          letter-spacing: -0.5px; 
        }
        .kpi-label { 
          font-size: 0.75rem; 
          color: #666666; /* Secondary Text */
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
          font-weight: 600; 
        }
        .kpi-sub { 
          font-size: 0.8rem; 
          color: #888888; /* Tertiary */
          margin-top: 4px;
        }
        .kpi-card.kpi-warn .kpi-value, 
        .kpi-card.kpi-warn .kpi-icon { 
          color: #D32F2F; /* Vibrant Danger Text */
        }
      `}</style>
    </motion.div>
  );
}