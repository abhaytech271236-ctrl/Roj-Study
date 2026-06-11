import React from "react";
import { X, Printer, Calendar, ShieldCheck, Award } from "lucide-react";
import { Certificate } from "../types";

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

function getCertificateNarrative(courseId: string, courseName: string, isHtml: boolean = false): any {
  const cId = courseId || "";
  const cName = courseName || "";
  const normalizedName = cName.toLowerCase();

  if (cId === "internship-1" || normalizedName.includes("frontend")) {
    if (isHtml) {
      return `has successfully completed the <strong>${cName}</strong> course. This certified expert demonstrates direct technical competency in <strong>Frontend Web Development</strong> layouts, including high-impact responsive user interfaces (HTML5, CSS3, Flexbox, CSS Grid), browser scripting via interactive JavaScript, and component-triggered state views using React.js and modern state control hooks.`;
    }
    return (
      <>
        has successfully completed the <strong className="text-indigo-950 font-bold">{cName}</strong> course. This certified expert demonstrates direct technical competency in <strong className="text-slate-900 font-bold">Frontend Web Development</strong> layouts, including high-impact responsive user interfaces (HTML5, CSS3, Flexbox, CSS Grid), browser scripting via interactive JavaScript, and component-triggered state views using React.js and modern state control hooks.
      </>
    );
  }

  if (cId === "internship-2" || normalizedName.includes("backend")) {
    if (isHtml) {
      return `has successfully completed the <strong>${cName}</strong> course. This certified expert demonstrates direct technical competency in <strong>Backend Web Development</strong>, including robust routing engines, REST API schema designs (with Express.js & Node.js), modular MVC database controllers, password cryptography/hashing (Bcrypt), session cookie management, JSON Web Tokens (JWT), and secure databases with SQL and MongoDB.`;
    }
    return (
      <>
        has successfully completed the <strong className="text-indigo-950 font-bold">{cName}</strong> course. This certified expert demonstrates direct technical competency in <strong className="text-slate-900 font-bold">Backend Web Development</strong>, including robust routing engines, REST API schema designs (with Express.js & Node.js), modular MVC database controllers, password cryptography/hashing (Bcrypt), session cookie management, JSON Web Tokens (JWT), and secure databases with SQL and MongoDB.
      </>
    );
  }

  if (cId === "fullstack-project" || normalizedName.includes("full") || normalizedName.includes("mern")) {
    if (isHtml) {
      return `has successfully completed the <strong>${cName}</strong> course. This certified expert demonstrates direct technical competency in <strong>Fullstack Web Systems & MERN Architecture</strong>, uniting reactive user interfaces (React.js), high-performance controller routes (Express.js), secure datastore schema designs (MongoDB), real-time WebSockets, responsive geolocation booking/mapping, and Next.js production deployments.`;
    }
    return (
      <>
        has successfully completed the <strong className="text-indigo-950 font-bold">{cName}</strong> course. This certified expert demonstrates direct technical competency in <strong className="text-slate-900 font-bold">Fullstack Web Systems & MERN Architecture</strong>, uniting reactive user interfaces (React.js), high-performance controller routes (Express.js), secure datastore schema designs (MongoDB), real-time WebSockets, responsive geolocation booking/mapping, and Next.js production deployments.
      </>
    );
  }

  if (cId === "dsa-java" || normalizedName.includes("dsa") || normalizedName.includes("data structure") || normalizedName.includes("algorithm")) {
    if (isHtml) {
      return `has successfully completed the <strong>${cName}</strong> course. This certified expert demonstrates direct technical competency in <strong>Data Structures and Algorithms</strong> in Java. This includes mastering algorithmic complexity, binary searching, cycle sorting logic, recursive stacks, in-place list reversals, complex self-balancing trees (AVL, Segment Trees), hash-mapping, heaps, and backtracking solvers of FAANG/industry standards.`;
    }
    return (
      <>
        has successfully completed the <strong className="text-indigo-950 font-bold">{cName}</strong> course. This certified expert demonstrates direct technical competency in <strong className="text-slate-900 font-bold">Data Structures and Algorithms</strong> in Java. This includes mastering algorithmic complexity, binary searching, cycle sorting logic, recursive stacks, in-place list reversals, complex self-balancing trees (AVL, Segment Trees), hash-mapping, heaps, and backtracking solvers of FAANG/industry standards.
      </>
    );
  }

  if (cId === "generative-ai" || normalizedName.includes("ai") || normalizedName.includes("llm") || normalizedName.includes("generative")) {
    if (isHtml) {
      return `has successfully completed the <strong>${cName}</strong> course. This certified expert demonstrates direct technical competency in <strong>Generative AI & Large Language Model (LLM) Architectures</strong>, covering prompt engineering, Retrieval-Augmented Generation (RAG), Semantic Search integration via Vector Databases, autonomous agentic tool calling loops, and multi-agent development boards.`;
    }
    return (
      <>
        has successfully completed the <strong className="text-indigo-950 font-bold">{cName}</strong> course. This certified expert demonstrates direct technical competency in <strong className="text-slate-900 font-bold">Generative AI & Large Language Model (LLM) Architectures</strong>, covering prompt engineering, Retrieval-Augmented Generation (RAG), Semantic Search integration via Vector Databases, autonomous agentic tool calling loops, and multi-agent development boards.
      </>
    );
  }

  // Fallback
  if (isHtml) {
    return `has successfully completed the <strong>${cName}</strong> course offered by <strong>RojStudy</strong> (Learning Platform of <strong>RojTech</strong>). We appreciate your dedication and commitment in finishing the curriculum lessons, theoretical modules, and practical task implementations.`;
  }
  return (
    <>
      has successfully completed the <strong className="text-indigo-950 font-bold">{cName}</strong> course offered by <strong className="text-slate-900 font-bold">RojStudy</strong> (Learning Platform of <strong className="text-slate-900 font-bold">RojTech</strong>). We appreciate your dedication and commitment in finishing the curriculum lessons, theoretical modules, and practical task implementations.
    </>
  );
}

export default function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  
  // Format standard date
  const displayDate = certificate.date ? new Date(certificate.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "25 May 2026";

  // Compute a dynamic ID if it starts with CERT-ROJ
  let certId = certificate.id;
  if (!certId || certId.startsWith("CERT-ROJ")) {
    const courseAbbr = certificate.courseId ? certificate.courseId.slice(0, 3).toUpperCase() : "PY";
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    certId = `RS26${courseAbbr}${randomDigits}`;
  }

  // Choose a nice grade matching their score if available
  const displayGrade = certificate.grade || (certificate.score && certificate.score >= 45 ? "Outstanding" : certificate.score && certificate.score >= 38 ? "Excellent" : "Very Good");

  const handlePrint = () => {
    // Open a fresh window with highly optimized inline styles to match the precise, light-themed credentials card
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>RojStudy Certificate - ${certificate.courseName}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap');
              
              body {
                background: #f1f5f9;
                color: #0c1a30;
                font-family: "Inter", sans-serif;
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              .cert-canvas {
                width: 1000px;
                height: 700px;
                background: #fbfcff;
                border: 4px solid #b45309;
                padding: 4px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                position: relative;
                box-sizing: border-box;
                overflow: hidden;
              }
              .cert-inner {
                width: 100%;
                height: 100%;
                border: 2px solid #b45309;
                box-sizing: border-box;
                padding: 40px;
                position: relative;
                background: #fdfdfd;
              }
              
              /* Corner Sweeps */
              .corner-tl {
                position: absolute;
                top: -150px;
                left: -150px;
                width: 300px;
                height: 300px;
                background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
                transform: rotate(45deg);
                border-bottom: 8px solid #b45309;
                z-index: 5;
              }
              .corner-br {
                position: absolute;
                bottom: -150px;
                right: -150px;
                width: 300px;
                height: 300px;
                background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
                transform: rotate(45deg);
                border-top: 8px solid #b45309;
                z-index: 5;
              }

              /* Header layouts */
              .header-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                position: relative;
                z-index: 10;
              }
              .brand-tech {
                display: flex;
                align-items: center;
                gap: 10px;
                text-align: left;
              }
              .brand-study {
                display: flex;
                align-items: center;
                gap: 10px;
                text-align: right;
              }
              .brand-title {
                font-size: 26px;
                font-weight: 800;
                color: #0f172a;
                margin: 0;
                letter-spacing: -0.5px;
              }
              .brand-title span {
                color: #2563eb;
              }
              .brand-tagline {
                font-size: 8px;
                font-weight: bold;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: #64748b;
                margin: 3px 0 0 0;
              }

              .divider-gold {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin: 15px 0;
                color: #b45309;
                font-size: 14px;
              }
              .divider-line {
                width: 150px;
                height: 1px;
                background: linear-gradient(to right, transparent, #b45309, transparent);
              }

              .main-title {
                font-family: 'Playfair Display', serif;
                font-weight: 700;
                font-size: 44px;
                color: #1e3a8a;
                margin: 5px 0;
                letter-spacing: 2px;
                text-align: center;
              }
              .sub-title {
                font-family: 'Playfair Display', serif;
                font-size: 15px;
                font-weight: bold;
                letter-spacing: 6px;
                color: #b45309;
                margin: 0 0 10px 0;
                text-align: center;
              }

              .certify-text {
                font-family: 'Playfair Display', serif;
                font-style: italic;
                font-size: 14px;
                color: #475569;
                margin: 15px 0 5px 0;
                text-align: center;
              }

              .student-name {
                font-family: 'Alex Brush', cursive;
                font-size: 58px;
                color: #0c1a30;
                text-align: center;
                margin: 0 auto;
                line-height: 1.1;
                border-bottom: 1.5px solid #e2e8f0;
                width: 60%;
                padding-bottom: 2px;
              }

              .narrative {
                font-size: 12px;
                color: #334155;
                text-align: center;
                max-width: 520px;
                margin: 15px auto;
                line-height: 1.6;
              }
              .narrative strong {
                color: #0f172a;
              }

              .body-grid {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-top: 25px;
                position: relative;
                z-index: 10;
              }

              /* Left stats metadata columnar box */
              .meta-column {
                width: 250px;
                border-right: 1px solid #e2e8f0;
                padding-right: 20px;
                text-align: left;
              }
              .meta-item {
                margin-bottom: 11px;
                display: flex;
                gap: 12px;
                align-items: flex-start;
              }
              .meta-icon-sim {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                background: #e0f2fe;
                color: #0369a1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
              }
              .meta-label {
                font-size: 8px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #64748b;
                margin: 0;
              }
              .meta-val {
                font-size: 11px;
                font-weight: 700;
                color: #0f172a;
                margin: 1px 0 0 0;
              }

              .verify-block {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 15px;
                padding-top: 10px;
                border-t: 1px dashed #e2e8f0;
              }
              .qr-mock {
                width: 44px;
                height: 44px;
                background: #000;
                border: 2px solid #fff;
                display: flex;
                flex-wrap: wrap;
                p_padding: 2px;
              }
              .qr-pixel {
                width: 8px;
                height: 8px;
                background: #fff;
              }
              .qr-pixel.dark {
                background: #000;
              }

              /* Signatures areas */
              .signatures-row {
                display: flex;
                gap: 40px;
                justify-content: flex-end;
              }
              .sig-item {
                text-align: center;
                width: 140px;
              }
              .sig-handwritten {
                font-family: 'Alex Brush', cursive;
                font-size: 24px;
                color: #1e40af;
                margin-bottom: 2px;
                border-bottom: 1px solid #cbd5e1;
                padding-bottom: 4px;
              }
              .sig-title {
                font-size: 9px;
                font-weight: 500;
                color: #0f172a;
                margin: 2px 0 0 0;
              }
              .sig-subtitle {
                font-size: 7px;
                color: #64748b;
                margin: 1px 0 0 0;
              }

              /* Gold seal badge */
              .badge-gold {
                position: absolute;
                top: 140px;
                right: 40px;
                width: 110px;
                height: 110px;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10;
              }
              .badge-ribbon-1 {
                position: absolute;
                bottom: -40px;
                left: 35px;
                width: 20px;
                height: 60px;
                background: #1e3a8a;
                transform: rotate(15deg);
                clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%);
              }
              .badge-ribbon-2 {
                position: absolute;
                bottom: -40px;
                left: 55px;
                width: 20px;
                height: 60px;
                background: #1e3a8a;
                transform: rotate(-15deg);
                clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%);
              }
              .badge-circle {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: #fbbf24;
                border: 3px dashed #b45309;
                box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 4px;
                position: relative;
                z-index: 12;
              }
              .badge-text {
                font-size: 7px;
                font-weight: 900;
                color: #78350f;
                text-transform: uppercase;
                letter-spacing: 0.2px;
                line-height: 1.1;
              }

              /* Footer text row */
              .footer-bar {
                position: absolute;
                bottom: 12px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: center;
                gap: 40px;
                font-size: 8px;
                color: #64748b;
                z-index: 10;
              }

              @media print {
                body {
                  padding: 0;
                  background: #fff;
                }
                .cert-canvas {
                  box-shadow: none;
                  border: 5px solid #b45309;
                }
              }
            </style>
          </head>
          <body>
            <div class="cert-canvas">
              <div class="cert-inner">
                <div class="corner-tl"></div>
                <div class="corner-br"></div>
                
                {/* Gold seal */}
                <div class="badge-gold">
                  <div class="badge-ribbon-1"></div>
                  <div class="badge-ribbon-2"></div>
                  <div class="badge-circle">
                    <div class="badge-text">COMMITMENT TO QUALITY EDUCATION</div>
                  </div>
                </div>

                <div class="header-box">
                  <div class="brand-tech">
                    <div style="font-size: 26px; font-weight: 900; color: #1e3a8a; line-height: 1;">
                      <span style="color:#2563eb;">R</span> RojTech
                    </div>
                    <div class="brand-tagline">Empowering Skills, Building Future</div>
                  </div>
                  <div class="brand-study">
                    <div style="font-size: 26px; font-weight: 900; color: #1e3a8a; line-height: 1;">
                      🎓 RojStudy
                    </div>
                    <div class="brand-tagline">LEARN • PRACTICE • GROW</div>
                  </div>
                </div>

                <div class="divider-gold">
                  <div class="divider-line"></div>
                  <span>✦ ❖ ✦</span>
                  <div class="divider-line"></div>
                </div>

                <div class="main-title">CERTIFICATE</div>
                <div class="sub-title">OF COMPLETION</div>
                
                <div class="divider-gold" style="margin: 5px 0;">
                  <div class="divider-line" style="width: 80px;"></div>
                  <span style="font-size: 8px;">✦ ✦ ✦</span>
                  <div class="divider-line" style="width: 80px;"></div>
                </div>

                <div class="certify-text">This is to certify that</div>
                <div class="student-name">${certificate.studentName}</div>

                <div class="narrative">
                  ${getCertificateNarrative(certificate.courseId || "", certificate.courseName || "", true)}
                  <br /><br />
                  We appreciate your dedication and commitment. <strong>Keep learning, keep growing!</strong>
                </div>

                <div class="body-grid">
                  <div class="meta-column">
                    <div class="meta-item">
                      <div class="meta-icon-sim">📚</div>
                      <div>
                        <div class="meta-label">Course</div>
                        <div class="meta-val">${certificate.courseName}</div>
                      </div>
                    </div>
                    <div class="meta-item">
                      <div class="meta-icon-sim">📅</div>
                      <div>
                        <div class="meta-label">Date of Completion</div>
                        <div class="meta-val">${displayDate}</div>
                      </div>
                    </div>
                    <div class="meta-item">
                      <div class="meta-icon-sim">🔑</div>
                      <div>
                        <div class="meta-label">Certificate ID</div>
                        <div class="meta-val" style="font-family: monospace; font-size:10px; color:#2563eb; letter-spacing:0.5px;">${certId}</div>
                      </div>
                    </div>
                    <div class="meta-item" style="margin-bottom:0;">
                      <div class="meta-icon-sim">⭐</div>
                      <div>
                        <div class="meta-label">Grade</div>
                        <div class="meta-val" style="color: #10b981;">${displayGrade}</div>
                      </div>
                    </div>
                  </div>

                  <div class="signatures-row">
                    <div class="sig-item">
                      <div class="sig-handwritten" style="font-family:'Alex Brush', cursive;">Deepak</div>
                      <div class="sig-title">Deepak</div>
                      <div class="sig-subtitle">Co-founder</div>
                    </div>
                    <div class="sig-item">
                      <div class="sig-handwritten" style="font-family:'Alex Brush', cursive;">Abhay Kushwaha</div>
                      <div class="sig-title">Abhay Kushwaha</div>
                      <div class="sig-subtitle">Co-founder</div>
                    </div>
                  </div>
                </div>

                <div class="footer-bar">
                  <span>🌐 www.rojstudy.com</span>
                  <span>✉ support@rojstudy.com</span>
                  <span>🏢 RojTech Private Limited</span>
                </div>
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto cursor-pointer animate-in fade-in duration-200"
    >
      {/* Styles Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap');
        .cursive-handwritten {
          font-family: 'Alex Brush', cursive;
        }
        .serif-title {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>

      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl p-4 sm:p-6 my-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200 cursor-default"
      >
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-white/5 mb-5">
          <div className="flex items-center gap-2.5">
            <Award className="h-5 w-5 text-yellow-500 shrink-0 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Degree Credentials Certificate</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-[10px] sm:text-xs px-4.5 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-900/40 active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>DOWNLOAD / PRINT PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold text-[10px] sm:text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 border border-white/5 active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>CLOSE</span>
            </button>
          </div>
        </div>

        {/* Primary Certificate Frame */}
        <div className="w-full overflow-x-auto p-1 bg-slate-950/40 rounded-xl border border-white/5 relative">
          <div className="min-w-[760px] w-full aspect-[4/3] max-h-[570px] bg-[#fbfdff] text-[#0f172a] p-1 border-4 border-amber-700/80 rounded-lg relative overflow-hidden select-none">
            
            {/* Corner Decorative Assets */}
            {/* Top Left diagonal block */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-950 to-blue-900 rotate-45 border-b-4 border-amber-600/80" />
            {/* Bottom Right diagonal block */}
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-br from-indigo-950 to-blue-900 rotate-45 border-t-4 border-amber-600/80" />
            
            {/* Solid thin secondary inner boundary border */}
            <div className="absolute inset-2 border-2 border-amber-700/60 rounded p-6 flex flex-col justify-between">
              
              {/* TOP BRAND HEADS ROW */}
              <div className="flex justify-between items-center relative z-10">
                {/* Left brand RojTech */}
                <div className="text-left font-sans">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                    <span className="text-blue-600 font-extrabold text-lg">R</span> RojTech
                  </h3>
                  <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-wider block">Empowering Skills, Building Future</span>
                </div>

                {/* Right brand RojStudy */}
                <div className="text-right font-sans">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 justify-end">
                    <span>🎓</span> RojStudy
                  </h3>
                  <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-wider block">LEARN • PRACTICE • GROW</span>
                </div>
              </div>

              {/* CENTER DISPLAY ORNAMENT & TITLES */}
              <div className="flex flex-col items-center justify-center relative z-10 -mt-1">
                
                {/* Gold floral separator line */}
                <div className="flex items-center gap-3 w-1/3 my-2 text-amber-700">
                  <div className="flex-1 h-[0.5px] bg-gradient-to-r from-transparent to-amber-700" />
                  <span className="text-[9px]">✦ ❖ ✦</span>
                  <div className="flex-1 h-[0.5px] bg-gradient-to-l from-transparent to-amber-700" />
                </div>

                <h1 className="serif-title font-black text-4xl sm:text-[45px] text-blue-950 tracking-[3px] select-none text-center">
                  CERTIFICATE
                </h1>
                <h3 className="serif-title font-extrabold text-[12px] sm:text-[13px] text-amber-700 tracking-[6px] select-none text-center mt-1">
                  OF COMPLETION
                </h3>

                {/* Gold separator line minor */}
                <div className="flex items-center gap-2 w-1/4 my-2 text-amber-700">
                  <div className="flex-1 h-[0.5px] bg-gradient-to-r from-transparent to-amber-700" />
                  <span className="text-[7px]">✦ ✦ ✦</span>
                  <div className="flex-1 h-[0.5px] bg-gradient-to-l from-transparent to-amber-700" />
                </div>

                <p className="font-sans italic text-slate-500 text-[11px] sm:text-[12px] mt-2 mb-1.5">
                  This is to certify that
                </p>

                {/* Student Name */}
                <div className="text-center w-full px-8">
                  <h2 className="cursive-handwritten text-4xl sm:text-[50px] font-semibold text-slate-900 leading-none select-text py-1 border-b border-slate-200 inline-block w-2/3 mx-auto max-w-[400px]">
                    {certificate.studentName}
                  </h2>
                </div>

                {/* Paragraph */}
                <p className="text-[10px] sm:text-[10.5px] text-slate-600 text-center max-w-[520px] mt-4 leading-relaxed">
                  {getCertificateNarrative(certificate.courseId || "", certificate.courseName || "", false)}
                  <span className="block font-semibold text-amber-700 mt-1.5">Keep learning, keep growing!</span>
                </p>
              </div>

              {/* BOTTOM INFORMATION BLOCK */}
              <div className="grid grid-cols-12 items-end pt-4 border-t border-slate-100 relative z-10">
                
                {/* Left col stats: Course, Date, Cert ID, Grade */}
                <div className="col-span-6 text-left border-r border-slate-100 pr-4 mt-1 flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <span className="text-[8px]">📚</span>
                    </div>
                    <div>
                      <span className="block text-[7px] text-slate-400 uppercase tracking-wider font-bold">COURSE</span>
                      <span className="text-[9px] font-bold text-slate-800 leading-none block">{certificate.courseName}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <span className="text-[8px]">📅</span>
                    </div>
                    <div>
                      <span className="block text-[7px] text-slate-400 uppercase tracking-wider font-bold">DATE OF COMPLETION</span>
                      <span className="text-[9px] font-bold text-slate-800 leading-none block">{displayDate}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <span className="text-[8px]">🔑</span>
                    </div>
                    <div>
                      <span className="block text-[7px] text-slate-400 uppercase tracking-wider font-bold">CERTIFICATE ID</span>
                      <span className="text-[9px] font-mono font-bold text-blue-600 leading-none block uppercase">{certId}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-amber-500 font-bold text-[8px]">
                      ★
                    </div>
                    <div>
                      <span className="block text-[7px] text-slate-400 uppercase tracking-wider font-bold">GRADE DECLARED</span>
                      <span className="text-[9.5px] font-bold text-emerald-600 leading-none block">{displayGrade}</span>
                    </div>
                  </div>
                </div>

                {/* Right col: Co-founders Signature block */}
                <div className="col-span-6 flex justify-end items-end gap-10">
                  
                  {/* Co founder 1 */}
                  <div className="text-center w-28">
                    <div className="cursive-handwritten text-xl text-blue-800 font-medium select-none h-6 flex items-end justify-center border-b border-slate-200">
                      Deepak
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-800 block mt-1">Deepak</span>
                    <span className="text-[6.5px] text-slate-400 block font-medium">Co-founder</span>
                  </div>

                  {/* Co founder 2 */}
                  <div className="text-center w-28">
                    <div className="cursive-handwritten text-xl text-blue-800 font-medium select-none h-6 flex items-end justify-center border-b border-slate-200">
                      Abhay Kushwaha
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-800 block mt-1">Abhay Kushwaha</span>
                    <span className="text-[6.5px] text-slate-400 block font-medium">Co-founder</span>
                  </div>

                </div>
              </div>

              {/* Bottom minor metadata fields */}
              <div className="flex justify-center items-center gap-8 text-[7.5px] text-slate-400 font-sans absolute bottom-1.5 left-0 right-0 z-10 w-full select-none mt-2">
                <span>🌐 www.rojstudy.com</span>
                <span>✉ support@rojstudy.com</span>
                <span>🏢 RojTech Private Limited</span>
              </div>

              {/* GOLD SEALS EMBLEM DECORATOR */}
              {/* Gold badge seal */}
              <div className="absolute top-[85px] right-[25px] w-24 h-24 flex items-center justify-center">
                
                {/* Ribbons */}
                <div className="absolute bottom-[-16px] left-[32px] w-4.5 h-12 bg-blue-900/90 rotate-[12deg] clip-path-sim" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)" }} />
                <div className="absolute bottom-[-16px] left-[46px] w-4.5 h-12 bg-blue-900/90 rotate-[-12deg] clip-path-sim" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)" }} />
                
                {/* Circle badg */}
                <div className="w-[66px] h-[66px] rounded-full bg-amber-400 border-[2.2px] border-amber-700/80 shadow-md shadow-amber-950/20 flex flex-col items-center justify-center p-1 z-10 relative">
                  <span className="text-[4px] font-sans text-amber-950 font-black tracking-widest text-center uppercase leading-[1.0] select-none block">
                    COMMITMENT TO QUALITY EDUCATION
                  </span>
                  <div className="text-[5px] text-amber-900 mt-0.5">★★★★★</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Verification info bar and download instruction guide */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-950 rounded-xl p-3 border border-white/5 text-left flex gap-3">
            <div className="text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h5 className="text-[10px] sm:text-xs font-semibold text-slate-200 font-mono">Academic credential verified</h5>
              <p className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed font-mono mt-0.5">
                This digital certificate has been vetted and officially registered in the RojStudy Alumni Index. Verify its cryptographically signed authenticity utilizing Certificate ID above.
              </p>
            </div>
          </div>

          <div className="bg-indigo-950/25 rounded-xl p-3 border border-indigo-500/10 text-left flex gap-3">
            <div className="text-cyan-400 shrink-0 mt-0.5 font-mono text-xs">
              💡
            </div>
            <div>
              <h5 className="text-[10px] sm:text-xs font-semibold text-cyan-400 font-mono uppercase tracking-wider">How to Download as PDF:</h5>
              <p className="text-[9px] sm:text-[10px] text-slate-300 leading-relaxed font-sans mt-0.5">
                Click <strong className="text-white">DOWNLOAD / PRINT PDF</strong> above. In the window, select <strong className="text-emerald-400 font-semibold">"Save as PDF"</strong> as Destination, then hit Save. You can close this certificate anytime by clicking anywhere on the dark background!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
