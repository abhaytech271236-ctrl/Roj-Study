import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Users, Shield, Smile, Timer, ChevronLeft, Trash2, Volume2, VolumeX, HelpCircle } from "lucide-react";
import { ForumMessage } from "../types";
import { IS_FIREBASE_CONFIGURED, liveDb } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  limitToLast, 
  onSnapshot, 
  serverTimestamp,
  setDoc
} from "firebase/firestore";

interface CommunityChatProps {
  userName: string;
  userAvatar: string;
  userEmail: string;
  userId?: string;
  onBack?: () => void;
}

// Simple synthesizer sound notification using HTML5 Web Audio API
const playPingSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // Note D5
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // Slide to Note A5
    
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio Context sound blocked or not initialized yet:", e);
  }
};

// Custom rich formatting helper for rendering code blocks and inline code
function formatChatMessage(text: string) {
  if (!text) return null;

  // Render code blocks if they exist
  if (text.includes("```")) {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const codeLines = part.slice(3, -3).trim();
        const newlineIdx = codeLines.indexOf("\n");
        let lang = "";
        let code = codeLines;

        if (newlineIdx !== -1) {
          const possibleLang = codeLines.substring(0, newlineIdx).trim();
          if (possibleLang.length < 15 && /^[a-zA-Z0-9+#]+$/.test(possibleLang)) {
            lang = possibleLang;
            code = codeLines.substring(newlineIdx + 1);
          }
        }

        return (
          <div key={index} className="my-2.5 bg-[#030307]/90 rounded-xl border border-white/5 p-3 font-mono text-[11px] leading-relaxed text-cyan-300 relative group overflow-x-auto w-full max-w-full shadow-inner">
            {lang && (
              <span className="absolute top-2 right-2.5 text-[8px] tracking-wider uppercase text-slate-500 font-bold select-none">
                {lang}
              </span>
            )}
            <pre className="whitespace-pre">{code}</pre>
          </div>
        );
      }
      return formatInlineCode(part, index);
    });
  }

  return formatInlineCode(text, 0);
}

function formatInlineCode(text: string, keyPrefix: any) {
  if (!text.includes("`")) return text;
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${keyPrefix}-${index}`} className="mx-1 bg-slate-950 px-1.5 py-0.5 rounded text-[10.5px] font-mono font-semibold text-pink-400 border border-white/5">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function CommunityChat({ userName, userAvatar, userEmail, userId, onBack }: CommunityChatProps) {
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [onlinePeers, setOnlinePeers] = useState<any[]>([]);
  const [muteSound, setMuteSound] = useState(() => {
    return localStorage.getItem("rojstudy_mute_chat_sounds") === "true";
  });
  const [showGuidelines, setShowGuidelines] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef<number>(0);

  // Sync mute state to local storage
  const toggleMute = () => {
    setMuteSound(prev => {
      const next = !prev;
      localStorage.setItem("rojstudy_mute_chat_sounds", next ? "true" : "false");
      return next;
    });
  };

  // 1. Direct Realtime Firestore Synchronization
  useEffect(() => {
    if (!IS_FIREBASE_CONFIGURED || !liveDb) {
      // Offline fallback
      const fetchLocalBackup = async () => {
        try {
          const response = await fetch("/api/chat");
          if (response.ok) {
            const data = await response.json();
            setMessages(data.messages || []);
          }
        } catch (e) {
          console.error("Local backup retrieval failed", e);
        }
      };
      fetchLocalBackup();
      const interval = setInterval(fetchLocalBackup, 5000);
      return () => clearInterval(interval);
    }

    // Live listening to chats
    const chatsQuery = query(
      collection(liveDb, "chats"),
      orderBy("createdAt", "asc"),
      limitToLast(100) // Keep ONLY last 100 messages as requested
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const liveMsgs: ForumMessage[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        liveMsgs.push({
          id: docSnap.id,
          name: d.name || "Student",
          email: d.email || "",
          avatar: d.avatar || "",
          message: d.message || "",
          timestamp: d.timestamp || ""
        });
      });
      
      setMessages(liveMsgs);

      // Play ping sound for new incoming messages NOT from me
      if (liveMsgs.length > prevMessagesLength.current) {
        const lastMsg = liveMsgs[liveMsgs.length - 1];
        const isFromMe = lastMsg.email === userEmail || lastMsg.name === userName;
        if (!isFromMe && !muteSound && prevMessagesLength.current > 0) {
          playPingSound();
        }
      }
      prevMessagesLength.current = liveMsgs.length;
    }, (error) => {
      console.error("Firestore real-time subscription error on chats:", error);
    });

    return () => {
      unsubscribe();
    };
  }, [muteSound, userEmail, userName]);

  // 2. Presence system - Ping presence in database every 4 seconds
  useEffect(() => {
    if (!IS_FIREBASE_CONFIGURED || !liveDb || !userId) return;

    const presenceDocRef = doc(liveDb, "online_users", userId);
    
    const updatePresence = async () => {
      try {
        await setDoc(presenceDocRef, {
          userId: userId,
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          activity: "Chatting in Universal Room",
          lastActive: Date.now()
        }, { merge: true });
      } catch (err) {
        console.error("Failed to sync presence status:", err);
      }
    };

    updatePresence();
    const presenceInterval = setInterval(updatePresence, 4000);

    return () => {
      clearInterval(presenceInterval);
    };
  }, [userId, userName, userEmail, userAvatar]);

  // 3. Online peers listening (from Firestore, eliminating fake demo accounts)
  useEffect(() => {
    if (!IS_FIREBASE_CONFIGURED || !liveDb) {
      setOnlinePeers([]);
      return;
    }

    const presenceQuery = collection(liveDb, "online_users");
    const unsubscribePresence = onSnapshot(presenceQuery, (snapshot) => {
      const activeList: any[] = [];
      const threshold = Date.now() - 15000; // Users active in the last 15 seconds

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        // Exclude our own user since we are already rendered at the very top of the list!
        if (d.lastActive >= threshold && d.userId !== userId) {
          activeList.push({
            userId: d.userId,
            name: d.name,
            avatar: d.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.name}`,
            email: d.email,
            activity: d.activity || "Reviewing Course Material",
            lastActive: d.lastActive,
            role: d.email === "admin@rojtech.com" || d.email === "mrabhaypranker1236@gmail.com" ? "Instructor" : "Live User",
            isReal: true
          });
        }
      });

      setOnlinePeers(activeList);
    });

    return () => unsubscribePresence();
  }, [userId, userName, userEmail, userAvatar]);

  // Scroll to bottom on message list change or initial render
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = inputText.trim();
    if (!cleanMsg || isSending) return;

    setIsSending(true);
    try {
      if (IS_FIREBASE_CONFIGURED && liveDb) {
        const now = new Date();
        const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        await addDoc(collection(liveDb, "chats"), {
          userId: userId || "usr_anon",
          name: userName,
          email: userEmail,
          avatar: userAvatar,
          message: cleanMsg,
          timestamp: timestampStr,
          createdAt: serverTimestamp() // critical for chronological ordering!
        });
        setInputText("");
      } else {
        // Local state / endpoint fallback
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userName,
            avatar: userAvatar,
            email: userEmail,
            message: cleanMsg
          })
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
          setInputText("");
        }
      }
    } catch (err) {
      console.error("Error posting forum message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    try {
      if (IS_FIREBASE_CONFIGURED && liveDb) {
        await deleteDoc(doc(liveDb, "chats", msgId));
      } else {
        // Fallback endpoint deletion
        const response = await fetch("/api/chat/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: msgId,
            email: userEmail
          })
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const insertEmoji = (emoji: string) => {
    setInputText(prev => prev + " " + emoji);
  };

  const sampleEmojis = ["🔥", "💡", "🚀", "🎓", "💻", "🎉", "👨‍💻", "💯", "✅", "⚡", "❓"];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] select-none animate-in fade-in duration-200">
      
      {/* Messaging Column */}
      <div className="lg:col-span-9 flex flex-col justify-between bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden h-full shadow-2xl backdrop-blur-md">
        
        {/* Workspace Title Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="mr-1 flex items-center gap-1 text-[10px] text-cyan-400 hover:text-white font-mono font-bold transition-all bg-slate-900 border border-white/5 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-800"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>BACK</span>
              </button>
            )}
            <div className="bg-[#6366f1]/15 p-2 rounded-xl text-[#818cf8] shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wide">Universal Global Chatroom</h3>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono hidden sm:block">Discuss lessons, query coding tasks, collaborate in real time.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              title="Toggle Notification Sounds"
              onClick={toggleMute}
              className="p-1.5 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            >
              {muteSound ? (
                <VolumeX className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              )}
            </button>
            <button
              title="Chat Guidelines"
              onClick={() => setShowGuidelines(prev => !prev)}
              className="p-1.5 rounded-lg border border-white/5 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors flex items-center gap-1"
            >
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[9px] font-mono font-bold uppercase hidden sm:inline">Rules</span>
            </button>
            <div className="hidden xs:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase">LIVE SYNC</span>
            </div>
          </div>
        </div>

        {/* Guidelines Sub-Bar */}
        {showGuidelines && (
          <div className="bg-cyan-950/20 border-b border-cyan-500/15 p-3.5 text-left text-[11px] text-slate-300 leading-relaxed font-sans relative animate-in slide-in-from-top-3 duration-200">
            <strong className="text-cyan-400 uppercase font-mono block mb-1">💬 ROJSTUDY CHAT COMMUNITY RULES & RULES</strong>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Be kind, respectful, and helpful to fellow students.</li>
              <li>Feel free to paste code snippets by wrapping them in three backticks <code className="text-pink-400 font-mono bg-slate-950 px-1 py-0.5 rounded">```</code>.</li>
              <li>Avoid spamming links, promo codes, or unrelated advertisements.</li>
              <li>You can retract or delete your own post by clicking the trash icon next to your message block.</li>
            </ul>
          </div>
        )}

        {/* Messaging Box */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4.5 scrollbar bg-[#0d0d17]/50"
        >
          {messages.map((msg) => {
            const isMe = msg.email === userEmail || msg.name === userName;
            return (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 max-w-[90%] sm:max-w-[80%] group/item ${isMe ? "self-end flex-row-reverse" : "self-start"}`}
              >
                <img 
                  src={msg.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.name}`} 
                  alt={msg.name} 
                  className="w-8.5 h-8.5 rounded-full bg-slate-950 border border-white/10 shrink-0 select-none align-middle object-cover" 
                />
                
                <div className="flex flex-col gap-1 max-w-full">
                  <div className={`flex items-center gap-2 text-[10px] text-slate-500 font-mono ${isMe ? "justify-end" : "justify-start"}`}>
                    <span className="font-semibold text-slate-300">{msg.name}</span>
                    <span>&bull;</span>
                    <span>{msg.timestamp}</span>
                    {isMe && <span className="bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 px-1 rounded text-[8px] uppercase font-bold escala-90">me</span>}
                    
                    {/* Delete button (only shown for owner messages) */}
                    {isMe && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-500 hover:text-rose-400 transition-all rounded hover:bg-slate-800 cursor-pointer inline-flex items-center justify-center translate-y-[-0.5px]"
                        title="Delete Message"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <div 
                    className={`rounded-2xl px-3.5 py-2 text-xs text-left leading-relaxed break-words w-full max-w-full ${
                      isMe 
                        ? "bg-gradient-to-tr from-[#5551ff] to-pink-600 font-medium text-white rounded-tr-none shadow-lg shadow-indigo-950/40"
                        : "bg-slate-950/80 text-slate-200 border border-white/5 rounded-tl-none font-medium shadow-md shadow-black/30"
                    }`}
                  >
                    <div className="whitespace-pre-line break-words w-full overflow-hidden">
                      {formatChatMessage(msg.message)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {messages.length === 0 && (
            <div className="my-auto flex flex-col items-center gap-3 py-16 text-slate-500 font-mono">
              <Smile className="h-8 w-8 text-indigo-500 animate-bounce" />
              <p className="text-xs">No entries posted yet. Start the workspace chat!</p>
              <p className="text-[10px] text-slate-600">Tip: Type code inside backticks to look like a guru!</p>
            </div>
          )}
        </div>

        {/* Quick Emojis Panel Selection */}
        <div className="px-4 py-2 bg-[#090910] border-t border-white/5 flex items-center gap-2 overflow-x-auto select-none scrollbar">
          <span className="text-[9px] text-slate-500 font-mono tracking-wider shrink-0 uppercase font-semibold">Quick React:</span>
          {sampleEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="hover:scale-125 hover:rotate-6 transition-transform text-xs p-1 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Post Form Panel */}
        <form 
          onSubmit={handlePostMessage}
          className="p-3 sm:p-4 bg-slate-950 border-t border-white/5 flex items-center gap-2.5 sm:gap-3.5"
        >
          <input 
            type="text" 
            placeholder={`Say something, ${userName}... (Supports code blocks!)`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending}
            maxLength={1000}
            required
            className="flex-1 bg-[#10101b] border border-white/10 rounded-xl py-2.5 px-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all shadow-inner font-sans"
          />

          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="bg-gradient-to-tr from-[#5551ff] to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold text-xs px-4 sm:px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-40 disabled:scale-100 cursor-pointer shadow-lg shadow-indigo-950/50"
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* Online list Column */}
      <div className="lg:col-span-3 flex flex-col bg-slate-900/20 rounded-2xl border border-white/5 p-4 overflow-y-auto h-full text-left scrollbar shadow-xl">
        <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between border-b border-white/5 pb-3.5 mb-3.5">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>Active Members</span>
          </div>
          <span className="text-[10px] bg-indigo-950 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono text-cyan-400 font-bold">{onlinePeers.length}</span>
        </h4>

        {/* User personal profile row */}
        <div className="flex items-center gap-3 p-2 bg-[#0a0a14]/90 rounded-xl border border-cyan-500/20 mb-3 shadow shadow-cyan-900/15">
          <div className="relative">
            <img src={userAvatar} alt={userName} className="w-8.5 h-8.5 rounded-full border border-cyan-400 bg-slate-950 object-cover" />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-[#0b0b14] rounded-full"></span>
          </div>
          <div className="truncate flex-1">
            <span className="text-xs font-bold text-white block truncate">{userName} (You)</span>
            <span className="text-[9px] text-[#06b6d4] font-mono font-medium uppercase">Active chatter</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {onlinePeers.map((peer, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2 border border-transparent rounded-xl hover:bg-[#070710]/50 transition-all group">
              <div className="relative mt-0.5 shrink-0">
                <img 
                  src={peer.avatar.startsWith("http") ? peer.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${peer.avatar}`} 
                  alt={peer.name} 
                  className="w-7.5 h-7.5 rounded-full bg-slate-950 border border-white/5 object-cover" 
                />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-[#090a14] rounded-full ${peer.isReal ? "bg-emerald-400" : "bg-emerald-500/40"}`} />
              </div>
              <div className="text-left font-sans truncate flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-slate-300 block leading-tight truncate">{peer.name}</span>
                  <span className={`text-[8px] font-mono border px-1.5 py-0.5 rounded uppercase shrink-0 ${
                    peer.role === 'Instructor' 
                      ? 'text-amber-400 border-amber-400/35 bg-amber-400/10' 
                      : peer.role === 'Leader' 
                        ? 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5' 
                        : peer.role === 'Graduate' 
                          ? 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5' 
                          : peer.isReal 
                            ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5 animate-pulse'
                            : 'text-slate-500 border-white/5'
                  }`}>
                    {peer.role}
                  </span>
                </div>
                <span className="text-[9.5px] text-slate-500 leading-tight block truncate mt-0.5 italic">
                  {peer.activity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
