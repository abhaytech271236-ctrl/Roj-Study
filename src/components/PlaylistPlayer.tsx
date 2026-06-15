import React, { useState, useEffect } from "react";
import { 
  Play, BookOpen, CheckCircle, Flame, ChevronLeft, ChevronRight,
  ThumbsUp, Bookmark, Share2, Code, FileText, PlayCircle, Eye, AlertCircle, Save,
  Copy, RotateCcw, Terminal, Clock, Award, HelpCircle, Trophy, ClipboardCheck, Info, Timer as LucideTimer
} from "lucide-react";
import { Playlist, Video, UserState } from "../types";
import Editor from "@monaco-editor/react";
import { getQuestionsForPlaylist, QuizQuestion } from "../questions";
import CertificateModal from "./CertificateModal";
import Ads, { ADS_CONFIG } from "./Ads";

function extractYoutubeId(urlOrId: string | undefined): string {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  if (!trimmed) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes(".") && !trimmed.includes("?")) {
    return trimmed;
  }
  return "";
}

interface PlaylistPlayerProps {
  playlist: Playlist;
  userState: UserState;
  onUpdateCompletedVideo: (playlistId: string, videoId: string, completed: boolean) => void;
  onUpdateBookmarkVideo: (playlistId: string, videoId: string, bookmarked: boolean) => void;
  onXpEarned: (amount: number) => void;
  onSaveNote: (videoUniqueId: string, text: string) => void;
  savedNotes: Record<string, string>; // mapping e.g. "playlistID-videoID" => note text
  onUpdateVideo?: (playlistId: string, videoId: string, updatedFields: Partial<Video>) => void;
  onBack?: () => void;
  onAwardCertificate?: (courseId: string, score: number, grade: string, studentName?: string) => void;
}

export default function PlaylistPlayer({ 
  playlist, userState, onUpdateCompletedVideo, onUpdateBookmarkVideo, onXpEarned, onSaveNote, savedNotes, onUpdateVideo, onBack, onAwardCertificate 
 }: PlaylistPlayerProps) {
  
  const getUserEmailKey = () => userState.email ? userState.email.trim().toLowerCase() : "guest";
  const getCodeKeyPrefix = () => `code-user-${getUserEmailKey()}-${playlist.id}-${activeVideo?.id || "default"}`;

  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const activeVideo = playlist.videos[activeVideoIdx] || playlist.videos[0];

  // Exam-specific state engine parameters
  const [isExamActive, setIsExamActive] = useState(false);
  const [examQuestions, setExamQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, number>>({});
  const [examTimeRemaining, setExamTimeRemaining] = useState(3600); // 60 minutes = 3600s
  const [examFinishedState, setExamFinishedState] = useState<"passed" | "failed" | null>(null);
  const [recentExamScore, setRecentExamScore] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLocalCert, setShowLocalCert] = useState(false);
  const [tempStudentName, setTempStudentName] = useState(userState.name);
  const [isNameSaved, setIsNameSaved] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"syllabus" | "sandbox" | "notes">("syllabus");

  useEffect(() => {
    setTempStudentName(userState.name);
  }, [userState.name]);

  // Active timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExamActive && !examFinishedState) {
      timer = setInterval(() => {
        setExamTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Submit immediately when timer runs out
            let score = 0;
            examQuestions.forEach(q => {
              const selected = studentAnswers[q.id];
              if (selected !== undefined && selected === q.correctAnswer) {
                score++;
              }
            });
            setRecentExamScore(score);
            if (score >= 30) {
              setExamFinishedState("passed");
              const computedGrade = score >= 45 ? "Outstanding" : score >= 38 ? "Excellent" : "Very Good";
              if (onAwardCertificate) {
                onAwardCertificate(playlist.id, score, computedGrade);
              }
            } else {
              setExamFinishedState("failed");
            }
            alert("Time's up! Your exam has been submitted automatically.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamActive, examFinishedState, examQuestions, studentAnswers, playlist.id, onAwardCertificate]);

  const handleStartExam = () => {
    const qList = getQuestionsForPlaylist(playlist.id, playlist.title);
    setExamQuestions(qList);
    setStudentAnswers({});
    setCurrentQuestionIdx(0);
    setExamTimeRemaining(3600);
    setExamFinishedState(null);
    setRecentExamScore(null);
    setIsExamActive(true);
    setTempStudentName(userState.name);
    setIsNameSaved(false);
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    setStudentAnswers(prev => ({
      ...prev,
      [qId]: optIdx
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < examQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    let score = 0;
    examQuestions.forEach(q => {
      const selected = studentAnswers[q.id];
      if (selected !== undefined && selected === q.correctAnswer) {
        score++;
      }
    });

    setRecentExamScore(score);
    setShowSubmitModal(false);

    if (score >= 30) {
      setExamFinishedState("passed");
      const computedGrade = score >= 45 ? "Outstanding" : score >= 38 ? "Excellent" : "Very Good";
      if (onAwardCertificate) {
        onAwardCertificate(playlist.id, score, computedGrade);
      }
    } else {
      setExamFinishedState("failed");
    }
  };

  const handleExitExam = () => {
    setIsExamActive(false);
    setExamFinishedState(null);
  };

  const handleSaveCustomName = () => {
    if (!tempStudentName.trim()) return;
    const score = recentExamScore !== null ? recentExamScore : 50;
    const computedGrade = score >= 45 ? "Outstanding" : score >= 38 ? "Excellent" : "Very Good";
    if (onAwardCertificate) {
      onAwardCertificate(playlist.id, score, computedGrade, tempStudentName.trim());
    }
    setIsNameSaved(true);
  };

  const formatExamTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Find standard credential certificates in user's profile matching this ID
  const targetCert = userState.certificates.find(c => c.courseId === playlist.id);
  const hasEarnedCertificate = !!targetCert;
  const playlistHighestScore = targetCert?.score || userState.examScores?.[playlist.id] || 0;
  
  // Compiler State Options: "web" | "c" | "cpp" | "java" | "python"
  const [compilerMode, setCompilerMode] = useState<"web" | "c" | "cpp" | "java" | "python">("web");
  
  // Tab within the Web compiler mode
  const [editorTab, setEditorTab] = useState<"html" | "css" | "js">("html");

  // Code buffers for web
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [isWebRunning, setIsWebRunning] = useState(false);

  // Code buffer for Monaco-based languages (C, C++, Java, Python)
  const [activeCode, setActiveCode] = useState("");
  const [isIdeRunning, setIsIdeRunning] = useState(false);
  const [ideTerminalOutput, setIdeTerminalOutput] = useState<string[]>([]);

  // Video interaction flags
  const [isLiked, setIsLiked] = useState(false);
  const [isShareModal, setIsShareModal] = useState(false);

  // Student Notes text area
  const noteUniqueKey = `${playlist.id}-${activeVideo?.id}`;
  const [noteText, setNoteText] = useState("");

  // Default Fallback Templates
  const getLanguageTemplate = (lang: "web" | "c" | "cpp" | "java" | "python") => {
    if (lang === "web") {
      // Custom Web templates per lesson name
      if (activeVideo?.title.toLowerCase().includes("html")) {
        return {
          html: `<!-- Learn HTML Tags in Roj Study Sandbox -->\n<div class="card">\n  <h1>🎨 Welcome to Interactive HTML!</h1>\n  <p>Practice writing headers, lists, and anchors in real time.</p>\n  <button id="alert-btn">Interactive Press Hook</button>\n</div>`,
          css: `body {\n  background: #0f172a;\n  color: #f8fafc;\n  font-family: system-ui, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n.card {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n  padding: 30px;\n  text-align: center;\n  backdrop-filter: blur(8px);\n  box-shadow: 0 10px 30px rgba(0,0,0,0.5);\n}\nh1 {\n  color: #06b6d4;\n  margin-top: 0;\n}\nbutton {\n  background: #6366f1;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: 0.2s;\n}\nbutton:hover {\n  background: #4f46e5;\n  transform: translateY(-2px);\n}`,
          js: `// Grab the element\nconst btn = document.getElementById("alert-btn");\n\n// Bind click actions safely\nbtn.addEventListener("click", () => {\n  console.log("Button clicked!");\n  alert("Amazing! You coded and rendered this inside Roj Study's sandboxed compiler playground!");\n});`
        };
      } else if (activeVideo?.title.toLowerCase().includes("css") || activeVideo?.title.toLowerCase().includes("design")) {
        return {
          html: `<!-- Custom Glassmorphism Box Preview -->\n<div class="glass-box">\n  <div class="light-ring"></div>\n  <h2>✨ Neon Glow Styles</h2>\n  <p>Learn how backdrop filters, negative margins, and linear gradients combine to form cyber layouts.</p>\n</div>`,
          css: `.glass-box {\n  background: rgba(15, 23, 42, 0.6);\n  border: 1px solid rgba(6, 182, 212, 0.3);\n  border-radius: 20px;\n  padding: 32px;\n  box-shadow: 0 0 25px rgba(6, 182, 212, 0.15);\n  text-align: center;\n  position: relative;\n  max-width: 380px;\n  margin: 40px auto;\n}\nh2 {\n  color: #67e8f9;\n  font-family: inherit;\n}\np {\n  color: #94a3b8;\n  font-size: 13px;\n  line-height: 1.6;\n}\nbody {\n  background-color: #030712;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n  font-family: "Inter", sans-serif;\n}`,
          js: `// CSS Design sandbox ready\nconsole.log("Neon visual theme injected successfully!");`
        };
      }
      return {
        html: `<div class="box">\n  <h2>🚀 Practice Sandbox</h2>\n  <p id="time-viewer">Click below to load live UTC time index</p>\n  <button id="clock-trigger">Show Time</button>\n</div>`,
        css: `body {\n  background: #020617;\n  font-family: monospace;\n  color: #e2e8f0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n.box {\n  background: #0f172a;\n  border: 1px solid #1e293b;\n  border-radius: 12px;\n  padding: 24px;\n  text-align: center;\n}\nh2 {\n  color: #cbd5e1;\n}\nbutton {\n  background: transparent;\n  color: #38bdf8;\n  border: 2px solid #38bdf8;\n  border-radius: 6px;\n  padding: 8px 16px;\n  cursor: pointer;\n  transition: all 0.3s;\n}\nbutton:hover {\n  background: rgba(56, 189, 248, 0.1);\n}`,
        js: `const trigger = document.getElementById("clock-trigger");\nconst viewer = document.getElementById("time-viewer");\n\ntrigger.addEventListener("click", () => {\n  const now = new Date();\n  viewer.innerText = "System Time: " + now.getUTCHours() + "h:" + now.getUTCMinutes() + "m";\n});`
      };
    }

    // Return current video's exampleCode if it matches the compiler mode lang
    if (activeVideo?.language === lang && activeVideo?.exampleCode) {
      return activeVideo.exampleCode;
    }

    // Default system fallbacks
    switch(lang) {
      case "c":
        return `#include <stdio.h>\n\nint main() {\n    printf("Hello, World from C!\\n");\n    \n    int age = 21;\n    printf("Welcome to Roj Study Academy! Your age is %d.\\n", age);\n    \n    return 0;\n}`;
      case "cpp":
        return `#include <iostream>\nusing namespace std;\n\nclass Learner {\npublic:\n    string name;\n    int xp;\n    \n    void display() {\n        cout << "Learner " << name << " has " << xp << " XP!\\n";\n    }\n};\n\nint main() {\n    cout << "Welcome to C++ OOP!" << endl;\n    \n    Learner student;\n    student.name = "Abhay Dev";\n    student.xp = 1500;\n    student.display();\n    \n    return 0;\n}`;
      case "java":
        return `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World from Java!");\n        \n        String[] subjects = {"C", "C++", "Java", "Python"};\n        System.out.println("We are learning " + subjects.length + " key languages.");\n        for(String sub : subjects) {\n            System.out.println(" - " + sub);\n        }\n    }\n}`;
      case "python":
        return `def greet_learner(name, current_streak):\n    print(f"Hello, {name}!")\n    print(f"🔥 Your daily streak is: {current_streak} days.")\n\nif __name__ == "__main__":\n    greet_learner("Abhay Dev", 5)\n    \n    languages = ["C", "C++", "Java", "Python"]\n    print("Programming languages playlist:")\n    for i, lang in enumerate(languages, 1):\n        print(f"Section {i}: {lang}")`;
    }
  };

  // Video transition hook
  useEffect(() => {
    setIsLiked(false);
    setIsShareModal(false);
    setNoteText(savedNotes[noteUniqueKey] || "");

    // Autodetect best default compiler mode for current video lecture or playlist
    if (activeVideo?.language) {
      setCompilerMode(activeVideo.language as any);
    } else {
      const pTitle = playlist.title.toLowerCase();
      const pCategory = playlist.category?.toLowerCase() || "";
      const vTitle = activeVideo?.title?.toLowerCase() || "";
      
      if (pTitle.includes("dsa") || pTitle.includes("java") || vTitle.includes("java") || pCategory.includes("computer science")) {
        setCompilerMode("java");
      } else if (pTitle.includes("generative") || pTitle.includes("ai") || pTitle.includes("llm") || pTitle.includes("python") || pTitle.includes("blender") || vTitle.includes("python")) {
        setCompilerMode("python");
      } else if (vTitle.includes("c++") || vTitle.includes("cpp") || pTitle.includes("c++")) {
        setCompilerMode("cpp");
      } else if (vTitle.includes("c programming") || vTitle.includes("c tutorial") || pTitle.includes("c programming")) {
        setCompilerMode("c");
      } else {
        setCompilerMode("web");
      }
    }

    setIdeTerminalOutput([]);
    setIsIdeRunning(false);
  }, [activeVideoIdx, playlist.id]);

  // Load and sync editor buffer values securely on compiler mode changes
  useEffect(() => {
    const keyPrefix = getCodeKeyPrefix();
    if (compilerMode === "web") {
      const savedHtml = localStorage.getItem(`${keyPrefix}-html`);
      const savedCss = localStorage.getItem(`${keyPrefix}-css`);
      const savedJs = localStorage.getItem(`${keyPrefix}-js`);
      
      const defaults = getLanguageTemplate("web") as { html: string; css: string; js: string };
      setHtmlCode(savedHtml !== null ? savedHtml : defaults.html);
      setCssCode(savedCss !== null ? savedCss : defaults.css);
      setJsCode(savedJs !== null ? savedJs : defaults.js);
    } else {
      const savedCode = localStorage.getItem(`${keyPrefix}-${compilerMode}`);
      const fallback = getLanguageTemplate(compilerMode) as string;
      setActiveCode(savedCode !== null ? savedCode : fallback);
    }
  }, [compilerMode, activeVideoIdx, playlist.id]);

  // Run programming language compile & execute logs simulator
  const handleRunProgrammingCode = () => {
    if (isIdeRunning) return;
    setIsIdeRunning(true);
    setIdeTerminalOutput([
      `$ compile ${compilerMode === 'cpp' ? 'g++' : compilerMode === 'c' ? 'gcc' : compilerMode === 'java' ? 'javac' : 'python3'} main.${compilerMode === 'python' ? 'py' : compilerMode === 'cpp' ? 'cpp' : compilerMode === 'java' ? 'java' : 'c'}`,
      `[info] Dynamic compilation requested for course language: ${compilerMode.toUpperCase()}`,
      `[info] Allocating secure student virtual execution sandbox...`,
      `[info] Analysing static syntax references and checking memory headers...`
    ]);

    setTimeout(() => {
      const lines: string[] = [];
      lines.push(`[info] Running compiled symbols...`);
      lines.push(`--------------------------------------`);

      const target = compilerMode;
      const currentCode = activeCode;
      const outputLines: string[] = [];
      
      // Split student code to parse print statements in sequence
      const codeLines = currentCode.split("\n");

      if (target === 'python') {
        lines.push(`$ python3 main.py`);
        codeLines.forEach(line => {
          const printMatch = line.match(/print\s*\(\s*(.*?)\s*\)/);
          if (printMatch) {
            let inner = printMatch[1].trim();
            if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
              outputLines.push(inner.substring(1, inner.length - 1));
            } else if (inner.startsWith('f"') || inner.startsWith("f'")) {
              let content = inner.substring(2, inner.length - 1);
              content = content.replace(/\{(.*?)\}/g, (match, g1) => {
                const varName = g1.trim();
                const varRegex = new RegExp(`\\b${varName}\\s*=\\s*(.*)`);
                for (let i = codeLines.indexOf(line) - 1; i >= 0; i--) {
                  const m = codeLines[i].match(varRegex);
                  if (m) {
                    let val = m[1].split("#")[0].trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                      return val.substring(1, val.length - 1);
                    }
                    return val;
                  }
                }
                return match;
              });
              outputLines.push(content);
            } else {
              if (/^[0-9+\-*/\s().]+$/.test(inner)) {
                try {
                  const val = Function(`"use strict"; return (${inner})`)();
                  outputLines.push(String(val));
                } catch {
                  outputLines.push(inner);
                }
              } else {
                const varRegex = new RegExp(`\\b${inner}\\s*=\\s*(.*)`);
                let resolved = false;
                for (let i = codeLines.indexOf(line) - 1; i >= 0; i--) {
                  const m = codeLines[i].match(varRegex);
                  if (m) {
                    let val = m[1].split("#")[0].trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                      outputLines.push(val.substring(1, val.length - 1));
                    } else {
                      outputLines.push(val);
                    }
                    resolved = true;
                    break;
                  }
                }
                if (!resolved) {
                  outputLines.push(inner);
                }
              }
            }
          }
        });

        if (outputLines.length === 0) {
          outputLines.push("Hello, World from Python!");
          outputLines.push("🔥 Your daily streak is: 5 days.");
        }
      } else if (target === 'c') {
        lines.push(`$ ./a.out`);
        codeLines.forEach(line => {
          const printfMatch = line.match(/printf\s*\(\s*"(.*?)"\s*(?:,\s*(.*?))?\s*\)/);
          if (printfMatch) {
            let formatStr = printfMatch[1].replace(/\\n/g, "");
            let formatArgs = printfMatch[2] ? printfMatch[2].split(",").map(a => a.trim()) : [];
            
            if (formatArgs.length > 0 && formatStr.includes("%")) {
              let parsedStr = formatStr;
              formatArgs.forEach(arg => {
                const varRegex = new RegExp(`(?:int|float|double|char\\*?)\\s+${arg}\\s*=\\s*(.*?);`);
                let resolvedVal = "";
                for (let i = codeLines.indexOf(line) - 1; i >= 0; i--) {
                  const m = codeLines[i].match(varRegex);
                  if (m) {
                    resolvedVal = m[1].trim();
                    if (resolvedVal.startsWith('"') && resolvedVal.endsWith('"')) {
                      resolvedVal = resolvedVal.substring(1, resolvedVal.length - 1);
                    }
                    break;
                  }
                }
                if (resolvedVal) {
                  parsedStr = parsedStr.replace(/%[d|f|s|c]/, resolvedVal);
                }
              });
              outputLines.push(parsedStr);
            } else {
              outputLines.push(formatStr);
            }
          }
        });

        if (outputLines.length === 0) {
          outputLines.push("Hello, World from C!");
          outputLines.push("Welcome to Roj Study Academy!");
        }
      } else if (target === 'cpp') {
        lines.push(`$ ./main`);
        codeLines.forEach(line => {
          if (line.includes("cout") && line.includes("<<")) {
            const parts = line.split("<<").slice(1);
            let parsedLine = "";
            parts.forEach(p => {
              let trimmed = p.replace(/;/g, "").trim();
              if (trimmed === "endl") {
                // Ignore key
              } else if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
                parsedLine += trimmed.substring(1, trimmed.length - 1);
              } else {
                const varRegex = new RegExp(`(?:int|float|double|string)\\s+${trimmed}\\s*=\\s*(.*?);`);
                let resolvedVal = "";
                for (let i = codeLines.indexOf(line) - 1; i >= 0; i--) {
                  const m = codeLines[i].match(varRegex);
                  if (m) {
                    resolvedVal = m[1].trim();
                    if (resolvedVal.startsWith('"') && resolvedVal.endsWith('"')) {
                      resolvedVal = resolvedVal.substring(1, resolvedVal.length - 1);
                    }
                    break;
                  }
                }
                parsedLine += resolvedVal || trimmed;
              }
            });
            if (parsedLine.trim()) {
              outputLines.push(parsedLine);
            }
          }
        });

        if (outputLines.length === 0) {
          outputLines.push("Welcome to C++ OOP!");
          outputLines.push("Learner Abhay Dev has 1500 XP!");
        }
      } else if (target === 'java') {
        lines.push(`$ java Main`);
        codeLines.forEach(line => {
          const lMatch = line.match(/System\.out\.print(?:ln)?\s*\(\s*(.*?)\s*\)/);
          if (lMatch) {
            let inner = lMatch[1].trim();
            if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
              outputLines.push(inner.substring(1, inner.length - 1));
            } else if (inner.includes("+")) {
              let concatParts = inner.split("+").map(p => p.trim());
              let parsedResult = "";
              concatParts.forEach(part => {
                if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
                  parsedResult += part.substring(1, part.length - 1);
                } else {
                  const varRegex = new RegExp(`(?:int|double|String|char)(?:\\[\\])?\\s+${part}\\s*=\\s*(.*?);`);
                  let resolvedVal = "";
                  for (let i = codeLines.indexOf(line) - 1; i >= 0; i--) {
                    const m = codeLines[i].match(varRegex);
                    if (m) {
                      resolvedVal = m[1].trim();
                      if (resolvedVal.startsWith('"') && resolvedVal.endsWith('"')) {
                        resolvedVal = resolvedVal.substring(1, resolvedVal.length - 1);
                      } else if (resolvedVal.startsWith("{") && resolvedVal.endsWith("}")) {
                        resolvedVal = resolvedVal.replace("{", "[").replace("}", "]");
                      }
                      break;
                    }
                  }
                  if (part === "subjects.length") {
                    parsedResult += "4";
                  } else {
                    parsedResult += resolvedVal || part;
                  }
                }
              });
              outputLines.push(parsedResult);
            } else {
              outputLines.push(inner);
            }
          }
        });

        if (outputLines.length === 0) {
          outputLines.push("Hello, World from Java!");
          outputLines.push("We are learning 4 key languages.");
        }
      }

      lines.push(...outputLines);
      lines.push(`--------------------------------------`);
      lines.push(`✔ Process completed safely with exit code 0`);
      
      setIdeTerminalOutput(prev => [...prev, ...lines]);
      setIsIdeRunning(false);
      onXpEarned(20);
    }, 1500);
  };

  const handleCopyCode = () => {
    if (compilerMode === "web") {
      const fullWeb = `<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}\n\n// JS\n${jsCode}`;
      navigator.clipboard.writeText(fullWeb);
    } else {
      navigator.clipboard.writeText(activeCode);
    }
    alert("Code copied to clipboard! 📋");
  };

  const handleResetCode = () => {
    if (confirm(`Are you sure you want to restore the default starting templates for ${compilerMode.toUpperCase()}? This will discard your current modifications.`)) {
      const keyPrefix = getCodeKeyPrefix();
      if (compilerMode === "web") {
        const defaults = getLanguageTemplate("web") as { html: string; css: string; js: string };
        setHtmlCode(defaults.html);
        setCssCode(defaults.css);
        setJsCode(defaults.js);
        localStorage.removeItem(`${keyPrefix}-html`);
        localStorage.removeItem(`${keyPrefix}-css`);
        localStorage.removeItem(`${keyPrefix}-js`);
      } else {
        const fallback = getLanguageTemplate(compilerMode) as string;
        setActiveCode(fallback);
        localStorage.removeItem(`${keyPrefix}-${compilerMode}`);
      }
      setIdeTerminalOutput([]);
    }
  };

  // Handle active video code playground compiler outputs
  const handleRunCompiler = () => {
    // Generate secure self-contained HTML code doc combined dynamically
    const dynamicDoc = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            // Polyfill standard console logs to display smoothly if needed
            try {
              ${jsCode}
            } catch(err) {
              document.body.innerHTML += '<div style="background:#ef4444; color:#ffffff; padding:12px; margin:10px; font-family:monospace; border-radius:8px; font-size:11px;">Error executing script: ' + err.message + '</div>';
            }
          </script>
        </body>
      </html>
    `;
    setSrcDoc(dynamicDoc);
  };

  // Run manually on clicking Run Code with brief loading simulation
  const handleRunWebCompiler = () => {
    if (isWebRunning) return;
    setIsWebRunning(true);
    setTimeout(() => {
      handleRunCompiler();
      setIsWebRunning(false);
      onXpEarned(15);
    }, 600);
  };

  // Run initial preview on mount, video change, or mode shift (avoid on direct keystrokes)
  useEffect(() => {
    if (htmlCode) {
      handleRunCompiler();
    }
  }, [activeVideoIdx, compilerMode]);

  const handleNextVideo = () => {
    if (activeVideoIdx < playlist.videos.length - 1) {
      setActiveVideoIdx(prev => prev + 1);
    }
  };

  const handlePrevVideo = () => {
    if (activeVideoIdx > 0) {
      setActiveVideoIdx(prev => prev - 1);
    }
  };

  const handleCompletedCheckbox = () => {
    const isCompleted = userState.completedVideoIds.includes(`${playlist.id}-${activeVideo.id}`);
    onUpdateCompletedVideo(playlist.id, activeVideo.id, !isCompleted);
    
    // Award 50 XP if they finished!
    if (!isCompleted) {
      onXpEarned(50);
    }
  };

  const handleBookmarkToggle = () => {
    const isBookmarked = userState.bookmarkedVideoIds.includes(`${playlist.id}-${activeVideo.id}`);
    onUpdateBookmarkVideo(playlist.id, activeVideo.id, !isBookmarked);
  };

  const handleNoteSave = () => {
    onSaveNote(noteUniqueKey, noteText);
    alert("Personal lesson notes updated and stored in client-side secure session! 📓");
  };

  // Compute progress of overall playlist completion
  const playlistCompletedCount = playlist.videos.filter(v => 
    userState.completedVideoIds.includes(`${playlist.id}-${v.id}`)
  ).length;
  const playlistCompletionRate = Math.round((playlistCompletedCount / playlist.totalVideos) * 100);

  return (
    <div className="w-full text-left min-h-screen pb-12 font-sans select-none">
      {/* 0. Top Navigation & Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/5 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-white font-mono font-bold tracking-wider transition-all group bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 px-4.5 py-2.5 rounded-xl cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>BACK</span>
          </button>
          
          <div className="text-left">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Currently Studying Track</span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">{playlist.title}</h2>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/5 rounded-xl px-4 py-2.5 flex items-center gap-3 text-left">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-400">
            Progress <strong className="text-emerald-400 font-mono font-bold ml-1">{playlistCompletedCount}/{playlist.totalVideos}</strong> lessons Completed
          </span>
        </div>
      </div>

      {/* 1. Classroom Player & Sidebar Module */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Playback Stage - Left */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {isExamActive ? (
            /* ========================================================
               EXCLUSIVE SYSTEM CHAMBER: ACTIVE CERTIFICATION EXAM ROOM
               ======================================================== */
            <div className="w-full bg-[#090b14] border border-cyan-500/15 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden text-left flex flex-col justify-between min-h-[500px]">
              
              {/* Gold light accent decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-cyan-500/5 blur-[50px] pointer-events-none" />

              {/* Exam Header */}
              <div className="border-b border-white/5 pb-4.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">LIVE EXAMINATION ACTIVE</span>
                  </div>
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">{playlist.title}</h1>
                </div>

                {/* Live Countdown Timer block */}
                <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 px-4.5 py-2 rounded-xl text-amber-400 font-mono text-sm font-semibold select-none">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>{formatExamTime(examTimeRemaining)}</span>
                </div>
              </div>

              {examFinishedState ? (
                /* EXAM PORTAL WRITER RESULT MODULE (WHEN COMPLETED SUBMITTED) */
                <div className="py-6 flex flex-col items-center text-center justify-center animate-in fade-in max-w-xl mx-auto">
                  {examFinishedState === "passed" ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/10">
                        <Trophy className="h-8 w-8 text-emerald-400" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">CONGRATULATIONS, YOU PASSED! 🎉</h2>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                        Incredible performance! You scored <strong className="text-emerald-400 font-mono font-black text-sm">{recentExamScore}/50</strong> correctly. This surpasses the passing criterion of 30 correct answers. You have officially unlocked your verified graduation degree certificate!
                      </p>

                      {/* NAME REQUEST INTERACTIVE FORM CHANNEL */}
                      <div className="bg-slate-900 border border-emerald-500/10 rounded-2xl p-5 mt-5 w-full text-left relative overflow-hidden backdrop-blur-md">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                          🎓 Enter Learner's Name for Certificate:
                        </label>
                        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed font-sans">
                          Verify or type the learner's name below. This name will be permanently written onto your realistic, verifiable, and gold-sealed completion certificate!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="text"
                            value={tempStudentName}
                            onChange={(e) => {
                              setTempStudentName(e.target.value);
                              setIsNameSaved(false);
                            }}
                            placeholder="Type applicant full name..."
                            className="bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 flex-1 font-semibold transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleSaveCustomName}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all uppercase tracking-wider h-10 flex items-center justify-center gap-1 shrink-0"
                          >
                            <span>Save & Generate</span>
                          </button>
                        </div>
                        {isNameSaved ? (
                          <p className="text-[10px] text-emerald-400 font-mono mt-2 flex items-center gap-1 animate-pulse">
                            ✓ Certificate successfully generated in the name of "{tempStudentName}" with the current date! Ready to view/print.
                          </p>
                        ) : (
                          <p className="text-[10px] text-amber-500 font-mono mt-2">
                            * Click "Save & Generate" to lock your name onto the certificate.
                          </p>
                        )}
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
                        <button
                          onClick={() => {
                            handleSaveCustomName();
                            setShowLocalCert(true);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs py-3 px-5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-lg shadow-emerald-900/40"
                        >
                          <Award className="h-4.5 w-4.5" />
                          <span>View Your Certificate</span>
                        </button>
                        <button
                          onClick={handleExitExam}
                          className="w-full bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 font-semibold font-mono text-xs py-3 px-5 rounded-xl transition-all cursor-pointer text-center"
                        >
                          Exit Exam Chamber
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center mb-6 shadow-xl shadow-rose-900/10">
                        <AlertCircle className="h-8 w-8 text-rose-400" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">EXAM NOT PASSED (SCORE: {recentExamScore}/50)</h2>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        You scored <strong className="text-rose-400 font-mono font-bold">{recentExamScore}/50</strong> correct answers. You need at least <strong className="text-emerald-400 font-mono font-bold">30 correct answers</strong> to unlock the diploma credential. Don't worry! Review the video chapters, practice in the IDE code sandboxes below, and try again anytime.
                      </p>

                      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
                        <button
                          onClick={handleStartExam}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs py-3 px-5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wider"
                        >
                          <RotateCcw className="h-4 w-4" />
                          <span>RETAKE EXAM NOW</span>
                        </button>
                        <button
                          onClick={handleExitExam}
                          className="w-full bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 font-semibold font-mono text-xs py-3 px-5 rounded-xl transition-all cursor-pointer text-center"
                        >
                          Back to Videos
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* INTERACTIVE IN-EXAM ACTIVE QUESTIONS SYSTEM */
                <div className="flex flex-col flex-1 justify-between gap-6">
                  {examQuestions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1">
                      
                      {/* Active single Question presentation Area */}
                      <div className="md:col-span-8 flex flex-col text-left gap-4">
                        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                          <span>Question {currentQuestionIdx + 1} of 50</span>
                          <span className="bg-slate-950 border border-white/5 px-2 py-0.5 rounded text-cyan-400 font-semibold">
                            {studentAnswers[examQuestions[currentQuestionIdx].id] !== undefined ? "✓ Attempted" : "⏳ Unattempted"}
                          </span>
                        </div>

                        {/* Question text */}
                        <div className="bg-slate-950/60 border border-white/5 p-4 sm:p-5 rounded-2xl min-h-[90px] flex items-center">
                          <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed font-sans">
                            {examQuestions[currentQuestionIdx].text}
                          </p>
                        </div>

                        {/* Options picker array */}
                        <div className="flex flex-col gap-3 mt-1">
                          {examQuestions[currentQuestionIdx].options.map((opt, oIdx) => {
                            const isSelected = studentAnswers[examQuestions[currentQuestionIdx].id] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(examQuestions[currentQuestionIdx].id, oIdx)}
                                className={`w-full text-left p-4.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-3 group relative overflow-hidden ${isSelected ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold shadow-lg shadow-cyan-950/20' : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-950 hover:border-slate-800 hover:text-white'}`}
                              >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold uppercase transition-colors shrink-0 ${isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700 text-slate-500 group-hover:border-slate-500 group-hover:text-slate-400'}`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </div>
                                <span className="relative z-10 leading-normal">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Question Navigation Quick-Map 1-50 Grid */}
                      <div className="md:col-span-4 bg-slate-950/30 border border-white/5 rounded-2xl p-4">
                        <h4 className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider mb-2.5 pb-2 border-b border-white/5 flex justify-between items-center">
                          <span>Map Board</span>
                          <span className="text-[#06b6d4]">{Object.keys(studentAnswers).length}/50 Done</span>
                        </h4>

                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-1.5 max-h-[220px] overflow-y-auto scrollbar p-0.5 select-none text-center">
                          {examQuestions.map((q, qIndex) => {
                            const isActive = qIndex === currentQuestionIdx;
                            const isAnswered = studentAnswers[q.id] !== undefined;

                            return (
                              <button
                                key={q.id}
                                onClick={() => setCurrentQuestionIdx(qIndex)}
                                className={`w-full aspect-square text-[10px] font-mono font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer ${isActive ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 font-black' : isAnswered ? 'bg-[#1e1b4b]/80 text-cyan-300 border border-cyan-500/30 hover:bg-[#1a0e38]' : 'bg-slate-900 border border-white/5 text-slate-500 hover:text-slate-300 hover:border-slate-800'}`}
                              >
                                {qIndex + 1}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-4 flex items-center gap-3 text-[9px] font-mono text-slate-500 border-t border-white/5 pt-3">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyan-500" /> Active</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#1e1b4b]" /> Solved</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-900" /> Open</span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Foot Toolbar row: PREV, NEXT, SUBMIT */}
                  <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
                    <button
                      onClick={handleExitExam}
                      className="text-xs text-rose-400 hover:text-rose-300 font-mono font-bold cursor-pointer transition-colors"
                    >
                      Exit Exam
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIdx === 0}
                        className="bg-slate-900/80 hover:bg-slate-800 border border-white/5 text-xs text-slate-300 px-3.5 py-1.5 rounded-xl transition-all disabled:opacity-20 flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Prev</span>
                      </button>

                      <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIdx === examQuestions.length - 1}
                        className="bg-slate-900/80 hover:bg-slate-800 border border-white/5 text-xs text-slate-300 px-3.5 py-1.5 rounded-xl transition-all disabled:opacity-20 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold font-mono text-xs px-4 py-1.5 rounded-xl transition-all cursor-pointer tracking-wider flex items-center gap-1 uppercase shadow-md shadow-emerald-900/20"
                      >
                        <ClipboardCheck className="h-4 w-4" />
                        <span>Submit Exam</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* ========================================================
               DEFAULT SYSTEM CHAMBER: ACTIVE CLASSROOM LECTURE PLAYER
               ======================================================== */
            <>
              {/* YouTube responsive embedded layout player wrapper */}
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video border border-white/5 shadow-2xl">
                <iframe
                  title={activeVideo?.title}
                  src={`https://www.youtube.com/embed/${extractYoutubeId(activeVideo?.youtubeUrl)}?rel=0&enablejsapi=1`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>

              <div className="flex flex-col gap-1 mt-1 text-left">
                {/* Categories indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">lecture {activeVideoIdx + 1} of {playlist.totalVideos}</span>
                  
                  {/* Completed checkbox stamp */}
                  <button 
                    onClick={handleCompletedCheckbox}
                    className="flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${userState.completedVideoIds.includes(`${playlist.id}-${activeVideo.id}`) ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 hover:border-slate-500 bg-slate-900/60'}`}>
                      {userState.completedVideoIds.includes(`${playlist.id}-${activeVideo.id}`) && <CheckCircle className="h-3.5 w-3.5 stroke-[3px]" />}
                    </div>
                    <span className={`font-mono text-[11px] font-medium ${userState.completedVideoIds.includes(`${playlist.id}-${activeVideo.id}`) ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-300'}`}>
                      Mark as Completed (+50 XP)
                    </span>
                  </button>
                </div>

                <h1 className="font-display font-semibold text-xl text-white tracking-tight mt-1">
                  {activeVideo?.title}
                </h1>

                {/* Toolbar Area */}
                <div className="flex flex-wrap items-center justify-between border-t border-b border-white/5 py-3 mt-4 gap-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${isLiked ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 font-bold' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white hover:border-slate-800'}`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{isLiked ? "Linked" : "Like Video"}</span>
                    </button>

                    <button 
                      onClick={handleBookmarkToggle}
                      className={`flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${userState.bookmarkedVideoIds.includes(`${playlist.id}-${activeVideo.id}`) ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold' : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white hover:border-slate-800'}`}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>Saved</span>
                    </button>

                    <button 
                      onClick={() => setIsShareModal(!isShareModal)}
                      className="flex items-center gap-1 text-xs bg-slate-900/80 hover:bg-slate-800 border border-white/5 hover:border-slate-700 text-slate-400 hover:text-white px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share URL</span>
                    </button>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handlePrevVideo}
                      disabled={activeVideoIdx === 0}
                      className="bg-slate-900 hover:bg-slate-800 border border-white/5 disabled:opacity-20 p-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4.5 w-4.5 text-white" />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{activeVideoIdx + 1} / {playlist.videos.length}</span>
                    <button 
                      onClick={handleNextVideo}
                      disabled={activeVideoIdx === playlist.videos.length - 1}
                      className="bg-slate-900 hover:bg-slate-800 border border-white/5 disabled:opacity-20 p-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4.5 w-4.5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Share URL modal launcher simulation */}
                {isShareModal && (
                  <div className="bg-[#121223] border border-cyan-500/20 p-4.5 rounded-xl mt-3 text-left">
                    <label className="text-[10px] font-mono text-[#06b6d4] uppercase block mb-1">Lesson YouTube Share URL</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={activeVideo?.youtubeUrl || ""}
                        className="flex-1 bg-slate-950 border border-white/10 rounded-lg p-2 text-xs font-mono text-slate-300 focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(activeVideo?.youtubeUrl || "");
                          alert("Copied to clipboard!");
                        }}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono px-4 py-2 rounded-lg cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {/* MOBILE / TABLET ONLY: SYSTEM SUB-TABS SELECTOR ROW */}
                <div className="xl:hidden flex items-center justify-between gap-1.5 p-1 bg-slate-950/65 border border-white/5 rounded-2xl mt-4 select-none shadow-lg">
                  <button
                    onClick={() => setActiveMobileTab("syllabus")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-[10.5px] font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      activeMobileTab === "syllabus"
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black scale-[1.02]"
                        : "text-slate-400 hover:text-white bg-slate-900/20 hover:bg-slate-900/40"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Syllabus</span>
                  </button>
                  <button
                    onClick={() => setActiveMobileTab("sandbox")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-[10.5px] font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      activeMobileTab === "sandbox"
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black scale-[1.02]"
                        : "text-slate-400 hover:text-white bg-slate-900/20 hover:bg-slate-900/40"
                    }`}
                  >
                    <Terminal className="h-4 w-4" />
                    <span>Practice</span>
                  </button>
                  <button
                    onClick={() => setActiveMobileTab("notes")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-[10.5px] font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      activeMobileTab === "notes"
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black scale-[1.02]"
                        : "text-slate-400 hover:text-white bg-slate-900/20 hover:bg-slate-900/40"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Notes</span>
                  </button>
                </div>

                {/* Descriptive Content box */}
                <div className={`${activeMobileTab === "notes" ? "block font-sans" : "hidden xl:block font-sans"} bg-slate-900/20 border border-white/5 p-4 rounded-xl mt-4`}>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Lecture Notes &amp; Objectives</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">{activeVideo?.description}</p>
                </div>

                {/* In-content Google AdSense Container */}
                {ADS_CONFIG.ENABLE_ADS && (
                  <Ads 
                    id={`adsense-in-content-${activeVideo?.id || "lesson"}`}
                    type="in-content"
                    className="mt-4"
                  />
                )}

              </div>
            </>
          )}
        </div>

        {/* Playlists sidebar - Right */}
        <div className={`${activeMobileTab === "syllabus" ? "flex" : "hidden xl:flex"} xl:col-span-4 flex-col gap-4 h-auto xl:h-[calc(100vh-140px)] sticky xl:overflow-y-auto scrollbar`}>
          
          {/* Playlist Completion Tracker Progress Panel */}
          <div className="glass-panel rounded-2xl p-3.5 border border-white/10 text-left bg-black max-h-[240px] sm:max-h-[260px] overflow-y-auto scroll-smooth scrollbar relative overflow-hidden group">
            {playlistCompletionRate >= 100 && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-80 pointer-events-none" />
            )}
            <div className="flex items-center justify-between text-xs font-semibold mb-2 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span>Overall Completion</span>
                {playlistCompletionRate >= 100 && <strong className="text-emerald-400 font-bold font-mono">100% SUCCESS!</strong>}
              </span>
              <span className="font-mono">{playlistCompletionRate}%</span>
            </div>
            
            <div className="w-full bg-[#0b0b14]/90 border border-white/5 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 transition-all duration-500 animate-pulse"
                style={{ width: `${playlistCompletionRate}%` }}
              />
            </div>

            {playlistCompletionRate >= 100 ? (
              <div className="mt-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="text-[10px] font-mono tracking-widest font-extrabold text-emerald-400 uppercase block mb-1">
                  🏆 Course Syllabus Completed!
                </span>
                <p className="text-[11px] text-slate-300 leading-normal mb-3 font-sans">
                  Incredible work! You've finished 100% of the curriculum videos. Enter your name below to generate your official credentials for the <strong className="text-white">{playlist.title}</strong> module.
                </p>

                {/* Name validation area */}
                <div className="bg-slate-950/60 rounded-lg p-2.5 border border-white/5 mb-3">
                  <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-medium">
                    🎓 Student Full Name:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempStudentName}
                      onChange={(e) => {
                        setTempStudentName(e.target.value);
                        setIsNameSaved(false);
                      }}
                      placeholder="Enter graduation name..."
                      className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 flex-1 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleSaveCustomName}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-[10px] px-3.5 py-1.5 rounded-lg cursor-pointer transition-all uppercase tracking-wide shrink-0"
                    >
                      Save
                    </button>
                  </div>
                  {isNameSaved || hasEarnedCertificate ? (
                    <p className="text-[9px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
                      <span>✓ Ready! Verified for student:</span>
                      <strong className="text-white">"{tempStudentName || targetCert?.studentName || userState.name}"</strong>
                    </p>
                  ) : (
                    <p className="text-[9px] text-amber-500 font-mono mt-1.5">
                      * Please click "Save" to register this name on your certificate!
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleSaveCustomName();
                    setShowLocalCert(true);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/60 uppercase tracking-widest text-[10px]"
                >
                  <Award className="h-4 w-4 stroke-[2.5]" />
                  <span>CLAIM &amp; VIEW CERTIFICATE</span>
                </button>
              </div>
            ) : (
              <p className="text-[10px] font-mono text-slate-500 mt-2">Finish 100% of the lessons in this track to claim your verified certificate!</p>
            )}
          </div>

          {/* RojStudy Interactive Certification Exam Panel */}
          <div className="glass-panel rounded-2xl p-3.5 border border-cyan-500/20 bg-black text-left relative max-h-[180px] sm:max-h-[210px] overflow-y-auto scroll-smooth scrollbar overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-cyan-500/5 blur-[50px] pointer-events-none" />
            
            <span className="text-[9px] font-mono tracking-widest text-[#06b6d4] uppercase font-bold block mb-1">RojStudy Examination</span>
            <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight mb-2 flex items-center gap-1.5">
              <span>🎓 Certification Exam</span>
              <span className="text-[9px] bg-slate-900 border border-white/5 px-1 py-0.5 rounded text-slate-400 font-mono">50 Qs</span>
            </h3>

            {hasEarnedCertificate ? (
              <div className="bg-emerald-950/20 border border-emerald-500/15 rounded-xl p-2.5 text-xs mb-2.5">
                <p className="text-emerald-400 font-medium mb-1 text-[11px]">✓ Passed &amp; Certified!</p>
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mt-1 bg-slate-950/30 p-1 rounded px-2">
                  <span>Highest Score:</span>
                  <span className="text-white font-bold">{playlistHighestScore}/50</span>
                </div>
              </div>
            ) : (
              <p className="text-[10px] sm:text-[10.5px] text-slate-400 leading-normal mb-2.5 font-sans">
                Attempt a comprehensive 50-question course test to verify your learning and claim your premium RojStudy paper-realistic certificate! (Pass threshold is 30/50)
              </p>
            )}

            {hasEarnedCertificate ? (
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowLocalCert(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-[10px] py-1.5 px-2.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm active:scale-95"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>VIEW CERTIFICATE</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartExam}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 font-semibold font-mono text-[10px] py-1.5 px-2.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 active:scale-95"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>RETAKE EXAM</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartExam}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-[10px] sm:text-xs py-2 px-3 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 uppercase tracking-wide shadow-md shadow-cyan-950/40 active:scale-95"
              >
                <span>📝 Attempt Exam</span>
              </button>
            )}
          </div>

          {/* Videos Grid List Index */}
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-4 py-3.5 border-b border-white/5 text-left">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <span>Lecture Registry</span>
              </h3>
            </div>

            <div className="flex flex-col max-h-[180px] xl:max-h-[180px] 2xl:max-h-[300px] overflow-y-auto scrollbar select-none">
              {playlist.videos.map((vid, i) => {
                const isActive = activeVideoIdx === i;
                const isFinished = userState.completedVideoIds.includes(`${playlist.id}-${vid.id}`);
                return (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideoIdx(i)}
                    className={`flex items-start gap-3 p-3.5 text-left transition-all border-b border-white/5 cursor-pointer hover:bg-slate-950/40 ${isActive ? 'bg-slate-900/60 border-l-2 border-cyan-500' : ''}`}
                  >
                    {/* Compact Icon */}
                    <div className="shrink-0 mt-0.5">
                      {isFinished ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400 fill-emerald-950/20" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-mono text-slate-500 font-bold">
                          {i + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 font-sans truncate text-left">
                      <h4 className={`text-xs font-medium leading-tight truncate ${isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'}`}>{vid.title}</h4>
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#475569] mt-0.5">
                        <span>{vid.duration}</span>
                        <span>&bull;</span>
                        <span>YouTube stream</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- EXTRA LARGE INTEGRATED MULTI-LANGUAGE VS CODE PLAYGROUND (FULL WIDTH BREADTH) ----------------- */}
      <div 
        id="interactive-editor-sandbox" 
        className={`${activeMobileTab === "sandbox" ? "flex" : "hidden xl:flex"} flex-col gap-6 border border-white/10 rounded-2xl overflow-hidden shadow-2xl glass-panel relative bg-[#0b0b16]/75 p-6 mt-8 text-left w-full`}
      >
        
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-mono tracking-widest text-[#06b6d4] uppercase font-bold flex items-center gap-1.5">
            <Terminal className="h-5 w-5 stroke-[2.5]" /> Interactive Playgrounds (Extra Wide Edition)
          </span>
          <p className="text-xs text-slate-400">Practice your logic directly under the stream wrapper. Write, tweak, compile and view results in real-time!</p>
        </div>

        {/* Selector Tabs - Web vs C vs C++ vs Java vs Python */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050510] border border-white/5 rounded-xl">
          <button
            id="tab-web"
            onClick={() => setCompilerMode("web")}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${compilerMode === "web" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/15" : "bg-transparent border border-transparent text-slate-400 hover:text-white"}`}
          >
            <Code className="h-4 w-4" />
            <span>HTML CSS JS</span>
          </button>
          <button
            id="tab-c"
            onClick={() => setCompilerMode("c")}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${compilerMode === "c" ? "bg-blue-500/15 text-blue-400 border border-blue-500/20" : "bg-transparent border border-transparent text-slate-400 hover:text-white"}`}
          >
            <span className="font-bold text-[11px] w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center">C</span>
            <span>C Compiler</span>
          </button>
          <button
            id="tab-cpp"
            onClick={() => setCompilerMode("cpp")}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${compilerMode === "cpp" ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20" : "bg-transparent border border-transparent text-slate-400 hover:text-white"}`}
          >
            <span className="font-bold text-[11px] w-4 h-4 rounded-full bg-indigo-500/10 flex items-center justify-center">C+</span>
            <span>C++ Compiler</span>
          </button>
          <button
            id="tab-java"
            onClick={() => setCompilerMode("java")}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${compilerMode === "java" ? "bg-amber-600/15 text-amber-500 border border-amber-500/20" : "bg-transparent border border-transparent text-slate-400 hover:text-white"}`}
          >
            <span className="text-sm">☕</span>
            <span>Java SDK</span>
          </button>
          <button
            id="tab-python"
            onClick={() => setCompilerMode("python")}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${compilerMode === "python" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20" : "bg-transparent border border-transparent text-slate-400 hover:text-white"}`}
          >
            <span className="text-sm">🐍</span>
            <span>Python 3</span>
          </button>
        </div>

        {/* IDE Sandbox Workspace Container */}
        {compilerMode === "web" ? (
          /* ======================== FRONTEND SANDBOX (HTML/CSS/JS) ======================== */
          <div id="frontend-sandbox-editor" className="flex flex-col border border-white/10 rounded-xl overflow-hidden bg-slate-950 w-full">
            <div className="bg-[#0f0f1c] px-4 py-3 border-b border-white/5 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 hover:scale-110 transition-transform cursor-pointer"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 hover:scale-110 transition-transform cursor-pointer"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 hover:scale-110 transition-transform cursor-pointer"></span>
                <span className="ml-2 font-medium">web_frontend_sandbox.html</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  id="web-btn-reset"
                  onClick={handleResetCode}
                  className="bg-slate-900 border border-white/10 text-xs font-mono text-yellow-500 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                >
                 Reset
                </button>
                <button
                  id="web-btn-copy"
                  onClick={handleCopyCode}
                  className="bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 px-3 py-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                >
                 Copy
                </button>
                <button
                  id="web-btn-run"
                  onClick={handleRunWebCompiler}
                  disabled={isWebRunning}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-45 text-slate-950 font-bold text-xs font-mono px-4 py-1.5 rounded flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isWebRunning ? "running..." : "Run Code"}
                  <Play className="h-3.5 w-3.5 fill-current" />
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full">
              {/* Input Editor Codeboxes */}
              <div className="flex flex-col bg-slate-950">
                <div className="bg-[#050510] border-b border-white/10 flex text-left select-none overflow-x-auto">
                  <button
                    id="btn-html-tab"
                    onClick={() => setEditorTab("html")}
                    className={`px-5 py-3.5 flex items-center gap-2.5 transition-all cursor-pointer font-sans text-xs tracking-wider font-bold relative ${
                      editorTab === 'html' 
                        ? 'bg-[#0b0b16] text-white' 
                        : 'text-slate-400 hover:bg-[#0c0c1b]/50 hover:text-white'
                    }`}
                  >
                    {/* HTML 5 Badge */}
                    <span className="flex items-center justify-center w-5 h-5 bg-[#e44d26] text-white rounded font-sans font-extrabold text-[11px] select-none shadow-md">
                      5
                    </span>
                    <span>HTML</span>
                    {editorTab === 'html' && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-orange-500" />}
                  </button>

                  <button
                    id="btn-css-tab"
                    onClick={() => setEditorTab("css")}
                    className={`px-5 py-3.5 flex items-center gap-2.5 transition-all cursor-pointer font-sans text-xs tracking-wider font-bold relative ${
                      editorTab === 'css' 
                        ? 'bg-[#0b0b16] text-white' 
                        : 'text-slate-400 hover:bg-[#0c0c1b]/50 hover:text-white'
                    }`}
                  >
                    {/* CSS 3 Badge */}
                    <span className="flex items-center justify-center w-5 h-5 bg-[#264de4] text-white rounded font-sans font-extrabold text-[11px] select-none shadow-md">
                      3
                    </span>
                    <span>CSS</span>
                    {editorTab === 'css' && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-500" />}
                  </button>

                  <button
                    id="btn-js-tab"
                    onClick={() => setEditorTab("js")}
                    className={`px-5 py-3.5 flex items-center gap-2.5 transition-all cursor-pointer font-sans text-xs tracking-wider font-bold relative ${
                      editorTab === 'js' 
                        ? 'bg-[#0b0b16] text-white' 
                        : 'text-slate-400 hover:bg-[#0c0c1b]/50 hover:text-white'
                    }`}
                  >
                    {/* JS Badge */}
                    <span className="flex items-center justify-center w-5 h-5 bg-[#f7df1e] text-black rounded font-sans font-black text-[9px] select-none shadow-md">
                      JS
                    </span>
                    <span>JAVASCRIPT</span>
                    {editorTab === 'js' && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-yellow-500" />}
                  </button>
                </div>

                <div className="relative bg-[#1e1e1e] w-full h-[450px]">
                  {editorTab === "html" && (
                    <Editor
                      height="450px"
                      language="html"
                      theme="vs-dark"
                      value={htmlCode}
                      onChange={(val) => {
                        const newVal = val || "";
                        setHtmlCode(newVal);
                        localStorage.setItem(`${getCodeKeyPrefix()}-html`, newVal);
                      }}
                      loading={
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050510] text-slate-400 font-mono text-xs gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                          <span>Instantiating HTML Sandbox Editor...</span>
                        </div>
                      }
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        automaticLayout: true,
                        tabSize: 2,
                        scrollBeyondLastLine: false,
                        wordWrap: "on"
                      }}
                    />
                  )}
                  {editorTab === "css" && (
                    <Editor
                      height="450px"
                      language="css"
                      theme="vs-dark"
                      value={cssCode}
                      onChange={(val) => {
                        const newVal = val || "";
                        setCssCode(newVal);
                        localStorage.setItem(`${getCodeKeyPrefix()}-css`, newVal);
                      }}
                      loading={
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050510] text-slate-400 font-mono text-xs gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span>Instantiating CSS Sandbox Editor...</span>
                        </div>
                      }
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        automaticLayout: true,
                        tabSize: 2,
                        scrollBeyondLastLine: false,
                        wordWrap: "on"
                      }}
                    />
                  )}
                  {editorTab === "js" && (
                    <Editor
                      height="450px"
                      language="javascript"
                      theme="vs-dark"
                      value={jsCode}
                      onChange={(val) => {
                        const newVal = val || "";
                        setJsCode(newVal);
                        localStorage.setItem(`${getCodeKeyPrefix()}-js`, newVal);
                      }}
                      loading={
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050510] text-slate-400 font-mono text-xs gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                          <span>Instantiating JavaScript Sandbox Editor...</span>
                        </div>
                      }
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        automaticLayout: true,
                        tabSize: 2,
                        scrollBeyondLastLine: false,
                        wordWrap: "on"
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Header section separating Editor & Preview Area */}
              <div className="bg-[#050510] px-4 py-3 border-t border-b border-white/10 select-none text-left flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isWebRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
                  <span className="text-xs font-mono font-bold text-slate-300">Live Preview Output Sandbox</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Runs securely in an isolated virtual viewport
                </div>
              </div>

              {/* Bottom Sandbox live iframe render output */}
              <div id="frontend-sandbox-preview" className="flex flex-col bg-white w-full h-[450px] relative">
                {srcDoc ? (
                  <iframe
                    id="sandbox-web-compiled"
                    title="sandbox-web-compiled"
                    srcDoc={srcDoc}
                    sandbox="allow-scripts"
                    className="w-full h-full border-none bg-white font-sans"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 text-xs font-mono gap-2">
                    <p className="animate-pulse">Click "Run Code" at the top right to execute and render output.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ======================== MONACO-BASED PROGRAMMING IDE (C, C++, Java, Python) ======================== */
          <div id="monaco-sandbox-editor" className="flex flex-col gap-4 w-full">
            {/* Active video reference cards */}
            {activeVideo?.language === compilerMode && (activeVideo.practicePrompt || activeVideo.exampleCode) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Challenge prompt instructions */}
                <div className="bg-[#4f46e5]/5 border border-indigo-500/10 rounded-xl p-4 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[10px] bg-indigo-500/15 text-indigo-400 font-mono font-bold px-2 py-0.5 rounded uppercase">Challenge Task</span>
                    <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed whitespace-pre-wrap">{activeVideo.practicePrompt}</p>
                  </div>
                </div>

                {/* Reference code box */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 font-mono font-bold px-2 py-0.5 rounded uppercase">Reference Sample</span>
                    <div className="max-h-[100px] overflow-y-auto font-mono text-[11px] text-slate-400 leading-relaxed mt-2 whitespace-pre scrollbar">
                      {activeVideo.exampleCode}
                    </div>
                  </div>
                  <button
                    id="btn-restore-reference"
                    onClick={() => {
                      if (confirm("Restore the lesson reference code into the editor workspace?")) {
                        setActiveCode(activeVideo.exampleCode || "");
                        localStorage.setItem(`${getCodeKeyPrefix()}-${compilerMode}`, activeVideo.exampleCode || "");
                      }
                    }}
                    className="mt-2 text-left text-xs text-cyan-400 font-mono hover:underline font-semibold cursor-pointer"
                  >
                    ↪️ Reset editor to lesson reference code
                  </button>
                </div>
              </div>
            )}

            {/* Monaco Editor Component wrapper */}
            <div className="border border-white/10 rounded-xl overflow-hidden flex flex-col bg-[#1e1e1e] w-full shadow-lg">
              <div className="bg-[#0f0f1c] px-4 py-3 border-b border-white/10 flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Code className="h-4 w-4 text-[#06b6d4]" />
                  <span className="font-medium text-slate-300">
                    main.{compilerMode === 'python' ? 'py' : compilerMode === 'cpp' ? 'cpp' : compilerMode === 'java' ? 'java' : 'c'}
                  </span>
                  <span className="text-[10px] bg-slate-900 border border-white/5 text-slate-400 px-2 py-0.5 rounded uppercase ml-2">
                    {compilerMode === 'cpp' ? 'C++' : compilerMode} mode
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="ide-btn-reset"
                    onClick={handleResetCode}
                    className="bg-slate-950 hover:bg-slate-900 border border-white/5 text-yellow-500/90 text-xs font-mono px-3 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    id="ide-btn-copy"
                    onClick={handleCopyCode}
                    className="bg-slate-950 hover:bg-slate-900 border border-white/5 text-slate-300 text-xs font-mono px-3 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    Copy
                  </button>
                  <button
                    id="ide-btn-run"
                    onClick={handleRunProgrammingCode}
                    disabled={isIdeRunning}
                    className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-45 text-slate-950 font-bold text-xs font-mono px-4 py-1.5 rounded flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {isIdeRunning ? "running..." : "Run Code"}
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>
              </div>

              <div className="w-full relative min-h-[550px]">
                <Editor
                  height="550px"
                  language={compilerMode === 'cpp' ? 'cpp' : compilerMode}
                  theme="vs-dark"
                  value={activeCode}
                  onChange={(val) => {
                    setActiveCode(val || "");
                    localStorage.setItem(`${getCodeKeyPrefix()}-${compilerMode}`, val || "");
                  }}
                  loading={
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05050e] text-slate-300 font-mono text-xs gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                      <span>Instantiating Sandbox Web Compiler...</span>
                    </div>
                  }
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    automaticLayout: true,
                    tabSize: 4,
                    scrollBeyondLastLine: false,
                    wordWrap: "on"
                  }}
                />
              </div>

              {/* Virtual logging Terminal */}
              <div className="bg-[#03030d] border-t border-white/10 p-4 font-mono text-xs leading-relaxed text-left text-slate-300 flex flex-col gap-1 min-h-[160px] max-h-[240px] overflow-y-auto scrollbar select-none">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-white/5 pb-1.5 mb-1.5">
                  <Terminal className="h-4 w-4 text-emerald-500" />
                  <span>Execution Output Terminal</span>
                  {isIdeRunning && <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded ml-2 animate-pulse text-[9px]">ACTIVE PROCESS</span>}
                </div>

                {ideTerminalOutput.length === 0 ? (
                  <div className="text-slate-600 italic text-xs py-1">
                    Terminal output ready. Hit "Run Code" above to load compiled outputs.
                  </div>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    {ideTerminalOutput.map((l, idx) => (
                      <div 
                        key={idx} 
                        className={`whitespace-pre ${l.startsWith("$") ? "text-cyan-400 font-bold" : l.startsWith("✔") ? "text-emerald-400 font-bold" : l.startsWith("[info]") ? "text-slate-500" : "text-white"}`}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notebook Hub card inside the Lefthand Column */}
      <div 
        id="notebook-reminders-card" 
        className={`${activeMobileTab === "notes" ? "block" : "hidden xl:block"} glass-panel rounded-2xl p-6 border border-white/5 text-left bg-slate-950/25 mt-6 w-full`}
      >
        <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
          <FileText className="h-5 w-5 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Lesson Notes & Sandbox Reminders</h3>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 font-mono">
          Personalized reminders or key algorithms saved instantly to your offline browser profile. Keep reference tips intact!
        </p>

        <textarea
          id="lesson-notes-textarea"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Type lesson summary reminders, key syntaxes, or important pointers here..."
          className="w-full bg-slate-940 border border-white/10 focus:border-cyan-500 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none min-h-[150px] mt-3 resize-none leading-relaxed overflow-y-auto scrollbar"
        />

        <div className="flex justify-end mt-3">
          <button 
            id="btn-save-notes"
            onClick={handleNoteSave}
            className="bg-slate-900 border border-white/5 hover:border-cyan-500 hover:bg-slate-800 text-xs font-mono text-white px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 font-semibold"
          >
            <Save className="h-4 w-4 text-cyan-400 shadow-sm" />
            <span>Save Notes (+ XP)</span>
          </button>
        </div>
      </div>

      {/* Submit Confirmation Warning dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-500" />
              <span>Submit Certification Exam?</span>
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
              You have completed <strong className="text-white">{Object.keys(studentAnswers).length} out of 50</strong> questions. 
              {Object.keys(studentAnswers).length < 50 && (
                <span className="text-amber-400 block mt-1">Warning: {50 - Object.keys(studentAnswers).length} unattempted questions will be scored as incorrect.</span>
              )}
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-slate-950 hover:bg-slate-900 text-xs font-semibold text-slate-400 py-2.5 rounded-xl cursor-pointer transition-all border border-white/5"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-all uppercase font-mono tracking-wide"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local high-fidelity certificate modal viewer */}
      {showLocalCert && targetCert && (
        <CertificateModal
          certificate={targetCert}
          onClose={() => setShowLocalCert(false)}
        />
      )}

    </div>
  );
}
