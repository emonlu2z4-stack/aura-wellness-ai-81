import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import leadingUniversityLogo from "@/assets/leading-university-logo.png";

const actors = [
  { id: "user", label: "User", x: 55, y: 460 },
  { id: "admin", label: "Admin", x: 55, y: 940 },
  { id: "ai", label: "AI System", x: 1340, y: 460 },
  { id: "weather", label: "Weather API", x: 1340, y: 900 },
];

const useCases = [
  // Auth
  { id: "uc1", label: "Register Account", x: 400, y: 100, group: "auth" },
  { id: "uc2", label: "Login / Logout", x: 670, y: 100, group: "auth" },
  { id: "uc3", label: "Verify Email", x: 940, y: 100, group: "auth" },

  // Meal Tracking
  { id: "uc4", label: "Log Meal Manually", x: 400, y: 250, group: "meal" },
  { id: "uc5", label: "Upload Meal Photo", x: 670, y: 250, group: "meal" },
  { id: "uc6", label: "Analyze Meal via AI", x: 940, y: 250, group: "meal" },
  { id: "uc7", label: "Delete Meal Entry", x: 400, y: 340, group: "meal" },

  // Nutrition & AI
  { id: "uc8", label: "Get AI Meal\nSuggestions", x: 670, y: 440, group: "nutrition" },
  { id: "uc9", label: "View Recipe Details", x: 940, y: 440, group: "nutrition" },
  { id: "uc10", label: "Get Nutrition\nInsights", x: 670, y: 530, group: "nutrition" },

  // Tracking
  { id: "uc11", label: "Track Water Intake", x: 400, y: 530, group: "tracking" },
  { id: "uc12", label: "Log Weight", x: 400, y: 630, group: "tracking" },
  { id: "uc13", label: "View Macro Progress", x: 670, y: 630, group: "tracking" },
  { id: "uc14", label: "Track Streak", x: 940, y: 630, group: "tracking" },

  // Progress
  { id: "uc15", label: "Upload Progress\nPhoto", x: 400, y: 740, group: "progress" },
  { id: "uc16", label: "Compare Progress\nPhotos", x: 670, y: 740, group: "progress" },
  { id: "uc17", label: "View Weight Chart", x: 940, y: 740, group: "progress" },

  // Groups
  { id: "uc18", label: "Create / Join Group", x: 400, y: 860, group: "groups" },
  { id: "uc19", label: "Create Challenge", x: 670, y: 860, group: "groups" },
  { id: "uc20", label: "Check-in Challenge", x: 940, y: 860, group: "groups" },

  // Profile & Settings
  { id: "uc21", label: "Edit Profile &\nTargets", x: 400, y: 980, group: "profile" },
  { id: "uc22", label: "Toggle Dark/Light\nTheme", x: 670, y: 980, group: "profile" },
  { id: "uc23", label: "View Weather Info", x: 940, y: 980, group: "profile" },
];

const associations: [string, string][] = [
  ["user", "uc1"], ["user", "uc2"], ["user", "uc4"], ["user", "uc5"],
  ["user", "uc7"], ["user", "uc8"], ["user", "uc10"], ["user", "uc11"],
  ["user", "uc12"], ["user", "uc13"], ["user", "uc15"], ["user", "uc16"],
  ["user", "uc17"], ["user", "uc18"], ["user", "uc19"], ["user", "uc20"],
  ["user", "uc21"], ["user", "uc22"], ["user", "uc23"],
  ["admin", "uc18"], ["admin", "uc19"],
  ["ai", "uc6"], ["ai", "uc8"], ["ai", "uc9"], ["ai", "uc10"],
  ["weather", "uc23"],
];

const includes: [string, string][] = [
  ["uc5", "uc6"],
  ["uc8", "uc9"],
];

const extends_: [string, string][] = [
  ["uc3", "uc1"],
  ["uc14", "uc4"],
];

const groupBands: { label: string; y: number; h: number; color: string }[] = [
  { label: "Authentication", y: 60, h: 80, color: "#f0f0ff" },
  { label: "Meal Tracking", y: 200, h: 180, color: "#f0fdf4" },
  { label: "Nutrition & AI", y: 400, h: 170, color: "#fffbeb" },
  { label: "Health Tracking", y: 495, h: 180, color: "#fef2f2" },
  { label: "Progress", y: 700, h: 80, color: "#faf5ff" },
  { label: "Groups & Challenges", y: 820, h: 80, color: "#ecfeff" },
  { label: "Profile & Settings", y: 940, h: 80, color: "#fff1f2" },
];

function StickFigure({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 32} r={12} fill="none" stroke="#1e293b" strokeWidth="2.2" />
      <line x1={x} y1={y - 20} x2={x} y2={y + 8} stroke="#1e293b" strokeWidth="2.2" />
      <line x1={x - 16} y1={y - 8} x2={x + 16} y2={y - 8} stroke="#1e293b" strokeWidth="2.2" />
      <line x1={x} y1={y + 8} x2={x - 14} y2={y + 30} stroke="#1e293b" strokeWidth="2.2" />
      <line x1={x} y1={y + 8} x2={x + 14} y2={y + 30} stroke="#1e293b" strokeWidth="2.2" />
      <text x={x} y={y + 48} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a" fontFamily="'Times New Roman', serif">
        {label}
      </text>
    </g>
  );
}

function UseCaseEllipse({ x, y, label }: { x: number; y: number; label: string }) {
  const lines = label.split("\n");
  return (
    <g>
      <ellipse cx={x} cy={y} rx={95} ry={32} fill="#f8fafc" stroke="#2563eb" strokeWidth="1.8" />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x}
          y={y + (i - (lines.length - 1) / 2) * 14}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fontFamily="'Times New Roman', serif"
          fill="#0f172a"
          fontWeight="500"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

const actorColors: Record<string, string> = {
  user: "#2563eb",
  admin: "#dc2626",
  ai: "#059669",
  weather: "#d97706",
};

function AssociationLine({ from, to, color }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string }) {
  return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth="1.6" opacity="0.75" />;
}

function DashedArrow({ from, to, label }: { from: { x: number; y: number }; to: { x: number; y: number }; label: string }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const angle = Math.atan2(dy, dx);
  const arrowX = to.x - (dx / len) * 32;
  const arrowY = to.y - (dy / len) * 32;

  return (
    <g>
      <line x1={from.x} y1={from.y} x2={arrowX} y2={arrowY} stroke="#1e293b" strokeWidth="2" strokeDasharray="8,4" />
      <polygon
        points={`${arrowX},${arrowY} ${arrowX - 10 * Math.cos(angle - 0.4)},${arrowY - 10 * Math.sin(angle - 0.4)} ${arrowX - 10 * Math.cos(angle + 0.4)},${arrowY - 10 * Math.sin(angle + 0.4)}`}
        fill="#1e293b"
      />
      <text x={mx} y={my - 8} textAnchor="middle" fontSize="11" fontStyle="italic" fill="#475569" fontFamily="'Times New Roman', serif">
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
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      // Page 1: Cover page
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

      // Page 2: Diagram (landscape)
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
    <div style={{ minHeight: "100vh", padding: "24px", fontFamily: "'Times New Roman', serif" }}>
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
            width: "794px",
            minHeight: "1123px",
            margin: "0 auto 40px",
            padding: "0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Top section */}
          <div style={{ textAlign: "center", paddingTop: "60px", width: "100%" }}>
            <img src={leadingUniversityLogo} alt="Leading University Logo" style={{ width: "120px", margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "18pt", fontWeight: "bold", color: "#0f172a", margin: "0 0 4px", letterSpacing: "2px" }}>
              LEADING UNIVERSITY
            </h2>
            <p style={{ fontSize: "12pt", color: "#334155", margin: "0 0 2px" }}>Department of Computer Science &amp; Engineering</p>
            <div style={{ width: "60%", height: "2px", background: "#1e40af", margin: "16px auto" }} />
          </div>

          {/* Middle section - Assignment details */}
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
              {/* Submitted To */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13pt", fontWeight: "bold", color: "#0f172a", margin: "0 0 8px", textDecoration: "underline" }}>Submitted To</p>
                <p style={{ fontSize: "12pt", color: "#1e293b", margin: "0 0 2px", fontWeight: "bold" }}>Aushtmi Deb</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Lecturer</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Department of CSE</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Leading University</p>
              </div>

              {/* Submitted By */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "13pt", fontWeight: "bold", color: "#0f172a", margin: "0 0 8px", textDecoration: "underline" }}>Submitted By</p>
                <p style={{ fontSize: "12pt", color: "#1e293b", margin: "0 0 2px", fontWeight: "bold" }}>Emon Ahmed</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>ID: 0182320012101356</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Section: H, Batch: 62</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Department of CSE</p>
                <p style={{ fontSize: "11pt", color: "#475569", margin: "0" }}>Leading University</p>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div style={{ textAlign: "center", paddingBottom: "50px" }}>
            <div style={{ width: "60%", height: "1px", background: "#94a3b8", margin: "0 auto 12px" }} />
            <p style={{ fontSize: "12pt", color: "#334155", margin: "0" }}>
              <strong>Date of Submission:</strong> March 14, 2026
            </p>
          </div>
        </div>

        {/* Page 2: Diagram */}
        <div
          ref={diagramRef}
          style={{
            background: "#fff",
            padding: "40px 48px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            borderRadius: "4px",
          }}
        >
          {/* Diagram Title */}
          <h1 style={{ fontSize: "16pt", fontWeight: "bold", textAlign: "center", margin: "0 0 16px", color: "#0f172a" }}>
            Use Case Diagram — NutriTrack AI Health &amp; Fitness Application
          </h1>

          {/* SVG Diagram */}
          <svg viewBox="0 0 1400 1060" style={{ width: "100%", fontFamily: "'Times New Roman', serif" }}>
            {/* Group background bands */}
            {groupBands.map((g, i) => (
              <rect key={i} x="148" y={g.y} width="1010" height={g.h} rx="6" fill={g.color} opacity="0.6" />
            ))}

            {/* System boundary */}
            <rect x="140" y="35" width="1025" height="1000" rx="8" fill="none" stroke="#0f172a" strokeWidth="2.5" />
            <text x="652" y="26" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0f172a" fontFamily="'Times New Roman', serif">
              NutriTrack AI System
            </text>

            {/* Group labels */}
            <text x="160" y="85" fontSize="12" fill="#4338ca" fontWeight="700" fontFamily="'Times New Roman', serif">Authentication</text>
            <text x="160" y="225" fontSize="12" fill="#047857" fontWeight="700" fontFamily="'Times New Roman', serif">Meal Tracking</text>
            <text x="160" y="420" fontSize="12" fill="#b45309" fontWeight="700" fontFamily="'Times New Roman', serif">Nutrition &amp; AI</text>
            <text x="160" y="515" fontSize="12" fill="#b91c1c" fontWeight="700" fontFamily="'Times New Roman', serif">Health Tracking</text>
            <text x="160" y="720" fontSize="12" fill="#6d28d9" fontWeight="700" fontFamily="'Times New Roman', serif">Progress</text>
            <text x="160" y="840" fontSize="12" fill="#0e7490" fontWeight="700" fontFamily="'Times New Roman', serif">Groups &amp; Challenges</text>
            <text x="160" y="960" fontSize="12" fill="#9d174d" fontWeight="700" fontFamily="'Times New Roman', serif">Profile &amp; Settings</text>

            {/* Associations */}
            {(() => {
              const byActor: Record<string, string[]> = {};
              associations.forEach(([fromId, toId]) => {
                if (!byActor[fromId]) byActor[fromId] = [];
                byActor[fromId].push(toId);
              });
              return Object.entries(byActor).flatMap(([actorId, targets]) => {
                const actorPos = getPos(actorId);
                const count = targets.length;
                const spread = Math.min(count * 5, 60);
                return targets.map((toId, idx) => {
                  const offset = -spread / 2 + (count > 1 ? (idx / (count - 1)) * spread : 0);
                  const fromWithOffset = { x: actorPos.x, y: actorPos.y + offset };
                  return (
                    <AssociationLine
                      key={`${actorId}-${toId}`}
                      from={fromWithOffset}
                      to={getPos(toId)}
                      color={actorColors[actorId] || "#1e293b"}
                    />
                  );
                });
              });
            })()}

            {/* Include relationships */}
            {includes.map(([fromId, toId], i) => (
              <DashedArrow key={`inc-${i}`} from={getPos(fromId)} to={getPos(toId)} label="<<include>>" />
            ))}

            {/* Extend relationships */}
            {extends_.map(([fromId, toId], i) => (
              <DashedArrow key={`ext-${i}`} from={getPos(fromId)} to={getPos(toId)} label="<<extend>>" />
            ))}

            {/* Use cases */}
            {useCases.map((uc) => (
              <UseCaseEllipse key={uc.id} x={uc.x} y={uc.y} label={uc.label} />
            ))}

            {/* Actors */}
            {actors.map((a) => (
              <StickFigure key={a.id} x={a.x} y={a.y} label={a.label} />
            ))}
          </svg>

          {/* Legend */}
          <div style={{
            border: "1.5px solid #334155",
            borderRadius: "4px",
            padding: "14px 20px",
            marginTop: "16px",
            fontSize: "10pt",
            color: "#1e293b",
          }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="30" height="12"><line x1="0" y1="6" x2="30" y2="6" stroke="#2563eb" strokeWidth="1.8" /></svg>
                <span style={{ color: "#2563eb" }}>User</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="30" height="12"><line x1="0" y1="6" x2="30" y2="6" stroke="#dc2626" strokeWidth="1.8" /></svg>
                <span style={{ color: "#dc2626" }}>Admin</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="30" height="12"><line x1="0" y1="6" x2="30" y2="6" stroke="#059669" strokeWidth="1.8" /></svg>
                <span style={{ color: "#059669" }}>AI System</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="30" height="12"><line x1="0" y1="6" x2="30" y2="6" stroke="#d97706" strokeWidth="1.8" /></svg>
                <span style={{ color: "#d97706" }}>Weather API</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="40" height="12"><line x1="0" y1="6" x2="32" y2="6" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="6,3" /><polygon points="32,6 26,3 26,9" fill="#1e293b" /></svg>
                <span style={{ fontStyle: "italic" }}>&lt;&lt;include&gt;&gt; / &lt;&lt;extend&gt;&gt;</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="26" height="18"><ellipse cx="13" cy="9" rx="12" ry="8" fill="#f8fafc" stroke="#2563eb" strokeWidth="1.3" /></svg>
                <span>Use Case</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="18" height="26">
                  <circle cx="9" cy="4" r="3.5" fill="none" stroke="#1e293b" strokeWidth="1.3" />
                  <line x1="9" y1="7.5" x2="9" y2="15" stroke="#1e293b" strokeWidth="1.3" />
                  <line x1="3" y1="10" x2="15" y2="10" stroke="#1e293b" strokeWidth="1.3" />
                  <line x1="9" y1="15" x2="4" y2="22" stroke="#1e293b" strokeWidth="1.3" />
                  <line x1="9" y1="15" x2="14" y2="22" stroke="#1e293b" strokeWidth="1.3" />
                </svg>
                <span>Actor</span>
              </div>
            </div>
          </div>

          {/* Figure caption */}
          <p style={{ textAlign: "center", fontSize: "11pt", fontStyle: "italic", marginTop: "16px", color: "#334155" }}>
            Figure 1: Use Case Diagram of NutriTrack AI Health &amp; Fitness Application
          </p>
        </div>
      </div>
    </div>
  );
}
