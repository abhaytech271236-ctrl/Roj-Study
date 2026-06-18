import React, { useState, useEffect } from "react";
import { 
  Bell, Sun, Moon, Search, Mail, Sparkles, GraduationCap, 
  Menu, X, ShieldAlert, CheckCircle, Flame, LogIn, Laptop, ChevronLeft, Lock
} from "lucide-react";
import { Playlist, UserState, Certificate, Video, NotificationItem } from "./types";
import { PLAYLISTS_DATA } from "./data";

// Sub-component Imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingView from "./components/LandingView";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import PlaylistPlayer from "./components/PlaylistPlayer";
import CommunityChat from "./components/CommunityChat";
import JobPortal from "./components/JobPortal";
import InternshipsView from "./components/InternshipsView";
import ProfileView from "./components/ProfileView";
import AdminPanel from "./components/AdminPanel";
import AIHelper from "./components/AIHelper";
import AuthModal from "./components/AuthModal";
import AuthPage from "./components/AuthPage";
import CertificateModal from "./components/CertificateModal";
import LegalViews from "./components/LegalViews";
import Ads, { ADS_CONFIG } from "./components/Ads";
import { rzAuth } from "./lib/firebase";

export default function App() {
  // 1. Core State Managers
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const local = localStorage.getItem("rojstudy_playlists");
    if (!local) return PLAYLISTS_DATA;
    try {
      const parsed: Playlist[] = JSON.parse(local);
      // Heal/Merge parsed playlists with hardcoded template updates and preserve custom ones
      const customPlaylists = parsed.filter(p => !PLAYLISTS_DATA.some(tp => tp.id === p.id));
      const mergedTemplatePlaylists = PLAYLISTS_DATA.map(templatePlaylist => {
        const userPlaylist = parsed.find(p => p.id === templatePlaylist.id);
        if (!userPlaylist) return templatePlaylist;
        
        // Merge videos
        const mergedVideos = templatePlaylist.videos.map(templateVid => {
          const userVid = userPlaylist.videos.find(v => v.id === templateVid.id);
          if (!userVid) return templateVid;
          
          return {
            ...userVid,
            title: templateVid.title,
            youtubeUrl: templateVid.youtubeUrl || userVid.youtubeUrl,
            duration: templateVid.duration,
            description: templateVid.description
          };
        });

        const customVideos = userPlaylist.videos.filter(v => !templatePlaylist.videos.some(tv => tv.id === v.id));

        return {
          ...userPlaylist,
          title: templatePlaylist.title,
          accentColor: templatePlaylist.accentColor,
          totalVideos: mergedVideos.length + customVideos.length,
          videos: [...mergedVideos, ...customVideos]
        };
      });
      return [...mergedTemplatePlaylists, ...customPlaylists];
    } catch (e) {
      return PLAYLISTS_DATA;
    }
  });

  // User details state (Initial mock session variables if not logged in)
  const [userState, setUserState] = useState<UserState>(() => {
    const local = localStorage.getItem("rojstudy_user");
    return local ? JSON.parse(local) : {
      name: "Guest Student",
      email: "",
      isLoggedIn: false,
      avatar: "",
      bio: "Enrolled in Roj Study Academy.",
      completedVideoIds: [],
      bookmarkedVideoIds: [],
      xp: 0,
      streak: 1,
      certificates: [],
      watchHistory: [],
      examScores: {}
    };
  });

  // Current active viewport router state
  const [currentView, setCurrentView] = useState<string>("landing");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId) || null;

  // Track the modal mode (LOGIN or SIGNUP or FORGOT) dynamically
  const [authModalMode, setAuthModalMode] = useState<"LOGIN" | "SIGNUP" | "FORGOT">("LOGIN");

  // Structural details
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  // Notification list state container
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "n1", title: "Welcome to Roj Study!", message: "Your interactive student profile is online. Dive into HTML, CSS, JavaScript directly inside the browser playground.", time: "Just now", read: false },
    { id: "n2", title: "Certificate Unlocked! 🎓", message: "Congratulations! You have been awarded the Generative AI Specialization Degree.", time: "1 day ago", read: true }
  ]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Admin lock states
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState("");

  // Active viewing certificate detail container
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  // User notes state mapping: "playlistID-videoID" => text (saved notes)
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>(() => {
    let emailKey = "guest";
    try {
      const uLocal = localStorage.getItem("rojstudy_user");
      if (uLocal) {
        const parsed = JSON.parse(uLocal);
        if (parsed && parsed.email) {
          emailKey = parsed.email.trim().toLowerCase();
        }
      }
    } catch(err) {
      emailKey = "guest";
    }
    
    const local = localStorage.getItem(`rojstudy_notes_${emailKey}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return {};
      }
    } else {
      if (emailKey === "mrabhaypranker1236@gmail.com") {
        return {
          "internship-1-v1": "HTML uses tags. Semantic elements like h1, section, art, and footer make coding readable for SEO algorithms."
        };
      }
      return {};
    }
  });

  // Sync state managers into localStorage to achieve offline-continuity persistence
  useEffect(() => {
    localStorage.setItem("rojstudy_playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("rojstudy_user", JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
    const emailKey = userState.email ? userState.email.trim().toLowerCase() : "guest";
    localStorage.setItem(`rojstudy_notes_${emailKey}`, JSON.stringify(savedNotes));
  }, [savedNotes, userState.email]);

  // Sync scroll animations on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView, selectedPlaylist]);

  // Automatically collapse the sidebar on mobile and tablet displays (< 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Synchronously listen/subscribe to secure Firebase authentication session states
  useEffect(() => {
    const unsubscribe = rzAuth.onAuthStateChanged((user) => {
      if (user) {
        // Load target email's personalized notes
        const emailKey = user.email ? user.email.trim().toLowerCase() : "guest";
        const localNotes = localStorage.getItem(`rojstudy_notes_${emailKey}`);
        if (localNotes) {
          try {
            setSavedNotes(JSON.parse(localNotes));
          } catch (e) {
            setSavedNotes({});
          }
        } else {
          if (emailKey === "mrabhaypranker1236@gmail.com") {
            setSavedNotes({
              "internship-1-v1": "HTML uses tags. Semantic elements like h1, section, art, and footer make coding readable for SEO algorithms."
            });
          } else {
            setSavedNotes({});
          }
        }

        setUserState({
          uid: user.uid,
          name: user.name,
          email: user.email,
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
          isLoggedIn: true,
          bio: user.bio || "Enrolled in Roj Study Academy.",
          completedVideoIds: user.completedVideoIds || [],
          bookmarkedVideoIds: user.bookmarkedVideoIds || [],
          xp: typeof user.xp === 'number' ? user.xp : 0,
          streak: typeof user.streak === 'number' ? user.streak : 1,
          certificates: user.certificates || [],
          watchHistory: user.watchHistory || [],
          examScores: user.examScores || {}
        });
      } else {
        // Clear notes when logging out
        const localNotes = localStorage.getItem("rojstudy_notes_guest");
        if (localNotes) {
          try {
            setSavedNotes(JSON.parse(localNotes));
          } catch (e) {
            setSavedNotes({});
          }
        } else {
          setSavedNotes({});
        }

        setUserState({
          name: "Guest Student",
          email: "",
          isLoggedIn: false,
          avatar: "",
          bio: "Enrolled in Roj Study Academy.",
          completedVideoIds: [],
          bookmarkedVideoIds: [],
          xp: 0,
          streak: 1,
          certificates: [],
          watchHistory: [],
          examScores: {}
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Synchronously persist student's progress updates to Firestore / user-specific localStorage fallback
  useEffect(() => {
    if (userState.isLoggedIn && userState.uid && userState.email) {
      const payload = {
        name: userState.name,
        photoURL: userState.avatar,
        bio: userState.bio,
        completedVideoIds: userState.completedVideoIds,
        bookmarkedVideoIds: userState.bookmarkedVideoIds,
        xp: userState.xp,
        streak: userState.streak,
        certificates: userState.certificates,
        watchHistory: userState.watchHistory,
        examScores: userState.examScores || {}
      };
      rzAuth.saveUserProfile(userState.uid, payload)
        .catch(err => console.warn("Failed to sync student progress with database: ", err));
    }
  }, [
    userState.isLoggedIn, userState.uid, userState.email, userState.name, userState.avatar, userState.bio, 
    userState.completedVideoIds, userState.bookmarkedVideoIds, userState.xp, userState.streak, 
    userState.certificates, userState.watchHistory, userState.examScores
  ]);

  // 2. Action Callback handlers
  const handleLoginSuccess = (name: string, email: string, avatar?: string) => {
    // Session is handled by onAuthStateChanged subscription trigger, but close modal and redirect to hub
    setIsAuthModalOpen(false);
    setCurrentView("dashboard");
    
    // Increment total registered learners statistics on login/registration
    fetch("/api/learners-stats/increment", { method: "POST" })
      .catch(err => console.warn("Failed to increment stats on login:", err));
    
    // Add success notification
    const newNotif: NotificationItem = {
      id: `n_auth_${Date.now()}`,
      title: "Successfully Logged In",
      message: `Welcome, ${name}! Start watching code lectures and practicing compilers now.`,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLogout = async () => {
    try {
      await rzAuth.signOut();
    } catch (err) {
      console.warn("Error signing out:", err);
    }
    setUserState({
      name: "Guest Student",
      email: "",
      isLoggedIn: false,
      avatar: "",
      bio: "Enrolled in Roj Study Academy.",
      completedVideoIds: [],
      bookmarkedVideoIds: [],
      xp: 0,
      streak: 1,
      certificates: [],
      watchHistory: [],
      examScores: {}
    });
    setIsAdminVerified(false);
    setCurrentView("landing");
  };

  const handleAdminVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === "158912") {
      setIsAdminVerified(true);
      setIsAdminPasswordModalOpen(false);
      setCurrentView("admin");
      setAdminPasswordInput("");
      setAdminPasswordError("");
    } else {
      setAdminPasswordError("Wrong security code. Access denied.");
    }
  };

  const handleUpdateCompletedVideo = (playlistId: string, videoId: string, completed: boolean) => {
    const uniqueKey = `${playlistId}-${videoId}`;
    setUserState(prev => {
      let completedList = [...prev.completedVideoIds];
      if (completed) {
        if (!completedList.includes(uniqueKey)) {
          completedList.push(uniqueKey);
        }
      } else {
        completedList = completedList.filter(id => id !== uniqueKey);
      }

      // Check if complete playlist finished to automatically generate credential certificate!
      const targetPlaylist = playlists.find(p => p.id === playlistId);
      let updatedCertificates = [...prev.certificates];
      
      if (targetPlaylist) {
        const listVideoIds = targetPlaylist.videos.map(vid => `${playlistId}-${vid.id}`);
        const completedCountOfList = listVideoIds.filter(id => completedList.includes(id)).length;
        const isCurrentlyFinished = completedCountOfList === targetPlaylist.videos.length;

        const alreadyHasCert = prev.certificates.some(c => c.courseId === playlistId);

        if (isCurrentlyFinished && !alreadyHasCert) {
          // Unlocked certificate automatically!
          const newCert: Certificate = {
            id: `CERT-ROJ-${Math.floor(100000 + Math.random() * 900000)}`,
            studentName: prev.name,
            courseId: playlistId,
            courseName: targetPlaylist.title,
            date: new Date().toISOString().split("T")[0]
          };
          updatedCertificates.push(newCert);

          // Add a notification
          const newNotif: NotificationItem = {
            id: `n_cert_${Date.now()}`,
            title: "🎓 Degree Conferred!",
            message: `Bravo! You finished 100% of "${targetPlaylist.title}". Head to your profile to download your graduation PDF certificate.`,
            time: "Just now",
            read: false
          };
          setTimeout(() => {
            setNotifications(o => [newNotif, ...o]);
          }, 400);
        }
      }

      return {
        ...prev,
        completedVideoIds: completedList,
        certificates: updatedCertificates
      };
    });
  };

  const handleUpdateBookmarkVideo = (playlistId: string, videoId: string, bookmarked: boolean) => {
    const uniqueKey = `${playlistId}-${videoId}`;
    setUserState(prev => {
      let bookmarkedList = [...prev.bookmarkedVideoIds];
      if (bookmarked) {
        if (!bookmarkedList.includes(uniqueKey)) {
          bookmarkedList.push(uniqueKey);
        }
      } else {
        bookmarkedList = bookmarkedList.filter(id => id !== uniqueKey);
      }
      return {
        ...prev,
        bookmarkedVideoIds: bookmarkedList
      };
    });
  };

  const handleAwardCertificate = (courseId: string, score: number, grade: string, customStudentName?: string) => {
    const targetPlaylist = playlists.find(p => p.id === courseId);
    if (!targetPlaylist) return;
    
    setUserState(prev => {
      const alreadyHasCert = prev.certificates.some(c => c.courseId === courseId);
      let updatedCertificates = [...prev.certificates];
      
      const finalName = customStudentName || prev.name;
      
      const newCert: Certificate = {
        id: `CERT-ROJ-${Math.floor(100000 + Math.random() * 900000)}`,
        studentName: finalName,
        courseId: courseId,
        courseName: targetPlaylist.title,
        date: new Date().toISOString().split("T")[0],
        score: score,
        grade: grade
      };
      
      if (alreadyHasCert) {
        updatedCertificates = updatedCertificates.map(c => c.courseId === courseId ? newCert : c);
      } else {
        updatedCertificates.push(newCert);
      }

      const newNotif: NotificationItem = {
        id: `n_cert_${Date.now()}`,
        title: "🎓 Specialization Certified!",
        message: `Outstanding job! You scored ${score}/50 on the "${targetPlaylist.title}" Exam. Your verifiable completion certificate is unlocked!`,
        time: "Just now",
        read: false
      };
      setTimeout(() => {
        setNotifications(o => [newNotif, ...o]);
      }, 400);

      const updatedScores = { ...(prev.examScores || {}), [courseId]: score };

      return {
        ...prev,
        name: finalName,
        xp: prev.xp + 500,
        certificates: updatedCertificates,
        examScores: updatedScores
      };
    });
  };

  const handleXpEarned = (amount: number) => {
    setUserState(prev => ({
      ...prev,
      xp: prev.xp + amount
    }));
  };

  const handleSaveNote = (videoUniqueId: string, text: string) => {
    setSavedNotes(prev => {
      const next = { ...prev, [videoUniqueId]: text };
      const emailKey = userState.email ? userState.email.trim().toLowerCase() : "guest";
      localStorage.setItem(`rojstudy_notes_${emailKey}`, JSON.stringify(next));
      return next;
    });
  };

  // Admin dynamic playlist management callbacks
  const handleAddVideoToPlaylist = (playlistId: string, newVideo: Video) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const updatedVideos = [...p.videos, newVideo];
        return {
          ...p,
          videos: updatedVideos,
          totalVideos: updatedVideos.length
        };
      }
      return p;
    }));
  };

  const handleDeleteVideoFromPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const updatedVideos = p.videos.filter(v => v.id !== videoId);
        return {
          ...p,
          videos: updatedVideos,
          totalVideos: updatedVideos.length
        };
      }
      return p;
    }));
  };

  const handleUpdateVideoInPlaylist = (playlistId: string, videoId: string, updatedFields: Partial<Video>) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        const updatedVideos = p.videos.map(v => v.id === videoId ? { ...v, ...updatedFields } : v);
        return {
          ...p,
          videos: updatedVideos
        };
      }
      return p;
    }));
  };

  const handleCreatePlaylist = (newPlaylist: Playlist) => {
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const handleUpdateProfile = (name: string, bio: string, avatar: string) => {
    setUserState(prev => ({
      ...prev,
      name,
      bio,
      avatar
    }));
  };

  const handleOpenCertificate = (playlistId: string) => {
    const targetCert = userState.certificates.find(c => c.courseId === playlistId);
    if (targetCert) {
      setActiveCertificate(targetCert);
    } else {
      alert("Please finish all lectures in this course track to unlock this credential!");
    }
  };

  // Helper context router navigation selector
  const selectPlaylistToWatch = (playlist: Playlist) => {
    if (!userState.isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedPlaylistId(playlist.id);
    setCurrentView("playlist-watching");

    // Add into user watch history in userState
    setUserState(prev => {
      const filteredHistory = prev.watchHistory.filter(h => h.playlistId !== playlist.id);
      const newHistoryItem = {
        playlistId: playlist.id,
        videoId: playlist.videos[0]?.id || "v1",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return {
        ...prev,
        watchHistory: [newHistoryItem, ...filteredHistory].slice(0, 5)
      };
    });
  };

  // Guard routing view navigation blocks
  const [pendingAdminView, setPendingAdminView] = useState<string | null>(null);

  const handleNavWithGuard = (view: string) => {
    if (
      view === "landing" || 
      view === "faq" || 
      view === "login" || 
      view === "signup" || 
      view === "forgot" ||
      view === "privacy" ||
      view === "terms" ||
      view === "disclaimer" ||
      view === "about" ||
      view === "contact"
    ) {
      if (view === "login") setAuthModalMode("LOGIN");
      if (view === "signup") setAuthModalMode("SIGNUP");
      if (view === "forgot") setAuthModalMode("FORGOT");
      setCurrentView(view);
      setSelectedPlaylistId(null);
      return;
    }

    if (!userState.isLoggedIn) {
      setAuthModalMode("LOGIN");
      setIsAuthModalOpen(true);
      return;
    }

    if (view === "admin" && !isAdminVerified) {
      setAdminPasswordInput("");
      setAdminPasswordError("");
      setIsAdminPasswordModalOpen(true);
      return;
    }

    setCurrentView(view);
    setSelectedPlaylistId(null);
  };

  // Parse SEO and dynamic sitemap deep-linking URL queries on initialization mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view");
      const playlistParam = params.get("playlist");
      
      if (path === "/admin" || path.startsWith("/admin")) {
        handleNavWithGuard("admin");
      } else if (viewParam) {
        handleNavWithGuard(viewParam);
      } else if (playlistParam) {
        const found = playlists.find(p => p.id === playlistParam);
        if (found) {
          setSelectedPlaylistId(found.id);
          setCurrentView("playlist-watching");
          if (!userState.isLoggedIn) {
            setIsAuthModalOpen(true);
          }
        }
      }
    }
  }, [userState.isLoggedIn, playlists]);

  // Helper computed variables
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${isLightMode ? 'light bg-slate-50 text-slate-900' : 'bg-[#0b0b14] text-slate-100'}`}>
      
      {/* 1. Global Navigation Navbar Area */}
      <Navbar 
        onNavigate={handleNavWithGuard} 
        onLoginClick={(mode) => {
          handleNavWithGuard(mode === "LOGIN" ? "login" : "signup");
        }}
        isLoggedIn={userState.isLoggedIn}
        userName={userState.name}
        userAvatar={userState.avatar}
      />

      {/* Top Horizontal Banner Google AdSense Place */}
      {ADS_CONFIG.ENABLE_ADS && (
        <div className="w-full border-b border-white/5 bg-[#090911]/40 py-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <Ads 
              id="adsense-global-top"
              type="top-banner"
            />
          </div>
        </div>
      )}

      {/* 2. Structured Dashboard Layout Wrapper */}
      {userState.isLoggedIn && currentView !== "login" && currentView !== "signup" && currentView !== "forgot" ? (
        <div className="flex-1 flex relative">
          
          {/* Collapsible Left Rail Sidebar component */}
          <Sidebar 
            currentView={currentView}
            onNavigate={handleNavWithGuard}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            streak={userState.streak}
            userName={userState.name}
            userAvatar={userState.avatar}
            onLogout={handleLogout}
          />

          {/* Subview router container */}
          <main className="flex-1 overflow-x-hidden p-4 sm:p-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
              
               {/* Top Mini Header Bar inside member zone */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4.5 mb-2 gap-4">
                <div className="text-left">
                  {currentView !== "dashboard" ? (
                    <button 
                      onClick={() => {
                        if (currentView === "playlist-watching") {
                          setCurrentView("playlists-library");
                        } else {
                          setCurrentView("dashboard");
                        }
                      }}
                      className="flex items-center gap-2 text-xs text-cyan-400 hover:text-white font-mono font-bold tracking-wider transition-all group bg-slate-900 border border-white/5 px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      <span>BACK TO {currentView === "playlist-watching" ? "LIBRARY" : "DASHBOARD"}</span>
                    </button>
                  ) : (
                    <div className="hidden md:block">
                      <h2 className="text-sm font-semibold tracking-wide text-slate-300">Roj Study Classroom Profile</h2>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">conferred graduation block ID: SCHOLAR-90314</p>
                    </div>
                  )}
                </div>

                {/* Indicators & Buttons Panel */}
                <div className="flex items-center gap-3.5 ml-auto relative">
                  
                  {/* Notifications Icon Button */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="p-2.2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 hover:border-slate-800 relative text-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      <Bell className="h-4.5 w-4.5" />
                      {unreadNotifCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
                      )}
                    </button>

                    {/* Popover notifications layout card */}
                    {isNotifOpen && (
                      <div className="absolute right-0 top-11 z-50 w-80 bg-[#121223] border border-white/10 rounded-2xl shadow-2xl p-4 text-left flex flex-col gap-3 font-sans">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Inbox Highlights</span>
                          <button 
                            onClick={() => {
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                              setIsNotifOpen(false);
                            }}
                            className="text-[9px] font-mono text-cyan-400 hover:underline"
                          >
                            Mark all read
                          </button>
                        </div>
                        
                        <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto scrollbar">
                          {notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={`p-3 rounded-xl border flex gap-2 items-start ${notif.read ? 'bg-slate-950/40 border-slate-900' : 'bg-[#0b0b14] border-[#06b6d4]/20'}`}
                            >
                              <div className="bg-cyan-500/15 p-1 rounded-lg shrink-0 mt-0.5 text-cyan-400">
                                <GraduationCap className="h-3.5 w-3.5" />
                              </div>
                              <div className="text-left font-sans">
                                <h6 className="text-xs font-semibold text-white leading-tight">{notif.title}</h6>
                                <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{notif.message}</p>
                                <span className="text-[8px] font-mono text-slate-500 mt-1 block">{notif.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dark Mode visual toggle indicator */}
                  <button 
                    onClick={() => setIsLightMode(!isLightMode)}
                    className="p-2.2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/5 hover:border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
                    title="Toggle Theme"
                  >
                    {isLightMode ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />}
                  </button>
                </div>
              </div>

              {/* ROUTER SUB-VIEW DISPATCHER */}
              {currentView === "dashboard" && (
                <DashboardView 
                  userState={userState}
                  playlists={playlists}
                  onSelectPlaylist={selectPlaylistToWatch}
                  onNavigate={handleNavWithGuard}
                />
              )}

               {(currentView === "playlists-library" || currentView === "landing") && (
                <div className="flex flex-col gap-6">
                  <div className="text-left">
                    <h1 className="font-display font-semibold text-xl sm:text-2xl text-white">Interactive Playlists Library</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Select a guided specialization curriculum. Mark courses and test sandbox compilers.</p>
                  </div>
                  <LandingView 
                    playlists={playlists}
                    onExplorePlaylist={selectPlaylistToWatch}
                    onNavigate={handleNavWithGuard}
                    onBeginLearning={() => setCurrentView("dashboard")}
                  />
                </div>
              )}

              {currentView === "faq" && (
                <div className="flex flex-col gap-6">
                  <div className="text-left">
                    <h1 className="font-display font-semibold text-xl sm:text-2xl text-white">Frequently Asked Questions</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Everything you need to know about academic credentials and active courses.</p>
                  </div>
                  <LandingView 
                    playlists={playlists}
                    onExplorePlaylist={selectPlaylistToWatch}
                    onNavigate={handleNavWithGuard}
                    onBeginLearning={() => setCurrentView("dashboard")}
                  />
                </div>
              )}

              {(currentView === "privacy" || currentView === "terms" || currentView === "disclaimer" || currentView === "about" || currentView === "contact") && (
                <LegalViews 
                  currentSubView={currentView} 
                  onNavigate={handleNavWithGuard} 
                />
              )}

              {currentView === "playlist-watching" && selectedPlaylist && (
                <PlaylistPlayer 
                  playlist={selectedPlaylist}
                  userState={userState}
                  onUpdateCompletedVideo={handleUpdateCompletedVideo}
                  onUpdateBookmarkVideo={handleUpdateBookmarkVideo}
                  onXpEarned={handleXpEarned}
                  onSaveNote={handleSaveNote}
                  savedNotes={savedNotes}
                  onUpdateVideo={handleUpdateVideoInPlaylist}
                  onAwardCertificate={handleAwardCertificate}
                  onBack={() => setCurrentView("playlists-library")}
                />
              )}

              {currentView === "chat" && (
                <CommunityChat 
                  userName={userState.name}
                  userAvatar={userState.avatar}
                  userEmail={userState.email}
                  userId={userState.uid}
                  onBack={() => setCurrentView("dashboard")}
                />
              )}

              {currentView === "jobs" && (
                <JobPortal onBack={() => setCurrentView("dashboard")} />
              )}

              {currentView === "internships" && (
                <InternshipsView onBack={() => setCurrentView("dashboard")} />
              )}

              {currentView === "profile" && (
                <ProfileView 
                  userState={userState}
                  playlists={playlists}
                  onUpdateName={handleUpdateProfile}
                  onOpenCertificate={handleOpenCertificate}
                  onBack={() => setCurrentView("dashboard")}
                />
              )}

              {currentView === "admin" && (
                isAdminVerified ? (
                  <AdminPanel 
                    playlists={playlists}
                    onAddVideoToPlaylist={handleAddVideoToPlaylist}
                    onDeleteVideoFromPlaylist={handleDeleteVideoFromPlaylist}
                    onUpdateVideoInPlaylist={handleUpdateVideoInPlaylist}
                    onCreatePlaylist={handleCreatePlaylist}
                    onBack={() => setCurrentView("dashboard")}
                  />
                ) : (
                  <div className="glass-panel text-left max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-2xl border border-red-500/20 bg-slate-950/80 aspect-video flex flex-col justify-center items-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-red-500/5 blur-[50px] pointer-events-none" />
                    <div className="bg-red-500/10 p-4 rounded-full text-red-400 mb-5 border border-red-500/15">
                      <Lock className="h-7 w-7 animate-bounce" />
                    </div>
                    <h2 className="text-base font-semibold text-white tracking-wide mb-2 uppercase text-center">Unauthorised Access Blocked</h2>
                    <p className="text-xs text-slate-400 text-center max-w-sm leading-relaxed mb-6 font-mono">
                      Security Exception: System node restricted. Administrative actions are fully protected. Please enter correct unlock code. (Hint: security PIN is <span className="text-cyan-400 font-bold">158912</span>)
                    </p>
                    <button 
                      onClick={() => {
                        setAdminPasswordInput("");
                        setAdminPasswordError("");
                        setIsAdminPasswordModalOpen(true);
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-[10.5px] px-5 py-2.5 rounded-xl transition-all tracking-wider shadow-lg shadow-red-950/40 active:scale-95 cursor-pointer uppercase"
                    >
                      Unlock Administrative Console
                    </button>
                  </div>
                )
              )}
            </div>
          </main>
        </div>
      ) : (
        /* 3. Public landing viewport */
        <div className="flex-1 flex flex-col justify-start">
          {currentView === "login" || currentView === "signup" || currentView === "forgot" ? (
            <AuthPage 
              initialMode={currentView === "login" ? "LOGIN" : currentView === "signup" ? "SIGNUP" : "FORGOT"}
              onLoginSuccess={handleLoginSuccess}
              onNavigate={handleNavWithGuard}
            />
          ) : currentView === "faq" ? (
            <div className="max-w-4xl mx-auto py-16 px-4">
              <LandingView 
                playlists={playlists}
                onExplorePlaylist={selectPlaylistToWatch}
                onNavigate={handleNavWithGuard}
                onBeginLearning={() => {
                  if (userState.isLoggedIn) {
                    setCurrentView("dashboard");
                  } else {
                    handleNavWithGuard("login");
                  }
                }}
              />
            </div>
          ) : (
            <LandingView 
              playlists={playlists}
              onExplorePlaylist={selectPlaylistToWatch}
              onNavigate={handleNavWithGuard}
              onBeginLearning={() => {
                if (userState.isLoggedIn) {
                  setCurrentView("dashboard");
                } else {
                  handleNavWithGuard("login");
                }
              }}
            />
          )}
        </div>
      )}

      {/* 4. Global UI Components / Popups */}
      <Footer onNavigate={handleNavWithGuard} />

      {/* Sticky Bottom Ad for Mobile Devices (Responsive) */}
      <Ads id="adsense-mobile-sticky" type="mobile-sticky" />
      
      {/* Floating Gemini AI Tutor chatbot */}
      <AIHelper />

      {/* Auth Login card popup */}
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          initialMode={authModalMode}
        />
      )}

      {/* Certificate popup viewer modal */}
      {activeCertificate && (
        <CertificateModal 
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {/* Admin Password verification modal */}
      {isAdminPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 select-none animate-in fade-in duration-200">
          <div className="bg-[#0b0c15] border border-cyan-500/15 max-w-sm w-full rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-500/5 blur-[60px] pointer-events-none" />
            
            {/* Top Security Icon */}
            <div className="inline-flex items-center justify-center bg-cyan-500/15 text-cyan-400 p-3 rounded-xl border border-cyan-500/25 mb-4 shadow shadow-cyan-950/50">
              <Lock className="h-5 w-5 animate-pulse" />
            </div>

            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-sans mb-1">🔐 SECURITY VERIFICATION</h3>
            <p className="text-[10px] text-slate-400 font-mono mb-5 uppercase tracking-widest leading-relaxed">
              restricted developer console
            </p>

            <form onSubmit={handleAdminVerifySubmit} className="flex flex-col gap-4">
              <div className="text-left">
                <label className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1.5">
                  Enter Security Key Code:
                </label>
                <input 
                  type="password" 
                  placeholder="&bull; &bull; &bull; &bull; &bull; &bull;"
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    if (adminPasswordError) setAdminPasswordError("");
                  }}
                  className="w-full bg-[#11121d] border border-white/10 rounded-xl py-3 px-4 text-center text-xs font-mono font-bold text-white placeholder-slate-700 tracking-[0.3em] focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
                  maxLength={12}
                  autoFocus
                  required
                />
              </div>

              {adminPasswordError && (
                <p className="text-[10.5px] font-mono text-red-400 text-center leading-normal animate-shake">
                  ❌ {adminPasswordError}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminPasswordModalOpen(false);
                    setAdminPasswordInput("");
                    setAdminPasswordError("");
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white font-mono font-bold text-[10px] py-2.5 px-3 rounded-xl transition-all cursor-pointer uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 font-bold font-mono text-[10px] py-2.5 px-3 rounded-xl transition-all shadow-lg shadow-cyan-900/35 active:scale-95 cursor-pointer uppercase"
                >
                  ACCESS ZONE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
