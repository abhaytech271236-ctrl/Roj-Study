import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Multi-user server-level state for chat with file-backed persistence
const CHAT_DB_PATH = path.join(process.cwd(), "chat_db.json");

interface ChatMessage {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  message: string;
  timestamp: string;
}

function loadChatMessages(): ChatMessage[] {
  try {
    if (fs.existsSync(CHAT_DB_PATH)) {
      const data = fs.readFileSync(CHAT_DB_PATH, "utf8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading chat database file:", err);
  }

  // Springboard Initial Seed
  const initialMessages: ChatMessage[] = [
    {
      id: "m1",
      name: "Aman Gupta",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
      message: "Just completed the HTML + CSS Project! Moving to Bootstrap now. Anyone else on this path?",
      timestamp: "18:20",
      email: "aman@study.com"
    },
    {
      id: "m2",
      name: "Zoe Lin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
      message: "The built-in code runner is amazing! No need to set up VS code locally for doing quick tasks. 🎉",
      timestamp: "18:25",
      email: "zoe@study.com"
    },
    {
      id: "m3",
      name: "Vikram Dev",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
      message: "Does anyone want to team up for the React Project in Playlist 1?",
      timestamp: "18:32",
      email: "vikram@study.com"
    },
    {
      id: "m4",
      name: "Nikita Roy",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nikita",
      message: "Hello everyone! Just earned my Generative AI certificate! Highly recommended course.",
      timestamp: "18:33",
      email: "nikita@study.com"
    }
  ];

  try {
    fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(initialMessages, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing initial seed to chat database file:", err);
  }
  return initialMessages;
}

function saveChatMessages(messages: ChatMessage[]) {
  try {
    fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(messages, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to chat database file:", err);
  }
}

let communityChatMessages: ChatMessage[] = loadChatMessages();

// Active multi-user sessions tracking
interface ActiveUser {
  name: string;
  avatar: string;
  email: string;
  activity: string;
  lastActive: number;
}
const activeUsers: Record<string, ActiveUser> = {};

// Initialize Gemini client on the server
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI Chatbot functionality will use fallback responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Community Chat Endpoints
app.get("/api/chat", (req, res) => {
  const { name, avatar, email, activity } = req.query;

  // Record visitor in active list if credentials supplied
  if (name && typeof name === "string" && email && typeof email === "string") {
    activeUsers[email] = {
      name,
      avatar: (avatar as string) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      email,
      activity: (activity as string) || "Exploring Dashboard Modules",
      lastActive: Date.now()
    };
  }

  // Prune users inactive for > 15 seconds
  const now = Date.now();
  Object.keys(activeUsers).forEach((key) => {
    if (now - activeUsers[key].lastActive > 15000) {
      delete activeUsers[key];
    }
  });

  // Convert map to array
  const activeList = Object.values(activeUsers).map((u) => ({
    name: u.name,
    avatar: u.avatar,
    email: u.email,
    activity: u.activity,
    role: "Learner"
  }));

  res.json({ 
    messages: communityChatMessages, 
    activeUsers: activeList 
  });
});

app.post("/api/chat", (req, res) => {
  const { name, avatar, message, email } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  const now = new Date();
  const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMessage: ChatMessage = {
    id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name,
    email: email || "",
    avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    message: message.trim(),
    timestamp
  };

  communityChatMessages.push(newMessage);
  if (communityChatMessages.length > 150) {
    communityChatMessages.shift(); // Keep only last 150 messages
  }

  saveChatMessages(communityChatMessages);

  // Mark caller as active
  if (email) {
    activeUsers[email] = {
      name,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      email,
      activity: "Talking in Universal Global Chatroom",
      lastActive: Date.now()
    };
  }

  // Return both messages and the current active users list
  const activeList = Object.values(activeUsers).map((u) => ({
    name: u.name,
    avatar: u.avatar,
    email: u.email,
    activity: u.activity,
    role: "Learner"
  }));

  res.json({ success: true, messages: communityChatMessages, activeUsers: activeList });
});

// Route to delete a chat message
app.post("/api/chat/delete", (req, res) => {
  const { id, email } = req.body;
  if (!id || !email) {
    return res.status(400).json({ error: "Message ID and email are required" });
  }

  const idx = communityChatMessages.findIndex((msg) => msg.id === id);
  if (idx !== -1) {
    if (communityChatMessages[idx].email === email) {
      communityChatMessages.splice(idx, 1);
      saveChatMessages(communityChatMessages);
      return res.json({ success: true, messages: communityChatMessages });
    } else {
      return res.status(403).json({ error: "Unauthorized chat deletion" });
    }
  }

  res.status(404).json({ error: "Message not found" });
});

// Real-time multi-user learners statistics endpoint
const STATS_DB_PATH = path.join(process.cwd(), "stats_db.json");

interface StatsData {
  totalLearners: number;
  lastIncrementDate?: string;
}

function getStats(): StatsData {
  const todayString = new Date().toISOString().split("T")[0];
  let stats: StatsData = {
    totalLearners: 300,
    lastIncrementDate: todayString
  };

  try {
    if (fs.existsSync(STATS_DB_PATH)) {
      const raw = fs.readFileSync(STATS_DB_PATH, "utf8");
      stats = JSON.parse(raw);
    } else {
      saveStats(stats);
      return stats;
    }
  } catch (e) {
    console.error("Error reading stats database", e);
  }

  // Ensure fields exist
  if (typeof stats.totalLearners !== "number") {
    stats.totalLearners = 300;
  }
  if (!stats.lastIncrementDate) {
    stats.lastIncrementDate = todayString;
  }

  // If the date has roll-over/changed, we increment by 1 or 2 per elapsed day
  if (stats.lastIncrementDate !== todayString) {
    try {
      const lastDate = new Date(stats.lastIncrementDate);
      const todayDate = new Date(todayString);
      const msDiff = todayDate.getTime() - lastDate.getTime();
      const daysDiff = Math.max(0, Math.floor(msDiff / (1000 * 60 * 60 * 24)));

      if (daysDiff > 0) {
        let added = 0;
        for (let i = 0; i < daysDiff; i++) {
          added += Math.random() < 0.5 ? 1 : 2;
        }
        stats.totalLearners += added;
        stats.lastIncrementDate = todayString;
        saveStats(stats);
        console.log(`📈 Day transitioned. Automatically added ${added} learners. Total: ${stats.totalLearners}`);
      }
    } catch (err) {
      console.error("Error tracking daily totalLearners increment:", err);
    }
  }

  return stats;
}

function saveStats(stats: StatsData) {
  try {
    fs.writeFileSync(STATS_DB_PATH, JSON.stringify(stats, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing stats database", e);
  }
}

app.get("/api/learners-stats", (req, res) => {
  // Let active learner values oscillate strictly inside [10, 100]
  // Math.sin changes smoothly every couple of minutes
  const wave = Math.sin(Date.now() / 120000) * 35; 
  const noise = Math.sin(Date.now() / 10000) * 5 + ((Date.now() % 5) - 2); 
  const activeCount = Math.min(100, Math.max(10, Math.round(55 + wave + noise)));
  
  const stats = getStats();

  res.json({
    activeLearners: activeCount,
    totalLearners: stats.totalLearners,
    lastUpdated: new Date().toISOString()
  });
});

app.post("/api/learners-stats/increment", (req, res) => {
  const stats = getStats();
  stats.totalLearners += 1;
  saveStats(stats);
  res.json({ success: true, totalLearners: stats.totalLearners });
});

// Helper function for offline/mock chatbot responses
function getFallbackResponse(message: string): string {
  const normalizedMsg = message.toLowerCase().trim();
  
  // Who created/developed Roj Study (Required exact sentence matches)
  if (normalizedMsg.includes("kisne banaya") || 
      normalizedMsg.includes("who made") || 
      normalizedMsg.includes("who created") || 
      normalizedMsg.includes("developer") || 
      normalizedMsg.includes("founder") || 
      normalizedMsg.includes("creator") || 
      normalizedMsg.includes("abhay") || 
      normalizedMsg.includes("deepak")) {
    return "Roj Study ko Abhay and Deepak ne aapke future ko aur good banane ke liye banaya hai!\n\nThey created Roj Study with the sole vision of empowering students like you, giving you premium interactive coding tools, hand-picked YouTube playlist content, and verified PDF certificates, so your future becomes incredibly successful and bright!";
  }

  // Roj Study detailed info
  if (normalizedMsg.includes("roj study") || 
      normalizedMsg.includes("rojstudy") || 
      normalizedMsg.includes("platform") || 
      normalizedMsg.includes("kya hai")) {
    return "Roj Study ek futuristic e-learning academy hai jise Abhay aur Deepak ne aapke learning aur future ko develop karne ke liye design kiya hai!\n\nHere are some of our exciting features:\n" +
      "- **7 Specialization Tracks**: Front-End, Back-End, Fullstack, DSA with Java, Generative AI, UI Design, and Blender 3D.\n" +
      "- **VS Code Playground**: Write HTML/CSS/JS code directly below any video and run it instantly.\n" +
      "- **Verified Certificates**: Complete 100% video lectures to download your signed certificate.\n" +
      "- **Live Global Chatroom**: Real-time study discussions and peer collaboration.";
  }

  // 1. Web Development / HTML / CSS / JS / React
  if (normalizedMsg.includes("html") || 
      normalizedMsg.includes("css") || 
      normalizedMsg.includes("js") || 
      normalizedMsg.includes("javascript") || 
      normalizedMsg.includes("react") || 
      normalizedMsg.includes("web dev") || 
      normalizedMsg.includes("frontend")) {
    return "💡 **Web Development & Front-End Engineering:**\n\n" +
      "Web Development is divided into 3 major cornerstones:\n" +
      "- **HTML (Hypertext Markup Language)**: Structural skeleton of web pages.\n" +
      "- **CSS (Cascading Style Sheets)**: Styling, colors, layout, and responsiveness.\n" +
      "- **JavaScript**: Behavior, interactivity, and dynamic API integrations.\n\n" +
      "To master this field, we highly recommend trying the **Roj Study Internship Playlist** (9 comprehensive videos from basics to intermediate React projects) and building real projects in our built-in Editor!";
  }

  // 2. Backend / Node / Databases
  if (normalizedMsg.includes("backend") || 
      normalizedMsg.includes("node") || 
      normalizedMsg.includes("express") || 
      normalizedMsg.includes("api") || 
      normalizedMsg.includes("database") || 
      normalizedMsg.includes("sql") || 
      normalizedMsg.includes("mongo")) {
    return "⚙️ **Backend Development & Systems Design:**\n\n" +
      "Backend developers build the invisible but powerful engine of an app, managing server logic, database CRUD operations, and safe APIs:\n" +
      "- **Runtime**: Node.js allows JavaScript execution on servers.\n" +
      "- **Framework**: Express.js simplifies routing and middlewares.\n" +
      "- **Databases**: SQL (PostgreSQL, MySQL) for relational structural data, or NoSQL (MongoDB, Firestore) for flexible documents.\n\n" +
      "Roj Study has an advanced **Internship 2 (Backend Development)** track with 23 deep-dive videos to help you master backend systems!";
  }

  // 3. DSA / Algorithm / Java / Programming
  if (normalizedMsg.includes("dsa") || 
      normalizedMsg.includes("algorithm") || 
      normalizedMsg.includes("java") || 
      normalizedMsg.includes("programming") || 
      normalizedMsg.includes("coding")) {
    return "🧠 **Data Structures & Algorithms (Java):**\n\n" +
      "DSA is the core tool used by Top Tech companies (FAANG/MAANG) to test your logical problem-solving abilities:\n" +
      "- **Data Structures**: Arrays, Linked Lists, Stacks, Queues, Trees, and Graphs help store and organize data efficiently.\n" +
      "- **Algorithms**: Sorting, searching, and recursion minimize execution time and memory space.\n\n" +
      "Check out our dedicated **Roj Study DSA Track** using Java! Java is highly typed, object-oriented, and perfect for learning robust algorithms.";
  }

  // 4. AI / ML / LLMs / Gen AI / Gemini
  if (normalizedMsg.includes("ai") || 
      normalizedMsg.includes("ml") || 
      normalizedMsg.includes("machine") || 
      normalizedMsg.includes("artificial") || 
      normalizedMsg.includes("generative") || 
      normalizedMsg.includes("gemini") || 
      normalizedMsg.includes("chatgpt")) {
    return "🤖 **Artificial Intelligence & Generative AI:**\n\n" +
      "AI is shifting the entire global tech scenery. Traditional Machine Learning predicts patterns, but **Generative AI** allows models (like Gemini) to output completely new text, code, images, and audio!\n" +
      "- **LLMs**: Large Language Models trained on massive corpus of text data.\n" +
      "- **Prompt Engineering**: The art of structuring text queries to get accurate outputs from LLMs.\n\n" +
      "Roj Study has an exclusive **Generative AI Specialization** (2 videos) to help you learn prompt engineering and deploy next-gen AI systems!";
  }

  // 5. UI / UX Design / Figma
  if (normalizedMsg.includes("ui") || 
      normalizedMsg.includes("ux") || 
      normalizedMsg.includes("design") || 
      normalizedMsg.includes("figma") || 
      normalizedMsg.includes("styling")) {
    return "🎨 **UI/UX Design & Styling Principles:**\n\n" +
      "A stunning interface builds user trust instantly. Designers use tools like Figma to iterate layouts:\n" +
      "- **UI (User Interface)**: Focused on aesthetic typography, margins, responsive grids, and visual glassmorphism.\n" +
      "- **UX (User Experience)**: Focused on ease of navigation, user flows, and reducing cognitive load.\n\n" +
      "Roj Study's portal utilizes modern futuristic glassmorphism! You can learn standard design fundamentals in our **Design UI course** (10 videos).";
  }

  // 6. Blender / 3D / Animation
  if (normalizedMsg.includes("blender") || 
      normalizedMsg.includes("3d") || 
      normalizedMsg.includes("animation")) {
    return "📐 **3D Modeling & Animation with Blender:**\n\n" +
      "3D pipeline is used across modern gaming, spatial computing (AR/VR), and cinematic graphics:\n" +
      "- **Modeling**: Constructing meshes from vertices, edges, and polygons.\n" +
      "- **Shading**: Applying custom textures, reflections, and light nodes.\n" +
      "- **Animation**: Utilizing keyframes and physics rigs to bring objects to life.\n\n" +
      "Unlock your 3D digital artist side inside the **Roj Study 3D with Blender track** (5 videos)!";
  }

  // General questions / technical field overview (when offline/fallback)
  return "🚀 **Welcome to the Technical Field Gateway!**\n\n" +
    "Technology is a massive, high-paying, and deeply rewarding field. There are multiple career branches depending on your passion:\n" +
    "1. **Web & App Development**: Coding beautiful websites or dynamic mobile apps (React, iOS, Android).\n" +
    "2. **Backend & Cloud Engineering**: Supporting vast infrastructure, scaling servers (Docker, Node, AWS).\n" +
    "3. **Data Science & AI**: Modeling neural networks and querying massive databases.\n" +
    "4. **Product Design (UI/UX)**: Crafting high-converting, accessible visual layouts.\n\n" +
    "No matter which field you choose, Roj Study is built by **Abhay and Deepak** to make your learning journey incredibly easy and solid! Ask me specific keywords (like html, backend, dsa, ai, blender, design) to explore targeted insights.";
}

// 2. Gemini AI Chatbot API
app.post("/api/chatbot", async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const systemPrompt = `You are "Roj Study AI Assistant", an extraordinarily smart, helpful, and friendly bilingual educational chatbot and technical mentor for the "Roj Study" e-learning platform.

CRITICAL ROLE & CAPABILITY DIRECTIVES:
1. TECHNICAL FIELD EXPERT:
   - You are a highly professional Software Engineer and Tech Educator.
   - You must explain ANY coding concept, technical field (e.g. Frontend, Web Development, Backend Development, Mobile Apps, Cybersecurity, Cloud Computing, Data Science, AI, Block chain, Game Development, Data Structures & Algorithms, Systems Design), or career query in rich detail.
   - Provide clean markdown, clear explanations, and code examples (where appropriate) in any major tech language (JS, Python, Java, C++, HTML, CSS, SQL, etc.).

2. WHO CREATED/BUILT ROJ STUDY?
   - If anyone asks (in Hindi, Hinglish, English or any language) "who built Roj Study?", "who made Roj Study?", "roj study kisne banaya hai?", "creator/developer/founder/made by", you MUST answer with this exact message:
     "Abhay and deepak ne aapke future ko aur good banane ke liye banaya hai"
   - Always praise corporate founders Abhay & Deepak warmly: "Roj Study ko Abhay and deepak ne aapke future ko aur good banane ke liye banaya hai! They built this amazing futuristic interactive portal to shape your career and give you top-quality education."

3. BILINGUAL COMPREHENSION:
   - You fully understand both English and Hindi/Hinglish.
   - If a student asks a coding or tech question in English, respond in English. If they ask in Hinglish or Hindi, respond in standard Hinglish / Hindi to maintain a friendly, local-tutor atmosphere.

4. PLATFORM STRUCTURE:
   - "Internship Playlist" (9 videos: HTML, HTML Project, CSS, HTML + CSS Project, Bootstrap, JavaScript, HTML + CSS + JavaScript Project, React, React Project). Great for beginners!
   - "Internship 2 (Backend Development)" (23 videos). Advanced backend concepts.
   - "Fullstack Development Project" (10 videos). Fullstack architectural learning.
   - "DSA" (Data Structures & Algorithms track). Focuses on Java programming and Data Structures & Algorithms.
   - "Generative AI" (2 videos). AI development and prompting basics.
   - "Design UI" (10 videos). UI/UX principles and styling.
   - "3D with Blender" (5 videos). 3D design and scene structures.

5. TONAL DESIGN:
   - Keep answers clear, supportive, beginner-friendly, and structurally sound.
   - Return responses with clean markdown support. Do not expose internal database details.

Return your response as a simple narrative in text (can include rich markdown).`;

  try {
    const key = process.env.GEMINI_API_KEY;
    const isKeyInvalid = !key || key.trim() === "" || key === "undefined" || key === "null" || key.includes("MOCK_KEY") || key.includes("MY_GEMINI_API_KEY");

    if (isKeyInvalid) {
      const responseText = getFallbackResponse(message);
      return res.json({ text: responseText });
    }

    const ai = getGeminiClient();
    
    // Create chat or query context
    const recentHistory = chatHistory || [];
    const formattedHistory = recentHistory.map((h: any) => ({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    // Generate output utilizing gemini-3.5-flash which is perfect for this task
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.75,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini chatbot error:", error);
    // Dynamic fallback so the service never crashes or returns an error status code to the user
    const rawFallback = getFallbackResponse(message);
    const customizedFallback = "Hello! I am your Roj Study AI Mentor. Connecting live... \n\n" + 
      rawFallback.replace("Roj Study ko Abhay and Deepak ne aapke future ko aur good banane ke liye banaya hai!\n\n", "");
    res.json({ text: customizedFallback });
  }
});

// 3. Vite development middleware / asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Roj Study server running at http://localhost:${PORT}`);
  });
}

startServer();
