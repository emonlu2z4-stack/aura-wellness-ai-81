import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import leadingUniversityLogo from "@/assets/leading-university-logo.png";

const actors = [
  { id: "user", label: "User", x: 60, y: 440 },
  { id: "admin", label: "Admin", x: 60, y: 920 },
  { id: "ai", label: "AI System", x: 1340, y: 440 },
  { id: "weather", label: "Weather API", x: 1340, y: 920 },
];

const useCases = [
  { id: "uc1", label: "Register Account", x: 420, y: 100 },
  { id: "uc2", label: "Login / Logout", x: 700, y: 100 },
  { id: "uc3", label: "Verify Email", x: 980, y: 100 },

  { id: "uc4", label: "Log Meal Manually", x: 420, y: 210 },
  { id: "uc5", label: "Upload Meal Photo", x: 700, y: 210 },
  { id: "uc6", label: "Analyze Meal via AI", x: 980, y: 210 },
  { id: "uc7", label: "Delete Meal Entry", x: 420, y: 310 },

  { id: "uc8", label: "Get AI Meal\nSuggestions", x: 700, y: 400 },
  { id: "uc9", label: "View Recipe Details", x: 980, y: 400 },
  { id: "uc10", label: "Get Nutrition\nInsights", x: 700, y: 500 },

  { id: "uc11", label: "Track Water Intake", x: 420, y: 500 },
  { id: "uc12", label: "Log Weight", x: 420, y: 600 },
  { id: "uc13", label: "View Macro Progress", x: 700, y: 600 },
  { id: "uc14", label: "Track Streak", x: 980, y: 600 },

  { id: "uc15", label: "Upload Progress\nPhoto", x: 420, y: 710 },
  { id: "uc16", label: "Compare Progress\nPhotos", x: 700, y: 710 },
  { id: "uc17", label: "View Weight Chart", x: 980, y: 710 },

  { id: "uc18", label: "Create / Join Group", x: 420, y: 820 },
  { id: "uc19", label: "Create Challenge", x: 700, y: 820 },
  { id: "uc20", label: "Check-in Challenge", x: 980, y: 820 },

  { id: "uc21", label: "Edit Profile &\nTargets", x: 420, y: 930 },
  { id: "uc22", label: "Toggle Dark/Light\nTheme", x: 700, y: 930 },
  { id: "uc23", label: "View Weather Info", x: 980, y: 930 },
];

const associations: [string, string][] = [
  ["user", "uc1"], ["user", "uc2"], ["user", "uc4"], ["user", "uc5"],
  ["user", "uc7"], ["user", "uc10"], ["user", "uc11"],
  ["user", "uc12"], ["user", "uc13"], ["user", "uc15"], ["user", "uc16"],
  ["user", "uc17"], ["user", "uc18"], ["user", "uc19"], ["user", "uc20"],
  ["user", "uc21"], ["user", "uc22"], ["user", "uc23"],
  ["admin", "uc18"], ["admin", "uc19"],
  ["ai", "uc6"], ["ai", "uc8"], ["ai", "uc9"], ["ai", "uc10"],
  ["weather", "uc23"],
];

const includes: [string, string][] = [
  ["uc5", "uc6"],   // Upload Meal Photo «include» Analyze Meal via AI
  ["uc8", "uc9"],   // Get AI Meal Suggestions «include» View Recipe Details
  ["uc1", "uc3"],   // Register Account «include» Verify Email
  ["uc2", "uc3"],   // Login / Logout «include» Verify Email
  ["uc16", "uc15"], // Compare Progress Photos «include» Upload Progress Photo
  ["uc10", "uc6"],  // Get Nutrition Insights «include» Analyze Meal via AI
  ["uc14", "uc8"],  // Track Streak «include» Get AI Meal Suggestions
];

const extends_: [string, string][] = [
  ["uc17", "uc12"], // View Weight Chart «extend» Log Weight
  ["uc7", "uc4"],   // Delete Meal Entry «extend» Log Meal Manually
];

// draw.io style stick figure
function StickFigure({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 30} r={10} fill="none" stroke="#000" strokeWidth="1.5" />
      <line x1={x} y1={y - 20} x2={x} y2={y + 5} stroke="#000" strokeWidth="1.5" />
      <line x1={x - 14} y1={y - 10} x2={x + 14} y2={y - 10} stroke="#000" strokeWidth="1.5" />
      <line x1={x} y1={y + 5} x2={x - 12} y2={y + 25} stroke="#000" strokeWidth="1.5" />
      <line x1={x} y1={y + 5} x2={x + 12} y2={y + 25} stroke="#000" strokeWidth="1.5" />
      <text x={x} y={y + 42} textAnchor="middle" fontSize="12" fontFamily="Helvetica, Arial, sans-serif" fill="#000">
        {label}
      </text>
    </g>
  );
}

// draw.io style ellipse - light blue fill, darker blue border
function UseCaseEllipse({ x, y, label }: { x: number; y: number; label: string }) {
  const lines = label.split("\n");
  return (
    <g>
      <ellipse cx={x} cy={y} rx={100} ry={30} fill="#dae8fc" stroke="#6c8ebf" strokeWidth="1.5" />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x}
          y={y + (i - (lines.length - 1) / 2) * 14}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontFamily="Helvetica, Arial, sans-serif"
          fill="#000"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

// Association line with arrow (actor → use case, draw.io style)
function AssociationLine({ from, to }: { from: { x: number; y: number }; to: { x: number; y: number } }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  // Shorten to ellipse edge
  const endX = to.x - ux * 100 * 0.85;
  const endY = to.y - uy * 30 * 0.85;
  const angle = Math.atan2(dy, dx);
  const arrowLen = 8;

  return (
    <g>
      <line x1={from.x} y1={from.y} x2={endX} y2={endY} stroke="#000" strokeWidth="1" />
      {/* Open arrowhead */}
      <line
        x1={endX}
        y1={endY}
        x2={endX - arrowLen * Math.cos(angle - 0.4)}
        y2={endY - arrowLen * Math.sin(angle - 0.4)}
        stroke="#000" strokeWidth="1"
      />
      <line
        x1={endX}
        y1={endY}
        x2={endX - arrowLen * Math.cos(angle + 0.4)}
        y2={endY - arrowLen * Math.sin(angle + 0.4)}
        stroke="#000" strokeWidth="1"
      />
    </g>
  );
}

// Dashed arrow for include/extend (draw.io style - filled blue arrowhead)
function DashedArrow({ from, to, label }: { from: { x: number; y: number }; to: { x: number; y: number }; label: string }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;

  const ux = dx / len;
  const uy = dy / len;

  // Calculate exact ellipse edge intersection (rx=100, ry=30)
  // Point on ellipse: parametric angle t where cos(t)=-ux, sin(t)=-uy scaled
  const rx = 100;
  const ry = 30;
  const scale = 1 / Math.sqrt((ux * ux) / (rx * rx) + (uy * uy) / (ry * ry));
  const edgeX = to.x - ux * scale;
  const edgeY = to.y - uy * scale;

  // Also compute start edge (from ellipse)
  const startEdgeX = from.x + ux * (1 / Math.sqrt((ux * ux) / (rx * rx) + (uy * uy) / (ry * ry)));
  const startEdgeY = from.y + uy * (1 / Math.sqrt((ux * ux) / (rx * rx) + (uy * uy) / (ry * ry)));

  const arrowLen = 12;
  const angle = Math.atan2(dy, dx);
  const tipX = edgeX;
  const tipY = edgeY;
  const leftX = tipX - arrowLen * Math.cos(angle - 0.35);
  const leftY = tipY - arrowLen * Math.sin(angle - 0.35);
  const rightX = tipX - arrowLen * Math.cos(angle + 0.35);
  const rightY = tipY - arrowLen * Math.sin(angle + 0.35);

  // Shorten the dashed line so it ends at the base of the arrowhead
  const lineEndX = edgeX - ux * arrowLen * 0.8;
  const lineEndY = edgeY - uy * arrowLen * 0.8;

  return (
    <g>
      <line x1={startEdgeX} y1={startEdgeY} x2={lineEndX} y2={lineEndY} stroke="#4a90d9" strokeWidth="1.5" strokeDasharray="8,4" />
      {/* Filled blue arrowhead */}
      <polygon
        points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`}
        fill="#4a90d9"
        stroke="#4a90d9"
        strokeWidth="1"
      />
      {/* Label background for visibility */}
      <rect
        x={mx - 30}
        y={my - 20}
        width={60}
        height={14}
        fill="#fff"
        stroke="none"
        rx={2}
      />
      <text
        x={mx}
        y={my - 9}
        textAnchor="middle"
        fontSize="11"
        fontFamily="Helvetica, Arial, sans-serif"
        fill="#4a90d9"
        fontWeight="bold"
      >
        {label}
      </text>
    </g>
  );
}

export default function UseCaseDiagram() {
  const coverRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);

  const getPos = (id: string) => {
    const actor = actors.find((a) => a.id === id);
    if (actor) return { x: actor.x, y: actor.y };
    const uc = useCases.find((u) => u.id === id);
    if (uc) return { x: uc.x, y: uc.y };
    return { x: 0, y: 0 };
  };

  const handleDownload = async () => {
    if (!coverRef.current || !diagramRef.current) return;
    setGenerating(true);
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      const coverCanvas = await html2canvas(coverRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const coverImg = coverCanvas.toDataURL("image/png");
      const coverRatio = coverCanvas.width / coverCanvas.height;
      const pdfRatio = pdfW / pdfH;
      let cW = pdfW, cH = pdfH, cX = 0, cY = 0;
      if (coverRatio > pdfRatio) { cH = pdfW / coverRatio; cY = (pdfH - cH) / 2; }
      else { cW = pdfH * coverRatio; cX = (pdfW - cW) / 2; }
      pdf.addImage(coverImg, "PNG", cX, cY, cW, cH);

      pdf.addPage("a3", "landscape");
      const diagCanvas = await html2canvas(diagramRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const diagImg = diagCanvas.toDataURL("image/png");
      const dPdfW = pdf.internal.pageSize.getWidth();
      const dPdfH = pdf.internal.pageSize.getHeight();
      const diagRatio = diagCanvas.width / diagCanvas.height;
      const dPdfRatio = dPdfW / dPdfH;
      let dW = dPdfW, dH = dPdfH, dX = 0, dY = 0;
      if (diagRatio > dPdfRatio) { dH = dPdfW / diagRatio; dY = (dPdfH - dH) / 2; }
      else { dW = dPdfH * diagRatio; dX = (dPdfW - dW) / 2; }
      pdf.addImage(diagImg, "PNG", dX, dY, dW, dH);

      pdf.save("NutriTrack-Use-Case-Diagram.pdf");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px", background: "#f5f5f5", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button onClick={handleDownload} disabled={generating} style={{ background: "#1e40af", color: "#fff" }}>
            <Download className="w-4 h-4 mr-2" /> {generating ? "Generating..." : "Download as PDF"}
          </Button>
        </div>

        {/* Page 1: Cover Page */}
        <div
          ref={coverRef}
          style={{
            background: "#fff",
            padding: "40px 48px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "700px",
            marginBottom: "40px",
            fontFamily: "'Times New Roman', serif",
          }}
        >
          <div style={{ textAlign: "center", paddingTop: "60px", width: "100%" }}>
            <img src={leadingUniversityLogo} alt="Leading University Logo" style={{ width: "120px", margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "18pt", fontWeight: "bold", color: "#0f172a", margin: "0 0 4px", letterSpacing: "2px" }}>
              LEADING UNIVERSITY
            </h2>
            <p style={{ fontSize: "12pt", color: "#334155", margin: "0 0 2px" }}>Department of Computer Science &amp; Engineering</p>
            <div style={{ width: "60%", height: "2px", background: "#1e40af", margin: "16px auto" }} />
          </div>

          <div style={{ textAlign: "center", padding: "0 60px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: "13pt", color: "#475569", margin: "0 0 8px", fontStyle: "italic" }}>An Assignment on</p>
            <h1 style={{ fontSize: "20pt", fontWeight: "bold", color: "#0f172a", margin: "0 0 24px", lineHeight: 1.4 }}>
              Use Case Diagram of NutriTrack AI<br />Health &amp; Fitness Application
            </h1>
            <p style={{ fontSize: "12pt", color: "#334155", margin: "0 0 4px" }}>
              <strong>Course Title:</strong> Software Engineering
            </p>
            <p style={{ fontSize: "12pt", color: "#334155", margin: "0 0 24px" }}>
              <strong>Course Code:</strong> CSE-3213
            </p>
            <div style={{ display: "flex", justifyContent: "space-around", width: "100%", marginTop: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13pt", fontWeight: "bold", color: "#1e293b", margin: "0 0 10px", fontStyle: "italic", textDecoration: "underline" }}>Submitted To</p>
                <p style={{ fontSize: "12pt", color: "#1e293b", margin: "0 0 2px", fontWeight: "bold" }}>Aushtmi Deb</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Lecturer</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Department of CSE</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Leading University</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13pt", fontWeight: "bold", color: "#1e293b", margin: "0 0 10px", fontStyle: "italic", textDecoration: "underline" }}>Submitted By</p>
                <p style={{ fontSize: "12pt", color: "#1e293b", margin: "0 0 2px", fontWeight: "bold" }}>Emon Ahmed</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>ID: 0182320012101356</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Section: H, Batch: 62</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Department of CSE</p>
                <div style={{ width: "80%", height: "1px", background: "#64748b", margin: "4px auto 4px" }} />
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Leading University</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", paddingBottom: "50px" }}>
            <div style={{ width: "60%", height: "1px", background: "#94a3b8", margin: "0 auto 12px" }} />
            <p style={{ fontSize: "12pt", color: "#334155", margin: "0" }}>
              <strong>Date of Submission:</strong> March 14, 2026
            </p>
          </div>
        </div>

        {/* Page 2: Diagram (draw.io style) */}
        <div
          ref={diagramRef}
          style={{
            background: "#fff",
            padding: "30px 20px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            borderRadius: "4px",
          }}
        >
          <h1 style={{ fontSize: "14pt", fontWeight: "bold", textAlign: "center", margin: "0 0 10px", color: "#000", fontFamily: "Helvetica, Arial, sans-serif" }}>
            Use Case Diagram — NutriTrack AI Health &amp; Fitness Application
          </h1>

          <svg viewBox="0 0 1400 1020" style={{ width: "100%", fontFamily: "Helvetica, Arial, sans-serif" }}>
            <defs>
              <marker id="arrowOpen" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <path d="M0,0 L10,3.5 L0,7" fill="none" stroke="#000" strokeWidth="1" />
              </marker>
            </defs>

            {/* System boundary rectangle - draw.io style */}
            <rect x="170" y="40" width="1060" height="960" rx="0" fill="none" stroke="#000" strokeWidth="2" />
            <text x="700" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000" fontFamily="Helvetica, Arial, sans-serif">
              NutriTrack AI System
            </text>

            {/* Separator lines between groups (subtle, draw.io style) */}
            <line x1="180" y1="155" x2="1220" y2="155" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="4,4" />
            <line x1="180" y1="360" x2="1220" y2="360" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="4,4" />
            <line x1="180" y1="550" x2="1220" y2="550" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="4,4" />
            <line x1="180" y1="660" x2="1220" y2="660" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="4,4" />
            <line x1="180" y1="770" x2="1220" y2="770" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="4,4" />
            <line x1="180" y1="880" x2="1220" y2="880" stroke="#e0e0e0" strokeWidth="0.5" strokeDasharray="4,4" />

            {/* Association lines */}
            {associations.map(([fromId, toId], i) => (
              <AssociationLine key={`assoc-${i}`} from={getPos(fromId)} to={getPos(toId)} />
            ))}

            {/* Include relationships */}
            {includes.map(([fromId, toId], i) => (
              <DashedArrow key={`inc-${i}`} from={getPos(fromId)} to={getPos(toId)} label="«include»" />
            ))}

            {/* Extend relationships */}
            {extends_.map(([fromId, toId], i) => (
              <DashedArrow key={`ext-${i}`} from={getPos(fromId)} to={getPos(toId)} label="«extend»" />
            ))}

            {/* Use case ellipses */}
            {useCases.map((uc) => (
              <UseCaseEllipse key={uc.id} x={uc.x} y={uc.y} label={uc.label} />
            ))}

            {/* Actors */}
            {actors.map((a) => (
              <StickFigure key={a.id} x={a.x} y={a.y} label={a.label} />
            ))}
          </svg>

          <p style={{ textAlign: "center", fontSize: "10pt", fontStyle: "italic", marginTop: "10px", color: "#555", fontFamily: "Helvetica, Arial, sans-serif" }}>
            Figure 1: Use Case Diagram of NutriTrack AI Health &amp; Fitness Application
          </p>
        </div>
      </div>
    </div>
  );
}
