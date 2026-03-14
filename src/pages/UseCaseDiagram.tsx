import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const actors = [
  { id: "user", label: "User", x: 60, y: 340 },
  { id: "admin", label: "Admin", x: 60, y: 620 },
  { id: "ai", label: "AI System", x: 940, y: 340 },
  { id: "weather", label: "Weather API", x: 940, y: 560 },
];

const useCases = [
  // Auth
  { id: "uc1", label: "Register Account", x: 340, y: 60, group: "auth" },
  { id: "uc2", label: "Login / Logout", x: 540, y: 60, group: "auth" },
  { id: "uc3", label: "Verify Email", x: 740, y: 60, group: "auth" },

  // Meal Tracking
  { id: "uc4", label: "Log Meal Manually", x: 340, y: 180, group: "meal" },
  { id: "uc5", label: "Upload Meal Photo", x: 540, y: 180, group: "meal" },
  { id: "uc6", label: "Analyze Meal via AI", x: 740, y: 200, group: "meal" },
  { id: "uc7", label: "Delete Meal Entry", x: 340, y: 250, group: "meal" },

  // Nutrition & AI
  { id: "uc8", label: "Get AI Meal\nSuggestions", x: 540, y: 300, group: "nutrition" },
  { id: "uc9", label: "View Recipe Details", x: 740, y: 320, group: "nutrition" },
  { id: "uc10", label: "Get Nutrition\nInsights", x: 540, y: 380, group: "nutrition" },

  // Tracking
  { id: "uc11", label: "Track Water Intake", x: 340, y: 380, group: "tracking" },
  { id: "uc12", label: "Log Weight", x: 340, y: 460, group: "tracking" },
  { id: "uc13", label: "View Macro Progress", x: 540, y: 460, group: "tracking" },
  { id: "uc14", label: "Track Streak", x: 740, y: 440, group: "tracking" },

  // Progress
  { id: "uc15", label: "Upload Progress\nPhoto", x: 340, y: 540, group: "progress" },
  { id: "uc16", label: "Compare Progress\nPhotos", x: 540, y: 540, group: "progress" },
  { id: "uc17", label: "View Weight Chart", x: 740, y: 540, group: "progress" },

  // Groups
  { id: "uc18", label: "Create / Join Group", x: 340, y: 640, group: "groups" },
  { id: "uc19", label: "Create Challenge", x: 540, y: 640, group: "groups" },
  { id: "uc20", label: "Check-in Challenge", x: 740, y: 640, group: "groups" },

  // Profile & Settings
  { id: "uc21", label: "Edit Profile &\nTargets", x: 340, y: 740, group: "profile" },
  { id: "uc22", label: "Toggle Dark/Light\nTheme", x: 540, y: 740, group: "profile" },
  { id: "uc23", label: "View Weather Info", x: 740, y: 740, group: "profile" },
];

const associations: [string, string][] = [
  // User associations
  ["user", "uc1"], ["user", "uc2"], ["user", "uc4"], ["user", "uc5"],
  ["user", "uc7"], ["user", "uc8"], ["user", "uc10"], ["user", "uc11"],
  ["user", "uc12"], ["user", "uc13"], ["user", "uc15"], ["user", "uc16"],
  ["user", "uc17"], ["user", "uc18"], ["user", "uc19"], ["user", "uc20"],
  ["user", "uc21"], ["user", "uc22"], ["user", "uc23"],
  // Admin
  ["admin", "uc18"], ["admin", "uc19"],
  // AI System
  ["ai", "uc6"], ["ai", "uc8"], ["ai", "uc9"], ["ai", "uc10"],
  // Weather
  ["weather", "uc23"],
];

const includes: [string, string][] = [
  ["uc5", "uc6"], // Upload photo includes AI analysis
  ["uc8", "uc9"], // Suggestions include recipe details
];

const extends_: [string, string][] = [
  ["uc3", "uc1"], // Verify email extends register
  ["uc14", "uc4"], // Streak tracking extends meal logging
];

function StickFigure({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 28} r={10} fill="none" stroke="#334155" strokeWidth="2" />
      <line x1={x} y1={y - 18} x2={x} y2={y + 5} stroke="#334155" strokeWidth="2" />
      <line x1={x - 14} y1={y - 8} x2={x + 14} y2={y - 8} stroke="#334155" strokeWidth="2" />
      <line x1={x} y1={y + 5} x2={x - 12} y2={y + 25} stroke="#334155" strokeWidth="2" />
      <line x1={x} y1={y + 5} x2={x + 12} y2={y + 25} stroke="#334155" strokeWidth="2" />
      <text x={x} y={y + 42} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e293b" fontFamily="'Times New Roman', serif">
        {label}
      </text>
    </g>
  );
}

function UseCaseEllipse({ x, y, label }: { x: number; y: number; label: string }) {
  const lines = label.split("\n");
  return (
    <g>
      <ellipse cx={x} cy={y} rx={80} ry={28} fill="#f0f9ff" stroke="#3b82f6" strokeWidth="1.5" />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x}
          y={y + (i - (lines.length - 1) / 2) * 13}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fontFamily="'Times New Roman', serif"
          fill="#1e293b"
          fontWeight="500"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function AssociationLine({ from, to }: { from: { x: number; y: number }; to: { x: number; y: number } }) {
  return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#64748b" strokeWidth="1" />;
}

function DashedArrow({ from, to, label }: { from: { x: number; y: number }; to: { x: number; y: number }; label: string }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const angle = Math.atan2(dy, dx);
  const arrowX = to.x - (dx / len) * 28;
  const arrowY = to.y - (dy / len) * 28;

  return (
    <g>
      <line x1={from.x} y1={from.y} x2={arrowX} y2={arrowY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="6,3" />
      <polygon
        points={`${arrowX},${arrowY} ${arrowX - 8 * Math.cos(angle - 0.4)},${arrowY - 8 * Math.sin(angle - 0.4)} ${arrowX - 8 * Math.cos(angle + 0.4)},${arrowY - 8 * Math.sin(angle + 0.4)}`}
        fill="#94a3b8"
      />
      <text x={mx} y={my - 6} textAnchor="middle" fontSize="9" fontStyle="italic" fill="#64748b" fontFamily="'Times New Roman', serif">
        {label}
      </text>
    </g>
  );
}

export default function UseCaseDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getPos = useCallback((id: string) => {
    const actor = actors.find((a) => a.id === id);
    if (actor) return { x: actor.x, y: actor.y };
    const uc = useCases.find((u) => u.id === id);
    if (uc) return { x: uc.x, y: uc.y };
    return { x: 0, y: 0 };
  }, []);

  const handleDownload = async () => {
    if (!diagramRef.current) return;
    const canvas = await html2canvas(diagramRef.current, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save("NutriTrack-Use-Case-Diagram.pdf");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" /> Download as PDF
          </Button>
        </div>

        <div ref={diagramRef} className="bg-white p-8 border border-gray-200 rounded">
          {/* Title */}
          <div className="text-center mb-2">
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Times New Roman', serif" }}>
              Use Case Diagram — NutriTrack AI Health & Fitness Application
            </h1>
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Times New Roman', serif" }}>
              Department of Computer Science & Engineering, Leading University, Sylhet
            </p>
            <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "'Times New Roman', serif" }}>
              Emon Ahmed (0182320012101356) · MD Rayhan Akhand (0182320012101320) · Md Sams Uddin Emon (0182310012101144)
            </p>
          </div>

          <svg viewBox="0 0 1000 820" className="w-full" style={{ fontFamily: "'Times New Roman', serif" }}>
            {/* System boundary */}
            <rect x="200" y="30" width="680" height="740" rx="12" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="8,4" />
            <text x="540" y="22" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b" fontFamily="'Times New Roman', serif">
              NutriTrack AI System
            </text>

            {/* Group labels */}
            <text x="220" y="78" fontSize="9" fill="#6366f1" fontWeight="700" fontFamily="'Times New Roman', serif">Authentication</text>
            <text x="220" y="195" fontSize="9" fill="#059669" fontWeight="700" fontFamily="'Times New Roman', serif">Meal Tracking</text>
            <text x="220" y="315" fontSize="9" fill="#d97706" fontWeight="700" fontFamily="'Times New Roman', serif">Nutrition & AI</text>
            <text x="220" y="395" fontSize="9" fill="#dc2626" fontWeight="700" fontFamily="'Times New Roman', serif">Health Tracking</text>
            <text x="220" y="555" fontSize="9" fill="#7c3aed" fontWeight="700" fontFamily="'Times New Roman', serif">Progress</text>
            <text x="220" y="655" fontSize="9" fill="#0891b2" fontWeight="700" fontFamily="'Times New Roman', serif">Groups & Challenges</text>
            <text x="220" y="755" fontSize="9" fill="#be185d" fontWeight="700" fontFamily="'Times New Roman', serif">Profile & Settings</text>

            {/* Associations */}
            {associations.map(([fromId, toId], i) => (
              <AssociationLine key={i} from={getPos(fromId)} to={getPos(toId)} />
            ))}

            {/* Include relationships */}
            {includes.map(([fromId, toId], i) => (
              <DashedArrow key={`inc-${i}`} from={getPos(fromId)} to={getPos(toId)} label="«include»" />
            ))}

            {/* Extend relationships */}
            {extends_.map(([fromId, toId], i) => (
              <DashedArrow key={`ext-${i}`} from={getPos(fromId)} to={getPos(toId)} label="«extend»" />
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
          <div className="flex items-center justify-center gap-8 mt-4 text-xs text-gray-600" style={{ fontFamily: "'Times New Roman', serif" }}>
            <div className="flex items-center gap-2">
              <svg width="30" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke="#64748b" strokeWidth="1.5" /></svg>
              <span>Association</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="40" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" /><polygon points="30,5 24,2 24,8" fill="#94a3b8" /></svg>
              <span>«include» / «extend»</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="16"><ellipse cx="10" cy="8" rx="10" ry="7" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="1" /></svg>
              <span>Use Case</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
