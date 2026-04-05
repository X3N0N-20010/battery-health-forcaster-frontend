import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import MetricsCards from "../components/MetricsCards";
import ForecastChart from "../components/ForecastChart";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function StatusBanner({ metrics, threshold }) {
  if (!metrics) return null;
  const { failed, remaining_life, min_forecast_soh, n_forecast } = metrics;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`status-banner ${failed ? "status-fail" : "status-ok"}`}
    >
      <div className="status-icon">{failed ? "⚠️" : "✅"}</div>
      <div>
        <div className="status-title">
          {failed
            ? `WARNING — Battery expected to FAIL within forecast window`
            : `STATUS NORMAL — No failure expected in forecast window`}
        </div>
        <div className="status-sub">
          {failed
            ? `Predicted SOH crosses the ${(threshold * 100).toFixed(0)}% threshold in ${remaining_life} cycles. Min forecast SOH: ${(min_forecast_soh * 100).toFixed(3)}%.`
            : `All ${n_forecast} predicted cycles remain above ${(threshold * 100).toFixed(0)}%. Min forecast SOH: ${(min_forecast_soh * 100).toFixed(3)}%.`}
        </div>
      </div>
    </motion.div>
  );
}

function RawDataTab({ data, threshold }) {
  if (!data) return null;
  const { historical_soh, forecast_soh, cycles } = data;
  const n_hist = historical_soh.length;

  const rows = cycles
    .map((cycle, i) => ({
      cycle,
      region:    i < n_hist ? "Historical" : "Forecast",
      predicted: forecast_soh[i],
      observed:  i < n_hist ? historical_soh[i] : null,
      below:     forecast_soh[i] !== null && forecast_soh[i] < threshold,
    }))
    .filter(r => r.predicted !== null && r.predicted !== undefined);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Cycle</th>
            <th>Region</th>
            <th>Predicted SOH</th>
            <th>Observed SOH</th>
            <th>Below Threshold</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.cycle} className={r.below ? "row-warn" : ""}>
              <td>{r.cycle}</td>
              <td><span className={`badge ${r.region === "Historical" ? "badge-neutral" : "badge-outline"}`}>{r.region}</span></td>
              <td>{r.predicted.toFixed(5)}</td>
              <td>{r.observed !== null ? r.observed.toFixed(5) : "—"}</td>
              <td>{r.below ? <span className="badge badge-danger">Yes</span> : <span style={{ color: "#888888" }}>No</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExportTab({ data, threshold, metrics }) {
  if (!data) return null;
  const { historical_soh, forecast_soh, confidence_upper, confidence_lower, cycles } = data;
  const n_hist = historical_soh.length;

  const handleDownloadCSV = () => {
    const rows = ["future_cycle_offset,absolute_cycle,predicted_soh,lower_1sigma,upper_1sigma,below_threshold"];
    cycles.slice(n_hist).forEach((cycle, i) => {
      const absI = n_hist + i;
      const pred = forecast_soh[absI];
      if (pred !== null && pred !== undefined) {
        rows.push([
          i + 1,
          cycle,
          pred.toFixed(6),
          confidence_lower[absI]?.toFixed(6) ?? "",
          confidence_upper[absI]?.toFixed(6) ?? "",
          pred < threshold,
        ].join(","));
      }
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "soh_forecast.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = () => {
    const report = [
      "Battery SOH Forecast Report",
      "===========================",
      `Failure threshold : ${(threshold * 100).toFixed(0)}%`,
      `Observed cycles   : ${n_hist}`,
      `Forecast cycles   : ${metrics.n_forecast}`,
      `Last known SOH    : ${(metrics.current_soh).toFixed(4)}`,
      `Forecast min SOH  : ${(metrics.min_forecast_soh).toFixed(4)}`,
      `Degradation rate  : ${(metrics.degradation_rate).toFixed(6)}/cycle`,
      `Failure detected  : ${metrics.failed ? "YES" : "NO"}`,
      `RUL (cycles)      : ${metrics.remaining_life ?? "N/A (beyond window)"}`,
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "soh_forecast_report.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button className="export-btn" onClick={handleDownloadCSV}>⬇ Download Forecast CSV</button>
      <button className="export-btn ghost" onClick={handleDownloadReport}>⬇ Download Report .txt</button>
    </div>
  );
}

function FileUploadZone({ onFile, file }) {
  const ref      = useRef();
  const [drag, setDrag] = useState(false);

  const handleDrop = useCallback(e => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) onFile(f);
  }, [onFile]);

  return (
    <div
      className={`upload-zone${drag ? " drag-over" : ""}`}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => ref.current.click()}
    >
      <input
        ref={ref} type="file" accept=".csv" style={{ display: "none" }}
        onChange={e => e.target.files[0] && onFile(e.target.files[0])}
      />
      <div className="upload-icon">📁</div>
      {file
        ? <p className="upload-filename">{file.name}</p>
        : <p className="upload-hint">Drop your CSV here or <span className="upload-link">browse</span></p>}
      <p className="upload-sub">Supports standard battery cycling CSV files</p>
    </div>
  );
}

function QuickGuide({ architecture }) {
  return (
    <div className="dash-section guide-panel">
      <div className="guide-header">
        <span className="guide-icon">📖</span>
        <h2 className="section-heading" style={{ marginBottom: 0 }}>Quick Start Guide ({architecture})</h2>
      </div>
      
      <div className="guide-grid">
        
        {/* Requirements */}
        <div className="guide-card">
          <h4 className="guide-title">1. Feature Requirements</h4>
          <div className="guide-reqs">
            <p><strong>Waveform Cols:</strong> <code>current(a)</code>, <code>voltage(v)</code>, <code>dv/dt(v/s)</code>, <code>internal_resistance(ohm)</code>, <code>cycle_elapsed_time_sec</code></p>
            <p><strong>Auxiliary Cols:</strong> <code>global_cycle</code>, <code>discharge_time</code>, <code>discharge_energy_cycle</code>, <code>avg_voltage_discharge</code></p>
            <p><strong>Target Col:</strong> <code>soh_clean</code> <span className="text-muted">(or <code>soh</code>)</span></p>
          </div>
        </div>

        {/* Usage Steps */}
        <div className="guide-card">
          <h4 className="guide-title">2. Usage Steps</h4>
          <ul className="guide-steps">
            <li><span className="step-badge">1</span><div><strong>Upload CSV:</strong> Drop your cycle data file below.</div></li>
            <li><span className="step-badge">2</span><div><strong>Set Config:</strong> Choose window size (e.g., 64-in).</div></li>
            <li><span className="step-badge">3</span><div><strong>Run Predict:</strong> Click the forecast button to process.</div></li>
            <li><span className="step-badge">4</span><div><strong>View Results:</strong> Explore graphs, KPIs, and export data.</div></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();

  // Architecture passed from Landing Page, defaults to CNN-GRU_attn
  const architecture = location.state?.architecture || "CNN-GRU_attn";

  const [file,          setFile]          = useState(location.state?.file || null);
  const [preview,       setPreview]       = useState(null);
  const [threshold,     setThreshold]     = useState(0.80);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [result,        setResult]        = useState(null);
  const [activeTab,     setActiveTab]     = useState("forecast");
  const [configs,       setConfigs]       = useState([]);
  const [selectedConfig, setSelectedConfig] = useState("");

  const handleFile = useCallback(f => {
    setFile(f); setResult(null); setError(null);
    const reader = new FileReader();
    reader.onload = e => {
      const lines = e.target.result.split("\n").slice(0, 6);
      setPreview(lines.map(l => l.split(",")));
    };
    reader.readAsText(f);
  }, []);

  // Read initial file if passed from Landing Page
  useEffect(() => {
    if (location.state?.file && !preview) {
      handleFile(location.state.file);
    }
  }, [location.state, handleFile, preview]);

  // Fetch Configurations (Previously 'Models')
  useEffect(() => {
    fetch(`${API_BASE}/api/models`)
      .then(res => res.json())
      .then(data => {
        if (data.models && data.models.length > 0) {
          setConfigs(data.models);
          setSelectedConfig(data.models[0]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch config list. Using defaults.", err);
        // Fallback configurations just in case the backend is down
        const fallbacks = ["64-in", "48-in"];
        setConfigs(fallbacks);
        setSelectedConfig(fallbacks[0]);
      });
  }, []);

  const handleRun = async () => {
    if (!file || !selectedConfig) return;
    setLoading(true); setError(null); setResult(null);

    const form = new FormData();
    form.append("file", file);
    // IMPORTANT: Send both Architecture AND Configuration to backend
    form.append("architecture", architecture);
    form.append("config_name", selectedConfig); 
    form.append("threshold", threshold);

    try {
      const res  = await fetch(`${API_BASE}/api/forecast`, { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Inference failed");
      setResult(json);
      setActiveTab("forecast");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "forecast", label: "📈 Forecast Chart" },
    { id: "metrics",  label: "📊 Metrics" },
    { id: "rawdata",  label: "🔍 Raw Data" },
    { id: "export",   label: "⬇ Export" },
  ];

  return (
    <div className="dash-root">
      <Navbar />

      <div className="dash-body">

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <QuickGuide architecture={architecture} />
        </motion.div>

        <motion.section
          className="dash-section"
          variants={fadeUp} initial="hidden" animate="show"
        >
          <h2 className="section-heading">1 · Upload Battery Data ({architecture})</h2>

          <FileUploadZone onFile={handleFile} file={file} />

          {preview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="preview-wrap"
            >
              <p className="preview-label">CSV Preview (first 5 rows)</p>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>{preview[0]?.map((h, i) => <th key={i}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {preview.slice(1).map((row, r) => (
                      <tr key={r}>{row.map((cell, c) => <td key={c}>{cell}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          <div className="controls-row">
            <label className="thresh-label">
              Configuration:
              <select
                value={selectedConfig}
                onChange={e => setSelectedConfig(e.target.value)}
                className="thresh-input"
                style={{ width: "auto", minWidth: "220px" }}
              >
                {configs.length > 0 ? (
                  configs.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))
                ) : (
                  <option value="">Loading configs...</option>
                )}
              </select>
            </label>

            <label className="thresh-label">
              Failure Threshold:
              <input
                type="number" min="0.5" max="1" step="0.01"
                value={threshold}
                onChange={e => setThreshold(parseFloat(e.target.value))}
                className="thresh-input"
              />
              <span className="thresh-pct">{(threshold * 100).toFixed(0)}%</span>
            </label>

            <button
              className={`run-btn${loading ? " loading" : ""}${!file ? " disabled" : ""}`}
              onClick={handleRun}
              disabled={!file || loading || !selectedConfig}
            >
              {loading ? (
                <><span className="spinner" />Running Inference…</>
              ) : (
                "🚀 Predict Results"
              )}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="error-box"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </motion.section>

        <AnimatePresence>
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <section className="dash-section">
                <h2 className="section-heading">2 · KPI Metrics</h2>
                <StatusBanner metrics={result.metrics} threshold={threshold} />
                <div style={{ marginTop: 24 }}>
                  <MetricsCards metrics={result.metrics} threshold={threshold} />
                </div>
              </section>

              <section className="dash-section">
                <h2 className="section-heading">3 · Forecast Results</h2>

                {result.n_windows > 1 && (
                  <div className="info-box">
                    ℹ️ {result.n_windows} overlapping windows were inferred and distance-weighted to produce the stitched trajectory.
                  </div>
                )}

                <div className="tabs-bar">
                  {tabs.map(t => (
                    <button
                      key={t.id}
                      className={`tab-btn${activeTab === t.id ? " tab-active" : ""}`}
                      onClick={() => setActiveTab(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="tab-content">
                  {activeTab === "forecast" && (
                    <motion.div key="fc" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ForecastChart data={result} threshold={threshold} />
                    </motion.div>
                  )}

                  {activeTab === "metrics" && (
                    <motion.div key="mt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="metrics-detail">
                        <p><span>Architecture</span><span>{architecture}</span></p>
                        <p><span>Configuration</span><span>{selectedConfig}</span></p>
                        <p><span>Observed Cycles</span><span>{result.historical_soh.length}</span></p>
                        <p><span>Forecast Cycles</span><span>{result.metrics.n_forecast}</span></p>
                        <p><span>Failure Detected</span><span style={{ color: result.metrics.failed ? "#D32F2F" : "#2E7D32" }}>{result.metrics.failed ? "YES ⚠️" : "NO ✅"}</span></p>
                        <p><span>Last SOH</span><span>{(result.metrics.current_soh * 100).toFixed(4)}%</span></p>
                        <p><span>Min Forecast SOH</span><span>{(result.metrics.min_forecast_soh * 100).toFixed(4)}%</span></p>
                        <p><span>Degradation Rate</span><span>{(result.metrics.degradation_rate * 100).toFixed(6)}%/cycle</span></p>
                        <p><span>RUL</span><span>{result.metrics.remaining_life ?? "Beyond forecast window"}</span></p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "rawdata" && (
                    <motion.div key="rd" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <RawDataTab data={result} threshold={threshold} />
                    </motion.div>
                  )}

                  {activeTab === "export" && (
                    <motion.div key="ex" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ExportTab data={result} threshold={threshold} metrics={result.metrics} />
                    </motion.div>
                  )}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background: #F8F9FA; 
          color: #1A1A1C;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .dash-body {
          max-width: 1200px; margin: 0 auto;
          padding: 40px 32px 80px;
          display: flex; flex-direction: column; gap: 32px;
        }

        .dash-section {
          background: #FFFFFF; 
          border: 1px solid #EAEAEA; 
          border-radius: 12px;
          padding: 36px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05); 
        }

        .section-heading {
          font-size: 1.25rem; font-weight: 700;
          color: #1A1A1C; letter-spacing: -0.5px;
          margin-bottom: 24px;
        }

        /* --- Quick Guide Panel Improvements --- */
        .guide-panel { 
          padding: 28px 36px; 
          background: linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%);
        }
        .guide-header {
          display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
        }
        .guide-icon { font-size: 1.5rem; }
        
        .guide-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        .guide-card {
          background: #FFFFFF;
          border: 1px solid #EAEAEA;
          border-radius: 10px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .guide-title { 
          font-size: 1rem; font-weight: 600; color: #8A2B49; 
          margin-bottom: 16px; letter-spacing: -0.2px;
        }
        
        .guide-reqs p { font-size: 0.85rem; color: #333333; margin-bottom: 8px; line-height: 1.6;}
        .text-muted { color: #888888; font-size: 0.85rem; }
        code { 
          background: #F1F3F5; 
          color: #8A2B49; 
          padding: 3px 6px; 
          border-radius: 4px; 
          font-size: 0.8rem; 
          font-family: 'Fira Code', monospace;
          white-space: nowrap;
        }
        .guide-note { 
          font-size: 0.8rem; color: #888888; 
          margin-top: 12px; font-style: italic; 
          line-height: 1.4;
        }
        
        .guide-steps { list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .guide-steps li { 
          display: flex; align-items: flex-start; gap: 12px; 
          font-size: 0.9rem; color: #666666; line-height: 1.4;
        }
        .guide-steps li strong { color: #1A1A1C; }
        .step-badge {
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; border-radius: 50%;
          background: #8A2B49; color: #FFFFFF; 
          font-size: 0.75rem; font-weight: 700;
        }

        /* Upload */
        .upload-zone {
          border: 1px dashed #CCCCCC;
          border-radius: 8px; padding: 48px 24px;
          text-align: center; cursor: pointer;
          transition: all 0.2s; background: #FAFAFA;
        }
        .upload-zone:hover, .upload-zone.drag-over {
          border-color: #8A2B49;
          background: #F9F0F3;
        }
        .upload-icon  { font-size: 2.4rem; margin-bottom: 12px; }
        .upload-hint  { font-size: 1rem; color: #666666; }
        .upload-link  { color: #8A2B49; font-weight: 600; text-decoration: none;}
        .upload-filename { color: #1A1A1C; font-weight: 600; font-size: 1rem; margin-bottom: 4px; }
        .upload-sub   { font-size: 0.8rem; color: #888888; margin-top: 8px; }

        /* Preview */
        .preview-wrap  { margin-top: 20px; }
        .preview-label { font-size: 0.8rem; color: #666666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;}

        /* Controls */
        .controls-row {
          margin-top: 24px;
          display: flex; align-items: center; justify-content: flex-start;
          gap: 24px; flex-wrap: wrap;
        }
        .thresh-label {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.9rem; color: #333333; font-weight: 500;
        }
        .thresh-input {
          width: 80px; padding: 8px 12px;
          background: #FFFFFF; 
          border: 1px solid #CCCCCC;
          border-radius: 8px; color: #1A1A1C; font-size: 0.9rem; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .thresh-input:focus { 
          border-color: #8A2B49; 
          box-shadow: 0 0 0 3px rgba(138, 43, 73, 0.15); 
        }
        .thresh-pct { color: #8A2B49; font-weight: 700; }

        .run-btn {
          margin-left: auto;
          padding: 12px 28px; border-radius: 8px;
          background: #8A2B49; 
          color: #FFFFFF; font-size: 0.95rem; font-weight: 600;
          border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: background 0.2s, transform 0.1s;
        }
        .run-btn:hover { background: #6D223C; }
        .run-btn:active { transform: scale(0.98); }
        .run-btn.loading, .run-btn.disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #FFFFFF;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Error / Info */
        .error-box {
          margin-top: 20px; padding: 14px 18px;
          background: #FFEBEE; border: 1px solid #FFCDD2;
          border-radius: 8px; color: #D32F2F; font-size: 0.9rem; font-weight: 600;
        }
        .info-box {
          margin-bottom: 20px; padding: 14px 18px;
          background: #F1F3F5; border: 1px solid #EAEAEA;
          border-radius: 8px; color: #333333; font-size: 0.9rem; font-weight: 500;
        }

        /* Status banner */
        .status-banner {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 20px 24px; border-radius: 12px;
          margin-bottom: 8px;
        }
        .status-ok   { background: #E8F5E9; border: 1px solid #C8E6C9; }
        .status-fail { background: #FFEBEE; border: 1px solid #FFCDD2; }
        .status-icon { font-size: 1.8rem; }
        .status-title { font-size: 1rem; font-weight: 700; margin-bottom: 4px; color: #1A1A1C;}
        .status-fail .status-title { color: #C62828; }
        .status-ok .status-title { color: #2E7D32; }
        .status-sub   { font-size: 0.85rem; color: #666666; line-height: 1.5; }

        /* Tabs */
        .tabs-bar {
          display: flex; gap: 8px; flex-wrap: wrap;
          border-bottom: 1px solid #EAEAEA;
          margin-bottom: 24px;
        }
        .tab-btn {
          padding: 12px 20px;
          background: transparent; border: none;
          color: #666666; font-size: 0.9rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s; border-bottom: 2px solid transparent;
        }
        .tab-btn:hover { color: #1A1A1C; background: #F8F9FA; }
        .tab-btn.tab-active {
          color: #8A2B49; border-bottom: 2px solid #8A2B49;
        }
        .tab-content { min-height: 300px; }

        /* Metrics detail */
        .metrics-detail { display: flex; flex-direction: column; gap: 0; }
        .metrics-detail p {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0; border-bottom: 1px solid #EAEAEA;
          font-size: 0.95rem;
        }
        .metrics-detail p span:first-child { color: #666666; font-weight: 500; }
        .metrics-detail p span:last-child  { color: #1A1A1C; font-weight: 600; }

        /* Table */
        .table-wrap { overflow-x: auto; border: 1px solid #EAEAEA; border-radius: 8px; background: #FFFFFF;}
        .data-table {
          width: 100%; border-collapse: collapse;
          font-size: 0.85rem;
        }
        .data-table th {
          text-align: left; padding: 12px 16px;
          color: #666666; font-weight: 600; font-size: 0.75rem;
          text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 1px solid #EAEAEA;
          background: #F8F9FA;
        }
        .data-table td {
          padding: 12px 16px; color: #333333;
          border-bottom: 1px solid #EAEAEA;
        }
        .data-table tr.row-warn td { background: #FFEBEE; color: #D32F2F; font-weight: 500; }
        .data-table tr:hover td   { background: #FAFAFA; }

        .badge {
          display: inline-block; padding: 4px 10px;
          border-radius: 6px; font-size: 0.75rem; font-weight: 600;
        }
        .badge-neutral { background: #F1F3F5; color: #666666; }
        .badge-outline { background: transparent; color: #666666; border: 1px solid #CCCCCC;}
        .badge-danger  { background: #FFEBEE; color: #C62828; }

        /* Export */
        .export-btn {
          padding: 12px 24px; border-radius: 8px;
          background: #8A2B49;
          color: #FFFFFF; font-size: 0.95rem; font-weight: 600;
          border: none; cursor: pointer; transition: background 0.2s, transform 0.1s;
          display: inline-block;
        }
        .export-btn:hover { background: #6D223C; }
        .export-btn:active { transform: scale(0.98); }
        .export-btn.ghost {
          background: transparent;
          border: 1px solid #CCCCCC;
          color: #333333;
        }
        .export-btn.ghost:hover { background: #F8F9FA; border-color: #1A1A1C; color: #1A1A1C; }

        @media (max-width: 640px) {
          .dash-body { padding: 24px 16px 60px; }
          .dash-section { padding: 24px 18px; }
          .run-btn { margin-left: 0; width: 100%; justify-content: center; }
          .guide-panel { padding: 20px 18px; }
        }
      `}</style>
    </div>
  );
}