import React, { useState, useEffect } from "react";
import { 
  Plus, Youtube, Link, Clock, AlignLeft, 
  CheckCircle, Database, Trash2, Edit3, Eye, Video as VideoIcon, Save, Info, ChevronLeft, Award, Sparkles, FolderPlus,
  Users, Search, RefreshCw, X, ShieldAlert
} from "lucide-react";
import { Playlist, Video } from "../types";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { liveDb, IS_FIREBASE_CONFIGURED } from "../lib/firebase";

interface AdminPanelProps {
  playlists: Playlist[];
  onAddVideoToPlaylist: (playlistId: string, newVideo: Video) => void;
  onDeleteVideoFromPlaylist: (playlistId: string, videoId: string) => void;
  onUpdateVideoInPlaylist: (playlistId: string, videoId: string, updatedFields: Partial<Video>) => void;
  onCreatePlaylist: (newPlaylist: Playlist) => void;
  onBack?: () => void;
}

// Robust YouTube URL ID extractor
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

export default function AdminPanel({ 
  playlists, 
  onAddVideoToPlaylist, 
  onDeleteVideoFromPlaylist,
  onUpdateVideoInPlaylist,
  onCreatePlaylist,
  onBack
}: AdminPanelProps) {
  
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(playlists[0]?.id || "");
  const activePlaylist = playlists.find(p => p.id === selectedPlaylistId) || playlists[0];

  const [activeTab, setActiveTab] = useState<"syllabus" | "students">("syllabus");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsUsersLoading(true);
    setUsersError(null);

    if (IS_FIREBASE_CONFIGURED && liveDb) {
      const q = query(collection(liveDb, "users"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const uList: any[] = [];
        snapshot.forEach((docSnapObj) => {
          const data = docSnapObj.data();
          uList.push({
            uid: docSnapObj.id,
            ...data,
            createdAtStr: data.createdAt?.toDate?.() 
              ? data.createdAt.toDate().toISOString() 
              : data.createdAt 
                ? (typeof data.createdAt === "string" ? data.createdAt : new Date(data.createdAt).toISOString())
                : new Date().toISOString()
          });
        });
        
        // Sorting: newest first by default
        uList.sort((a, b) => {
          const dateA = new Date(a.createdAtStr || 0).getTime();
          const dateB = new Date(b.createdAtStr || 0).getTime();
          return dateB - dateA;
        });

        setUsersList(uList);
        setIsUsersLoading(false);
      }, (error) => {
        console.error("Firestore user fetch error: ", error);
        setUsersError("Could not retrieve registered users list from Firestore. Ensure you have the proper administrative security rules deployed.");
        setIsUsersLoading(false);
        
        // As a friendly fallback on firestore error, try loading from local simulation
        try {
          const localData = localStorage.getItem("rojstudy_users_db");
          if (localData) {
            const parsed = JSON.parse(localData);
            const list = Object.values(parsed).map((u: any) => ({
              ...u,
              createdAtStr: u.createdAt || new Date().toISOString()
            })).sort((a: any, b: any) => 
              new Date(b.createdAtStr).getTime() - new Date(a.createdAtStr).getTime()
            );
            setUsersList(list);
          }
        } catch (e) {}
      });

      return () => unsubscribe();
    } else {
      // Simulation mode fallback
      try {
        const localData = localStorage.getItem("rojstudy_users_db");
        if (localData) {
          const parsed = JSON.parse(localData);
          const list = Object.values(parsed).map((u: any) => ({
            ...u,
            createdAtStr: u.createdAt || new Date().toISOString()
          })).sort((a: any, b: any) => 
            new Date(b.createdAtStr).getTime() - new Date(a.createdAtStr).getTime()
          );
          setUsersList(list);
        } else {
          // Preset some nice evaluator mock users if database is empty in simulation
          const mockUsers = [
            {
              uid: "usr_mock1",
              name: "Abhay Sharma",
              email: "mrabhaypranker1236@gmail.com",
              createdAtStr: new Date(Date.now() - 3600000 * 24).toISOString(),
              xp: 450,
              streak: 3
            },
            {
              uid: "usr_mock2",
              name: "Shreya Gupta",
              email: "shreya.gupta@rojstudy.org",
              createdAtStr: new Date(Date.now() - 3600000 * 12).toISOString(),
              xp: 120,
              streak: 1
            },
            {
              uid: "usr_mock3",
              name: "Aman Varma",
              email: "aman.webdev@gmail.com",
              createdAtStr: new Date().toISOString(),
              xp: 30,
              streak: 1
            }
          ];
          setUsersList(mockUsers);
        }
      } catch (e) {
        setUsersError("Failed to fetch simulated user directories.");
      }
      setIsUsersLoading(false);
    }
  }, [activeTab]);

  // Filter users by search criteria on name or email
  const filteredUsers = usersList.filter((usr) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = (usr.name || "").toLowerCase().includes(q);
    const emailMatch = (usr.email || "").toLowerCase().includes(q);
    return nameMatch || emailMatch;
  });

  const formatJoinDate = (isoString: string | undefined): string => {
    if (!isoString) return "Indeterminate Date";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "Unknown Session";
      return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch (e) {
      return "Valid Student";
    }
  };

  // Section 1 - Create playlist states
  const [showCreatePlaylistForm, setShowCreatePlaylistForm] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [newPlaylistCategory, setNewPlaylistCategory] = useState("Web Development");
  const [newPlaylistAccent, setNewPlaylistAccent] = useState("cyan");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");

  // Section 2 - Video details
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState("");
  
  // Section 3 - Video link
  const [newUrl, setNewUrl] = useState("");
  
  // Save notification states
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  
  // Selected slot for immediate test-drive iframe preview
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);
  
  // Find current video to preview in the admin panel
  const previewVideo = activePlaylist?.videos.find(v => v.id === previewVideoId) || activePlaylist?.videos[0];

  const handleCreateNewPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) {
      alert("Please provide a title for the new playlist!");
      return;
    }

    const uniquePlaylistId = `playlist_${Date.now()}`;
    const newPlaylistObj: Playlist = {
      id: uniquePlaylistId,
      title: newPlaylistTitle.trim(),
      description: newPlaylistDesc.trim() || `${newPlaylistTitle.trim()} dynamic learning track on Roj Study.`,
      category: newPlaylistCategory,
      totalVideos: 0,
      videos: [],
      accentColor: newPlaylistAccent
    };

    onCreatePlaylist(newPlaylistObj);
    setSelectedPlaylistId(uniquePlaylistId);
    setActionSuccessMsg(`Successfully created new course playlist: "${newPlaylistTitle.trim()}"! 📂`);
    
    // reset form fields
    setNewPlaylistTitle("");
    setNewPlaylistDesc("");
    setShowCreatePlaylistForm(false);

    setTimeout(() => setActionSuccessMsg(""), 5000);
  };

  const handleAppendNewSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccessMsg("");

    if (!selectedPlaylistId) {
      alert("Please select or create a playlist first in Section 1!");
      return;
    }

    const parsedId = extractYoutubeId(newUrl);
    if (!parsedId) {
      alert("Please provide a valid YouTube URL or ID! We need this to render the preview player stream.");
      return;
    }

    if (!newTitle.trim()) {
      alert("Please provide a lecture title in Section 2!");
      return;
    }

    const rawTargetPlaylist = playlists.find(p => p.id === selectedPlaylistId) || activePlaylist;
    const nextIndex = (rawTargetPlaylist?.videos.length || 0) + 1;
    const resolvedTitle = newTitle.trim();
    const resolvedUrl = newUrl.trim();
    const uniqueId = `v_${Date.now()}`;
    
    const newVideoItem: Video = {
      id: uniqueId,
      title: resolvedTitle,
      youtubeUrl: resolvedUrl,
      duration: newDuration.trim() || "12:00",
      description: newDescription.trim() || "Dynamic video session uploaded to study syllabus."
    };

    onAddVideoToPlaylist(selectedPlaylistId, newVideoItem);
    setActionSuccessMsg(`Successfully uploaded video: "${resolvedTitle}" in checklist! 🚀`);
    
    // Clear adding forms
    setNewTitle("");
    setNewUrl("");
    setNewDuration("");
    setNewDescription("");

    // Set preview to the newly added video slot
    setPreviewVideoId(uniqueId);

    setTimeout(() => setActionSuccessMsg(""), 5500);
  };

  const handleUpdateSlot = (videoId: string, titleVal: string, urlVal: string, durationVal: string, descVal: string) => {
    const cleanId = extractYoutubeId(urlVal);
    if (!cleanId) {
      alert("The YouTube link is invalid! Please paste a valid watch or sharing URL.");
      return;
    }

    onUpdateVideoInPlaylist(selectedPlaylistId, videoId, {
      title: titleVal.trim(),
      youtubeUrl: urlVal.trim(),
      duration: durationVal.trim(),
      description: descVal.trim()
    });

    setActionSuccessMsg(`Successfully updated changes to Slot "${videoId}"!`);
    setEditingSlotId(null);
    setTimeout(() => setActionSuccessMsg(""), 4000);
  };

  return (
    <div className="w-full text-left max-w-7xl mx-auto py-4 flex flex-col gap-6 font-sans select-none">
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-white font-mono font-bold tracking-wider transition-all group bg-slate-900/60 hover:bg-slate-800/85 border border-white/5 px-4 py-2 rounded-xl cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>BACK TO DASHBOARD</span>
          </button>
        </div>
      )}

      {/* Admin Title Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5 relative overflow-hidden bg-slate-950/20 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block animate-ping"></span>
              Admin Control Center
            </h1>
            <h2 className="font-display font-semibold text-2xl text-white tracking-tight mt-1.5">
              Roj Study Syllabus Administrator Panel
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Dynamically populate, write, and manage learning content across custom-made or original default course lists. Follow the 3 organized steps below to establish lectures instantly.
            </p>
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="mt-4 bg-emerald-950/65 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl flex items-center gap-2.5 font-sans leading-relaxed animate-fade-in">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Admin Tabs Panel Selector */}
      <div className="flex border-b border-white/5 gap-2 font-mono text-xs mt-2 overflow-x-auto scrollbar">
        <button
          onClick={() => setActiveTab("syllabus")}
          className={`px-5 py-3.5 transition-all relative border-b-2 font-bold tracking-wider cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "syllabus"
              ? "border-cyan-500 text-cyan-400 bg-cyan-500/5 font-semibold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Database className="h-4 w-4" />
          <span>SYLLABUS MANAGEMENT</span>
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-5 py-3.5 transition-all relative border-b-2 font-bold tracking-wider cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === "students"
              ? "border-cyan-500 text-cyan-400 bg-cyan-500/5 font-semibold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>STUDENT DIRECTORY</span>
          {usersList.length > 0 && (
            <span className="bg-cyan-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
              {usersList.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "syllabus" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dynamic Multi-Step Creation Section (Upload Form) - 7 spans */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col bg-slate-950/10 p-5">
            
            <div className="border-b border-white/5 pb-3 mb-6">
              <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
                DASHBOARD LECTURE UPLOADER (STEP-BY-STEP)
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">FOLLOW ALL THREE SECTIONS SEQUENTIALLY TO REGISTER VIDEO CONTENT</p>
            </div>

            {/* SECTION 1: CHOOSE OR CREATE PLAYLIST */}
            <div className="mb-6 p-4 rounded-xl border border-white/5 bg-[#090b14] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-cyan-400 h-full"></div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold">SECTION 1</span>
                    SELECT OR INITIALIZE PLAYLIST
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select a destination course or construct a new curriculum category</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowCreatePlaylistForm(!showCreatePlaylistForm)}
                  className="bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/25 hover:border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1"
                >
                  <FolderPlus className="h-3 w-3" />
                  <span>{showCreatePlaylistForm ? "Cancel New Playlist" : "Create New Playlist"}</span>
                </button>
              </div>

              {/* Inline Playlist Creation Form Toggle */}
              {showCreatePlaylistForm ? (
                <form onSubmit={handleCreateNewPlaylist} className="bg-slate-950/90 border border-cyan-500/20 p-4 rounded-xl flex flex-col gap-3.5 mb-3 mt-1 animate-fade-in">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-1">
                    <Plus className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase">New Playlist Specifications</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Playlist Title Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Next.js App Router Masterclass"
                        value={newPlaylistTitle}
                        onChange={(e) => setNewPlaylistTitle(e.target.value)}
                        className="w-full bg-[#11111d] border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Category Domain</label>
                      <select 
                        value={newPlaylistCategory}
                        onChange={(e) => setNewPlaylistCategory(e.target.value)}
                        className="w-full bg-[#11111d] border border-white/10 rounded-lg py-2 px-3 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-sans cursor-pointer font-semibold"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Programming Languages">Programming Languages</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Web Design / UI">Web Design / UI</option>
                        <option value="Other Skills">Other Skills</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Theme Accent Color</label>
                      <select 
                        value={newPlaylistAccent}
                        onChange={(e) => setNewPlaylistAccent(e.target.value)}
                        className="w-full bg-[#11111d] border border-white/10 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans cursor-pointer"
                      >
                        <option value="cyan">Cyan Glow</option>
                        <option value="indigo">Indigo Sky</option>
                        <option value="rose">Rose Quartz</option>
                        <option value="amber">Amber Gold</option>
                        <option value="emerald">Emerald Forest</option>
                        <option value="pink">Pink Panther</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Short Description</label>
                      <input 
                        type="text"
                        placeholder="Comprehensive course covering NextJS..."
                        value={newPlaylistDesc}
                        onChange={(e) => setNewPlaylistDesc(e.target.value)}
                        className="w-full bg-[#11111d] border border-white/10 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer text-center"
                  >
                    Deploy New Playlist Category Track
                  </button>
                </form>
              ) : null}

              {/* Standard List Dropdown component */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full text-left">
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Choose Target Playlist to upload inside:</label>
                  <select
                    value={selectedPlaylistId}
                    onChange={(e) => {
                      setSelectedPlaylistId(e.target.value);
                      setPreviewVideoId(null);
                    }}
                    className="w-full bg-[#11111d] border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl py-2.5 px-3 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-sans font-bold cursor-pointer"
                  >
                    {!playlists || playlists.length === 0 ? (
                      <option value="">No playlists present. Create one above!</option>
                    ) : (
                      playlists.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.category.toUpperCase()} &bull; {p.title} ({p.videos?.length || 0} active video slots)
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: ADD TITLE & OBJECTIVES */}
            <div className="mb-6 p-4 rounded-xl border border-white/5 bg-[#090b14] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-amber-400 h-full"></div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-3">
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">SECTION 2</span>
                LECTURE SCHEMATICS & DETAILS
              </h4>

              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Lesson Custom Title <span className="text-red-400">&bull;</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5. Advanced Web Architecture Hooks & Fetchers"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#11111d] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-3">
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Lecture Lesson Objectives summary</label>
                    <input 
                      type="text" 
                      placeholder="Objectives, exercise briefs, and study requirements..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full bg-[#11111d] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Duration text</label>
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="e.g. 14:20"
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                        className="w-full bg-[#11111d] border border-white/10 rounded-xl py-2.5 pl-8 pr-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: VIDEO LINK CONNECTION */}
            <div className="p-4 rounded-xl border border-white/5 bg-[#090b14] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-red-400 h-full"></div>
              
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-bold">SECTION 3</span>
                  VIDEO STREAM URL CONNECTION (YOUTUBE LINK)
                </h4>
                
                {newUrl.trim() && (
                  <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded leading-none ${extractYoutubeId(newUrl) ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-red-950 text-red-400 border border-red-500/20'}`}>
                    {extractYoutubeId(newUrl) ? "Link Validated" : "Invalid Stream Link"}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Paste Youtube Link:</label>
                  <div className="relative">
                    <Youtube className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                    <input 
                      type="text" 
                      placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="w-full bg-[#11111d] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono"
                      required
                    />
                  </div>
                </div>

                {newUrl.trim() && (
                  <div className="bg-[#121223] border border-red-500/10 p-2.5 rounded-xl flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Parsed Video Player Stream ID:</span>
                    <span className="font-bold font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400">
                      {extractYoutubeId(newUrl) || "NOT DETECTED (INVALID YOUTUBE LINK)"}
                    </span>
                  </div>
                )}

                {/* Primary form submission action */}
                <button
                  type="button"
                  onClick={handleAppendNewSlot}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-600 hover:from-cyan-400 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <VideoIcon className="h-4 w-4" />
                  <span>Append Custom Lecture Slot to Class Syllabus</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Playlists Slots Edit Interface & Static Embed Tester Workspace - 5 spans */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-4">
          
          {/* Quick tester Embedded Player Preview */}
          {previewVideo && (
            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden bg-black shadow-2xl flex flex-col gap-1.5 p-4.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> Instant Embedding Player Preview
                </span>
                <span className="bg-[#11111d] text-[9px] text-slate-400 font-mono py-0.5 px-2 rounded border border-white/5">
                  ID: {extractYoutubeId(previewVideo.youtubeUrl)}
                </span>
              </div>

              <div className="relative bg-black rounded-xl overflow-hidden aspect-video border border-white/10 shadow-lg mb-2">
                {extractYoutubeId(previewVideo.youtubeUrl) ? (
                  <iframe
                    title="admin-embed-test-player"
                    src={`https://www.youtube.com/embed/${extractYoutubeId(previewVideo.youtubeUrl)}?rel=0`}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 p-4 font-mono text-center text-xs text-red-400 gap-1">
                    <Info className="h-5 w-5" />
                    <span>No Valid video URL parsed.</span>
                  </div>
                )}
              </div>

              <div className="text-left w-full">
                <h4 className="text-xs font-semibold text-white leading-snug">{previewVideo.title}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-normal font-sans">{previewVideo.description}</p>
              </div>
            </div>
          )}

          {/* List of active videos inside selected playlist */}
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full bg-slate-950/10">
            <div className="bg-slate-950/80 px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="h-4.5 w-4.5 text-cyan-400" />
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                  ACTIVE SESSIONS IN "{activePlaylist?.title || "SELECTED PATH"}" ({activePlaylist?.videos?.length || 0})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase bg-slate-900 border border-white/5 px-2 py-0.5 rounded">
                SESSIONS
              </span>
            </div>

            <div className="p-4 flex flex-col gap-4 max-h-[500px] overflow-y-auto scrollbar">
              {activePlaylist?.videos && activePlaylist.videos.length > 0 ? (
                activePlaylist.videos.map((vid, index) => {
                  const videoIdExtracted = extractYoutubeId(vid.youtubeUrl);
                  const isSelectedForPreview = previewVideo?.id === vid.id;

                  return (
                    <VideoSlotRow 
                      key={vid.id || index}
                      index={index}
                      vid={vid}
                      videoIdExtracted={videoIdExtracted}
                      isSelectedForPreview={isSelectedForPreview}
                      onPreviewSelect={() => setPreviewVideoId(vid.id)}
                      onSave={(t, u, d, ds) => handleUpdateSlot(vid.id, t, u, d, ds)}
                      onDelete={() => {
                        if (confirm(`Remove the Slot "${vid.title}" permanently? Any completed student XP records might be affected.`)) {
                          onDeleteVideoFromPlaylist(selectedPlaylistId, vid.id);
                          if (previewVideoId === vid.id) setPreviewVideoId(null);
                        }
                      }}
                    />
                  );
                })
              ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-500 font-mono">
                  <VideoIcon className="h-8 w-8 text-slate-600 animate-pulse" />
                  <p className="text-xs">This curriculum playlist has no active lessons yet. Submit Section 3 above to add one!</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
      ) : (
        <div className="flex flex-col gap-6 animate-fade-in w-full text-left">
          {/* Summary Total Count Header Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-950/40 relative overflow-hidden flex items-center justify-between shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-cyan-500/5 blur-[40px] pointer-events-none" />
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-widest text-[#8a99ad] uppercase block">Total Students</span>
                <strong className="text-3xl text-white font-display block mt-1">{usersList.length}</strong>
                <p className="text-[10px] text-cyan-400/90 font-mono mt-1">Verified on Cloud Registry</p>
              </div>
              <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/15 text-cyan-400">
                <Users className="h-6 w-6" />
              </div>
            </div>
            
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-950/40 relative overflow-hidden flex items-center justify-between shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#3b82f6]/5 blur-[40px] pointer-events-none" />
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-widest text-[#8a99ad] uppercase block">Active Course Enrolments</span>
                <strong className="text-3xl text-white font-display block mt-1">{playlists.length}</strong>
                <p className="text-[10px] text-indigo-400/90 font-mono mt-1">Available Learning Tracks</p>
              </div>
              <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/15 text-indigo-300 font-bold">
                <Database className="h-6 w-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-950/40 relative overflow-hidden flex items-center justify-between shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#10b981]/5 blur-[40px] pointer-events-none" />
              <div className="text-left">
                <span className="text-[10px] font-mono tracking-widest text-[#8a99ad] uppercase block">Database Instance</span>
                <strong className="text-sm font-mono text-emerald-400 font-bold block mt-3 uppercase">
                  {IS_FIREBASE_CONFIGURED ? "● Cloud Live Mode" : "● Offline Local Mode"}
                </strong>
                <p className="text-[10px] text-slate-500 font-mono mt-1">System: Connected Synchronized</p>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/15 text-emerald-400 font-bold">
                <RefreshCw className="h-5 w-5 animate-spin duration-1000" />
              </div>
            </div>
          </div>

          {/* Search bar block */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 bg-slate-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search students by name or email address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090b14] border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Student Directory Table Container */}
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden bg-slate-950/20 flex flex-col shadow-xl">
            <div className="bg-[#0c0d15] px-5 py-4 border-b border-white/5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-cyan-400" />
                <h3 className="text-xs font-bold text-white tracking-wide uppercase font-sans">
                  Registered Cloud Student Directories ({filteredUsers.length} listed)
                </h3>
              </div>
              <span className="text-[9px] font-mono text-cyan-400 uppercase bg-cyan-950/50 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                Newest Registries First
              </span>
            </div>

            {/* Main user data grid / list */}
            {isUsersLoading ? (
               <div className="p-24 text-center flex flex-col items-center justify-center gap-3 text-slate-400 select-none">
                 <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
                 <p className="text-xs font-mono">Querying live student directories from Firebase Cloud...</p>
               </div>
            ) : usersError ? (
               <div className="p-16 text-center flex flex-col items-center justify-center gap-3 text-red-400 select-none">
                 <ShieldAlert className="h-8 w-8 text-red-500 animate-pulse" />
                 <p className="text-xs font-semibold uppercase font-mono tracking-wider">Access Restrained</p>
                 <p className="text-[11px] text-slate-400 max-w-md font-sans leading-relaxed">{usersError}</p>
               </div>
            ) : filteredUsers.length === 0 ? (
               <div className="p-24 text-center flex flex-col items-center justify-center gap-3 text-[#505f73] font-mono select-none">
                 <Users className="h-8 w-8 text-[#2a384c] animate-pulse" />
                 <span className="text-xs">No matching student accounts located across directories.</span>
               </div>
            ) : (
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-[#090b14]/50 text-[10px] font-mono text-slate-400 uppercase tracking-wider select-none">
                      <th className="py-3.5 px-6">Name</th>
                      <th className="py-3.5 px-6">Email</th>
                      <th className="py-3.5 px-6">Join Date</th>
                      <th className="py-3.5 px-6 text-right font-mono">UID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03] text-xs">
                    {filteredUsers.map((user, idx) => (
                      <tr 
                        key={user.uid || idx} 
                        className="hover:bg-cyan-500/[0.02] transition-colors group"
                      >
                        {/* Name column */}
                        <td className="py-3.5 px-6 text-left flex items-center gap-3">
                          <img 
                            src={user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.uid}`} 
                            referrerPolicy="no-referrer"
                            alt={user.name || user.displayName} 
                            className="w-7 h-7 rounded-full bg-[#0d0d18] border border-white/5 group-hover:border-cyan-500/30 transition-all shadow select-none"
                          />
                          <div>
                            <span className="font-semibold text-white tracking-wide block">{user.name || user.displayName || "Student User"}</span>
                            <span className="text-[9px] font-mono text-[#505f73] group-hover:text-cyan-400/80 transition-colors uppercase">
                              Status: Fully Enrolled
                            </span>
                          </div>
                        </td>

                        {/* Email Address column */}
                        <td className="py-3.5 px-6 text-slate-300 font-mono">
                          {user.email || "No Email Found"}
                        </td>

                        {/* Join Date column */}
                        <td className="py-3.5 px-6 text-slate-400 font-mono">
                          {formatJoinDate(user.createdAtStr)}
                        </td>

                        {/* Identifier Node */}
                        <td className="py-3.5 px-6 text-right select-all">
                          <span className="font-mono text-[9px] text-cyan-400/90 uppercase bg-slate-900 border border-white/5 px-2 py-0.5 rounded cursor-copy" title={user.uid}>
                            {user.uid}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// Subordinate component: individual interactive slot row editor
interface VideoSlotRowProps {
  key?: string | number;
  index: number;
  vid: Video;
  videoIdExtracted: string;
  isSelectedForPreview: boolean;
  onPreviewSelect: () => void;
  onSave: (title: string, url: string, duration: string, desc: string) => void;
  onDelete: () => void;
}

function VideoSlotRow({ 
  index, 
  vid, 
  videoIdExtracted, 
  isSelectedForPreview, 
  onPreviewSelect, 
  onSave, 
  onDelete 
}: VideoSlotRowProps) {
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(vid.title);
  const [url, setUrl] = useState(vid.youtubeUrl || `https://www.youtube.com/watch?v=${(vid as any).youtubeId || ""}`);
  const [duration, setDuration] = useState(vid.duration);
  const [description, setDescription] = useState(vid.description);

  // Sync state if initial props change
  React.useEffect(() => {
    setTitle(vid.title);
    setUrl(vid.youtubeUrl || `https://www.youtube.com/watch?v=${(vid as any).youtubeId || ""}`);
    setDuration(vid.duration);
    setDescription(vid.description);
  }, [vid]);

  const localExtractedId = extractYoutubeId(url);

  return (
    <div 
      className={`p-4 rounded-xl border transition-all text-left flex flex-col gap-3 ${
        isSelectedForPreview 
          ? 'bg-cyan-950/10 border-cyan-500/30 shadow-indigo-950/20 shadow-md' 
          : 'bg-slate-900/40 border-white/5 hover:border-slate-800'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.03] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#121223] border border-white/10 flex items-center justify-center font-mono text-[10px] font-bold text-slate-400">
            {index + 1}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500">{vid.id}</span>
          {!isEditing && (
            <span className="text-[10px] bg-[#11111d] text-slate-400 font-mono py-0.5 px-2 rounded border border-white/5">
              {duration}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Trigger Button */}
          <button
            onClick={onPreviewSelect}
            className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded transition-all cursor-pointer ${
              isSelectedForPreview 
                ? 'bg-cyan-500 text-slate-950 font-bold' 
                : 'bg-[#11111d] hover:bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
            }`}
            title="Load in Admin view player"
          >
            <Eye className="h-3 w-3" />
            <span>{isSelectedForPreview ? "Active Embed" : "Embed Preview"}</span>
          </button>

          <button
            onClick={() => {
              if (isEditing) {
                onSave(title, url, duration, description);
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className="flex items-center gap-1 bg-[#11111d] hover:bg-slate-900 border border-white/5 text-slate-300 hover:text-cyan-400 text-[10px] font-mono px-2.5 py-1 rounded transition-all cursor-pointer"
          >
            {isEditing ? <Save className="h-3 w-3 text-cyan-400" /> : <Edit3 className="h-3 w-3" />}
            <span>{isEditing ? "Save Video" : "Edit Slot"}</span>
          </button>

          <button
            onClick={onDelete}
            className="text-slate-500 hover:text-red-400 p-1 bg-[#11111d] border border-white/5 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
            title="Delete lecture slot"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3 font-sans w-full text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Slot Title Designation</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#11111d] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Duration</label>
              <input 
                type="text" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#11111d] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">
              Paste Youtube URL link
            </label>
            <div className="relative">
              <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=ok-plXXHpLY"
                className="w-full bg-[#11111d] border border-white/10 rounded-lg py-2 pl-8 pr-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-500 font-medium">
              <span>Dynamic parser result:</span>
              <span className={localExtractedId ? "text-cyan-400 font-bold" : "text-amber-500 font-bold"}>
                {localExtractedId ? `✓ Valid ID: ${localExtractedId}` : "⚠ Paste YouTube link"}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-0.5">Lecture Description Summary</label>
            <textarea 
              rows={2}
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#11111d] border border-white/10 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 resize-none scrollbar"
            />
          </div>

          <button
            onClick={() => {
              onSave(title, url, duration, description);
              setIsEditing(false);
            }}
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl active:scale-[0.98] transition-all cursor-pointer text-center font-sans"
          >
            Save Changes to Slot
          </button>
        </div>
      ) : (
        <div className="text-left font-sans flex flex-col gap-1 w-full">
          <h4 className="text-xs font-semibold text-slate-200 pr-10">{vid.title}</h4>
          
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-1 w-full truncate">
            <Youtube className="h-3.5 w-3.5 text-red-500 font-semibold" />
            <span className="truncate max-w-[280px]" title={url}>{url}</span>
            <span className="text-slate-700">&bull;</span>
            <span className="text-cyan-400 font-bold">id: {videoIdExtracted || "none"}</span>
          </div>

          {vid.description && (
            <p className="text-[10px] text-slate-400 leading-normal mt-1 border-t border-white/[0.02] pt-1.5 line-clamp-1 font-sans">
              {vid.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
