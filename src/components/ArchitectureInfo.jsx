export default function ArchitectureInfo({ architecture }) {
  const isLSTM = architecture.includes("LSTM");

  const info = isLSTM ? {
    title: "CNN-LSTM Architecture",
    desc: "An optimized architecture designed for high-precision forecasting. It pairs a Gated Recurrent Unit (GRU) for temporal modeling with an Attention mechanism that 'hyper-focuses' on specific moments of battery degradation to better capture imminent capacity drops.\n",
    image: "/lstm-arch.png",
    layers: [
      { name: "1D-CNN Encoder", text: "This layer acts as the model's 'eyes'. It scans raw electrical signals like voltage and current to extract spatial signatures—the unique physical shapes of the battery's discharge curve that change as internal chemistry wears down." },
      { name: "Auxiliary Encoder", text: "While the scanner looks at shapes, this layer extracts numerical context. It processes hard data points like internal resistance and energy delivered to give the model a factual 'baseline' of the battery's current health." },
      { name: "LSTM Layer", text: "Battery aging is a slow, historical process. This layer extracts temporal dependencies by 'remembering' how the battery has behaved over the last 64 cycles. It identifies the speed and pattern of degradation to ensure the forecast is consistent with past behavior." },
      { name: "FC Prediction Head", text: "This final layer takes all the extracted shapes, facts, and memories and translates them into a single, understandable State of Health (SOH) percentage." }
    ]
  } : {
    title: "CNN-GRU-ATTENTION Architecture",
    desc: "A robust fusion model designed for stable State of Health (SOH) estimation. It combines convolutional feature extraction with Long Short-Term Memory (LSTM) networks to identify long-term temporal dependencies and aging trends across continuous battery life-cycles.\n",
    image: "/gru-arch.png",
    layers: [
      { name: "Enhanced CNN with BatchNorm", text: "Raw sensor data is often 'noisy' due to electrical interference. This layer extracts stabilized features by cleaning the signals using Batch Normalization, ensuring the model focuses on real degradation instead of random sensor spikes." },
      { name: "Auxiliary Encoder ", text: "This layer extracts a 16-dimensional context map. It takes simple numbers like 'discharge time' and turns them into a rich mathematical description that helps the model distinguish between a battery that is 'resting' and one that is truly 'dying'." },
      { name: "Stacked GRU with Dropout", text: "This is a streamlined memory bank that extracts degradation dynamics. It tracks how the battery's health evolves cycle-by-cycle, while the 'Dropout' feature forces it to ignore minor errors so it doesn't over-react to one bad data point." },
      { name: "Attention Mechanism", text: "Not all past cycles are equally important. This layer extracts priority scores for every cycle in the input window. It 'spotlights' the most critical moments—like the sudden 'knee' where health begins to drop fast—to make sure the forecast reacts quickly to imminent failure." },
      { name: "Expanded FC Head", text: "This larger output layer is designed for long-distance thinking. It takes the weighted memories and projects them forward to extract a multi-step forecast, predicting the battery's health for up to 96 future cycles with high precision." }
    ]
  };



  return (
    <div className="arch-panel">
      {/* 1. Description and Layer Breakdown (Now always flows first) */}
      <div className="arch-content">
        <h3 className="arch-title">{info.title}</h3>
        <p className="arch-desc">{info.desc}</p>
        
        <h4 className="arch-subtitle">Layer Breakdown:</h4>
        <ul className="arch-list">
          {info.layers.map((layer, i) => (
            <li key={i}>
              <span className="layer-name">{layer.name}</span>
              <span className="layer-text">{layer.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Architecture Diagram (Large, centered, below text) */}
      <div className="arch-image-wrap">
        <img src={info.image} alt={`${architecture} Diagram`} className="arch-image" />
      </div>

      <style>{`
        /* Changed to column to force text above image */
        .arch-panel { 
          display: flex; 
          flex-direction: column; 
          gap: 40px; 
          width: 100%;
        }

        .arch-content { 
          width: 100%;
          display: flex; 
          flex-direction: column; 
        }
        
        .arch-title { 
          font-size: 1.4rem; 
          font-weight: 700; 
          color: #8A2B49; 
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        
        .arch-desc { 
          font-size: 0.95rem; 
          color: #4A5568; 
          line-height: 1.6; 
          margin-bottom: 24px; 
        }
        
        .arch-subtitle {
          font-size: 1rem;
          font-weight: 600;
          color: #1A1A1C;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .arch-list { 
          list-style: none; 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          margin: 0;
          padding: 0;
        }
        
        .arch-list li { 
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-left: 16px; 
          border-left: 3px solid #8A2B49; 
        }
        
        .layer-name { 
          color: #1A1A1C; 
          font-weight: 700;
          font-size: 0.95rem;
        }
        
        .layer-text {
          color: #666666;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        /* The Image Container - Centered and Borderless */
        .arch-image-wrap { 
          width: 100%;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: transparent; /* Removed white background */
          border: none; /* Removed border */
          padding: 0; /* Removed padding */
          box-shadow: none; /* Removed shadow */
        }
        
        /* Forces the image to be large */
        .arch-image { 
          width: auto;
          max-width: 100%; /* Spans full container width if needed */
          height: auto;
          max-height: 600px; /* Increased height significantly */
          object-fit: contain; 
        }

        /* Mobile adjustments for image height */
        @media (max-width: 600px) {
          .arch-image {
            max-height: 350px;
          }
        }
      `}</style>
    </div>
  );
}