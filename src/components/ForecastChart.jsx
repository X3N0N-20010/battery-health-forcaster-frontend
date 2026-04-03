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
      background: "#38383D", /* Elevated Surface */
      border: "1px solid #444449",
      borderRadius: 8, 
      padding: "12px 16px", 
      fontSize: 13,
      boxShadow: "0px 8px 24px rgba(15, 15, 18, 0.4)"
    }}>
      <p style={{ color: "#A8A8AA", marginBottom: 6, fontWeight: 500 }}>Cycle {label}</p>
      {payload.map(p => (
        p.value !== undefined && (
          <p key={p.name} style={{ color: p.color || "#E4E4E2", margin: "4px 0", fontWeight: 500 }}>
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
          <CartesianGrid strokeDasharray="3 3" stroke="#444449" opacity={0.5} />
          <XAxis
            dataKey="cycle"
            tick={{ fill: "#A8A8AA", fontSize: 12 }}
            axisLine={{ stroke: "#444449" }}
            tickLine={false}
            label={{ value: "Cycle", position: "insideBottom", offset: -4, fill: "#A8A8AA", fontSize: 12 }}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#A8A8AA", fontSize: 12 }}
            axisLine={{ stroke: "#444449" }}
            tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: "#A8A8AA", fontSize: 13, paddingTop: 12 }}
          />

          <Area
            dataKey="confBand"
            name="±1σ Confidence"
            fill="rgba(124, 152, 182, 0.15)" /* Primary Accent low opacity */
            stroke="none"
            connectNulls={false}
            legendType="none"
          />

          <ReferenceLine
            y={threshPct}
            stroke="#BF8286" /* Danger */
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{ value: `Threshold ${threshPct}%`, fill: "#BF8286", fontSize: 11, position: "insideTopRight" }}
          />

          {/* Historical SOH - Soft Pearl */}
          <Line
            dataKey="historical"
            name="Historical SOH"
            stroke="#E4E4E2"
            strokeWidth={2.5}
            dot={false}
            connectNulls={false}
          />

          {/* Predicted SOH - Dusty Slate Blue */}
          <Line
            dataKey="predicted"
            name="Predicted SOH"
            stroke="#7C98B6"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 3"
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}