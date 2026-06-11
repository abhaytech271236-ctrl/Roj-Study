import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, HelpCircle, Loader2, BookOpen } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function AIHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! I am your **Roj Study AI Assistant**. 🚀 I know all about our 7 specialization tracks, coding exercises, certifications, and global chat! Ask me any coding question or how to navigate the academy." }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const rawMsg = textToSend || inputVal.trim();
    if (!rawMsg) return;

    if (!textToSend) setInputVal("");
    setMessages(prev => [...prev, { sender: "user", text: rawMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: rawMsg,
          chatHistory: messages.slice(-10) // Send recent context
        })
      });

      if (!response.ok) {
        throw new Error("API Route failure");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: "bot", text: data.text || "I was unable to structure an answer, please try asking again!" }]);
    } catch (err) {
      console.error("AI response error:", err);
      
      const normalizedMsg = rawMsg.toLowerCase().trim();
      let fallbackText = "";
      
      if (normalizedMsg.includes("kisne banaya") || 
          normalizedMsg.includes("who made") || 
          normalizedMsg.includes("who created") || 
          normalizedMsg.includes("developer") || 
          normalizedMsg.includes("founder") || 
          normalizedMsg.includes("creator") || 
          normalizedMsg.includes("abhay") || 
          normalizedMsg.includes("deepak")) {
        fallbackText = "Roj Study ko Abhay and Deepak ne aapke future ko aur good banane ke liye banaya hai!\n\nThey created Roj Study with the sole vision of empowering students like you, giving you premium interactive coding tools, hand-picked YouTube playlist content, and verified PDF certificates, so your future becomes incredibly successful and bright!";
      } else if (normalizedMsg.includes("roj study") || 
                 normalizedMsg.includes("rojstudy") || 
                 normalizedMsg.includes("platform") || 
                 normalizedMsg.includes("kya hai")) {
        fallbackText = "Roj Study ek futuristic e-learning academy hai jise Abhay aur Deepak ne aapke learning aur future ko develop karne ke liye design kiya hai!\n\nHere are some of our exciting features:\n" +
          "- **7 Specialization Tracks**: Front-End, Back-End, Fullstack, DSA with Java, Generative AI, UI Design, and Blender 3D.\n" +
          "- **VS Code Playground**: Write HTML/CSS/JS code directly below any video and run it instantly.\n" +
          "- **Verified Certificates**: Complete 100% video lectures to download your signed certificate.\n" +
          "- **Live Global Chatroom**: Real-time study discussions and peer collaboration.";
      } else if (normalizedMsg.includes("html") || 
                 normalizedMsg.includes("css") || 
                 normalizedMsg.includes("js") || 
                 normalizedMsg.includes("javascript") || 
                 normalizedMsg.includes("react") || 
                 normalizedMsg.includes("web dev") || 
                 normalizedMsg.includes("frontend")) {
        fallbackText = "💡 **Web Development & Front-End Engineering:**\n\n" +
          "Web Development is divided into 3 major cornerstones:\n" +
          "- **HTML (Hypertext Markup Language)**: Structural skeleton of web pages.\n" +
          "- **CSS (Cascading Style Sheets)**: Styling, colors, layout, and responsiveness.\n" +
          "- **JavaScript**: Behavior, interactivity, and dynamic API integrations.\n\n" +
          "To master this field, we highly recommend trying the **Roj Study Internship Playlist** (9 comprehensive videos from basics to intermediate React projects) and building real projects in our built-in Editor!";
      } else if (normalizedMsg.includes("backend") || 
                 normalizedMsg.includes("node") || 
                 normalizedMsg.includes("express") || 
                 normalizedMsg.includes("api") || 
                 normalizedMsg.includes("database") || 
                 normalizedMsg.includes("sql") || 
                 normalizedMsg.includes("mongo")) {
        fallbackText = "⚙️ **Backend Development & Systems Design:**\n\n" +
          "Backend developers build the invisible but powerful engine of an app, managing server logic, database CRUD operations, and safe APIs:\n" +
          "- **Runtime**: Node.js allows JavaScript execution on servers.\n" +
          "- **Framework**: Express.js simplifies routing and middlewares.\n" +
          "- **Databases**: SQL (PostgreSQL, MySQL) for relational structural data, or NoSQL (MongoDB, Firestore) for flexible documents.\n\n" +
          "Roj Study has an advanced **Internship 2 (Backend Development)** track with 23 deep-dive videos to help you master backend systems!";
      } else if (normalizedMsg.includes("dsa") || 
                 normalizedMsg.includes("algorithm") || 
                 normalizedMsg.includes("java") || 
                 normalizedMsg.includes("programming") || 
                 normalizedMsg.includes("coding")) {
        fallbackText = "🧠 **Data Structures & Algorithms (Java):**\n\n" +
          "DSA is the core tool used by Top Tech companies (FAANG/MAANG) to test your logical problem-solving abilities:\n" +
          "- **Data Structures**: Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs help store and organize data efficiently.\n" +
          "- **Algorithms**: Sorting, searching, and recursion minimize execution time and memory space.\n\n" +
          "Check out our dedicated **Roj Study DSA Track** using Java! Java is highly typed, object-oriented, and perfect for learning robust algorithms.";
      } else if (normalizedMsg.includes("ai") || 
                 normalizedMsg.includes("ml") || 
                 normalizedMsg.includes("machine") || 
                 normalizedMsg.includes("artificial") || 
                 normalizedMsg.includes("generative") || 
                 normalizedMsg.includes("gemini") || 
                 normalizedMsg.includes("chatgpt")) {
        fallbackText = "🤖 **Artificial Intelligence & Generative AI:**\n\n" +
          "AI is shifting the entire global tech scenery. Traditional Machine Learning predicts patterns, but **Generative AI** allows models (like Gemini) to output completely new text, code, images, and audio!\n" +
          "- **LLMs**: Large Language Models trained on massive corpus of text data.\n" +
          "- **Prompt Engineering**: The art of structuring text queries to get accurate outputs from LLMs.\n\n" +
          "Roj Study has an exclusive **Generative AI Specialization** (2 videos) to help you learn prompt engineering and deploy next-gen AI systems!";
      } else if (normalizedMsg.includes("ui") || 
                 normalizedMsg.includes("ux") || 
                 normalizedMsg.includes("design") || 
                 normalizedMsg.includes("figma") || 
                 normalizedMsg.includes("styling")) {
        fallbackText = "🎨 **UI/UX Design & Styling Principles:**\n\n" +
          "A stunning interface builds user trust instantly. Designers use tools like Figma to iterate layouts:\n" +
          "- **UI (User Interface)**: Focused on aesthetic typography, margins, responsive grids, and visual glassmorphism.\n" +
          "- **UX (User Experience)**: Focused on ease of navigation, user flows, and reducing cognitive load.\n\n" +
          "Roj Study's portal utilizes modern futuristic glassmorphism! You can learn standard design fundamentals in our **Design UI course** (10 videos).";
      } else if (normalizedMsg.includes("blender") || 
                 normalizedMsg.includes("3d") || 
                 normalizedMsg.includes("animation")) {
        fallbackText = "📐 **3D Modeling & Animation with Blender:**\n\n" +
          "3D pipeline is used across modern gaming, spatial computing (AR/VR), and cinematic graphics:\n" +
          "- **Modeling**: Constructing meshes from vertices, edges, and polygons.\n" +
          "- **Shading**: Applying custom textures, reflections, and light nodes.\n" +
          "- **Animation**: Utilizing keyframes and physics rigs to bring objects to life.\n\n" +
          "Unlock your 3D digital artist side inside the **Roj Study 3D with Blender track** (5 videos)!";
      } else {
        fallbackText = "🚀 **Welcome to the Technical Field Gateway!**\n\n" +
          "Technology is a massive, high-paying, and deeply rewarding field. There are multiple career branches depending on your passion:\n" +
          "1. **Web & App Development**: Coding beautiful websites or dynamic mobile apps (React, iOS, Android).\n" +
          "2. **Backend & Cloud Engineering**: Supporting vast infrastructure, scaling servers (Docker, Node, AWS).\n" +
          "3. **Data Science & AI**: Modeling neural networks and querying massive databases.\n" +
          "4. **Product Design (UI/UX)**: Crafting high-converting, accessible visual layouts.\n\n" +
          "No matter which field you choose, Roj Study is built by **Abhay and Deepak** to make your learning journey incredibly easy and solid! Ask me specific keywords (like html, backend, dsa, ai, blender, design) to explore targeted insights.";
      }
      
      setMessages(prev => [...prev, { sender: "bot", text: fallbackText }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Recommend a React Course",
    "How do I unlock a certificate?",
    "Explain CSS Flexbox vs Grid"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-full p-4 shadow-xl shadow-cyan-500/20 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center border border-white/10"
          title="Ask Roj AI Assist"
        >
          <Bot className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 border-2 border-[#0b0b14] rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] h-[500px] rounded-2xl glass-panel-heavy border border-cyan-500/20 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-4 py-3.5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-500/30">
                <Bot className="h-4.5 w-4.5 text-cyan-400" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-semibold text-white tracking-wide">Roj Study AI Assist</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[9px] text-slate-400 font-mono tracking-wider">ONLINE &bull; GEMINI FLASH</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Message Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar"
          >
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex gap-2.5 max-w-[85%] ${m.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-900/50 flex items-center justify-center border border-indigo-700/30 text-indigo-300 font-bold text-xs shrink-0 select-none">
                    AI
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div 
                    className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed text-left whitespace-pre-wrap font-sans ${
                      m.sender === "user"
                        ? "bg-gradient-to-tr from-[#06b6d4]/80 to-indigo-600/80 text-white rounded-tr-none"
                        : "bg-[#141424] text-slate-200 border border-white/5 rounded-tl-none font-medium text-slate-300"
                    }`}
                  >
                    {/* Render basic custom bold tags inside mock response */}
                    {m.text.split("**").map((part, i) => i % 2 === 1 ? <strong key={i} className="text-cyan-400 font-semibold">{part}</strong> : part)}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 max-w-[85%] self-start">
                <div className="w-7 h-7 rounded-lg bg-indigo-900/50 flex items-center justify-center border border-indigo-700/30 text-indigo-300 font-bold text-xs shrink-0 animate-pulse">
                  AI
                </div>
                <div className="bg-[#141424] text-slate-400 border border-white/5 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                  <span>Thinking of ideas...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Panel */}
          {messages.length < 3 && !loading && (
            <div className="px-4 py-2 bg-slate-950/40 border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar select-none">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  className="bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-400 font-mono py-1 px-2.5 rounded-lg border border-cyan-950 shrink-0 cursor-pointer text-left font-medium"
                >
                  {qp}
                </button>
              ))}
            </div>
          )}

          {/* Form sending block */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-slate-950 border-t border-white/5 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-[#121222] border border-white/5 rounded-xl py-2 px-3.5 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl border border-[#ffffff10] shrink-0 active:scale-95 transition-transform disabled:opacity-40 disabled:scale-100 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
