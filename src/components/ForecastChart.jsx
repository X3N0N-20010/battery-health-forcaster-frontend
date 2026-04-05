import {
  ComposedChart, Line, Area, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

function buildChartData(data, threshold) {
  const { historical_soh, forecast_soh, confidence_upper, confidence_lower, cycles } = data;
  const n_hist = historical_soh.length;

  return cycles.map((cycle, i) => {
    const isHist = i < n_hist;
    const pred   = forecast_soh[i];
    return {
      cycle,
      historical:   isHist ? +(historical_soh[i] * 100).toFixed(4) : undefined,
      predicted:    pred !== null && pred !== undefined ? +(pred * 100).toFixed(4) : undefined,
      upper:        confidence_upper[i] !== undefined ? +(confidence_upper[i] * 100).toFixed(4) : undefined,
      lower:        confidence_lower[i] !== undefined ? +(confidence_lower[i] * 100).toFixed(4) : undefined,
      confBand:     (confidence_upper[i] !== undefined && confidence_lower[i] !== undefined)
                      ? [+(confidence_lower[i] * 100).toFixed(4), +(confidence_upper[i] * 100).toFixed(4)]
                      : undefined,
      threshold:    +(threshold * 100).toFixed(1),
    };
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#FFFFFF",
      border: "1px solid #EAEAEA",
      borderRadius: 8, 
      padding: "12px 16px", 
      fontSize: 13,
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)" 
    }}>
      <p style={{ color: "#666666", marginBottom: 6, fontWeight: 600 }}>Cycle {label}</p>
      {payload.map(p => (
        p.value !== undefined && (
          <p key={p.name} style={{ color: p.color || "#333333", margin: "4px 0", fontWeight: 600 }}>
            {p.name}: {typeof p.value === "number" ? p.value.toFixed(3) + "%" : p.value}
          </p>
        )
      ))}
    </div>
  );
};

export default function ForecastChart({ data, threshold }) {
  const chartData = buildChartData(data, threshold);
  const threshPct = +(threshold * 100).toFixed(1);

  return (
    <div style={{ width: "100%", height: 420 }}>
      <ResponsiveContainer>
        <ComposedChart data={chartData} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" />
          <XAxis
            dataKey="cycle"
            tick={{ fill: "#666666", fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: "#CCCCCC" }}
            tickLine={false}
            label={{ value: "Cycle", position: "insideBottom", offset: -4, fill: "#666666", fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#666666", fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: "#CCCCCC" }}
            tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: "#666666", fontSize: 13, paddingTop: 12, fontWeight: 500 }}
          />

          <Area
            dataKey="confBand"
            name="±1σ Confidence"
            fill="rgba(0, 106, 128, 0.1)" /* Teal transparent fill */
            stroke="none"
            connectNulls={false}
            legendType="none"
          />

          <ReferenceLine
            y={threshPct}
            stroke="#D32F2F" /* Kept Vibrant Danger Red for Threshold */
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{ value: `Threshold ${threshPct}%`, fill: "#D32F2F", fontSize: 11, fontWeight: 600, position: "insideTopRight" }}
          />

          <Line
            dataKey="historical"
            name="Historical SOH"
            stroke="#1A1A1C"
            strokeWidth={2.5}
            dot={false}
            connectNulls={false}
          />

          <Line
            dataKey="predicted"
            name="Predicted SOH"
            stroke="#006A80" /* Deep Teal */
            strokeWidth={2.5}
            dot={false}
            strokeDasharray="5 3"
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}