import React, { useState } from "react";
import { 
  Building, Briefcase, Calendar, Award, CheckCircle, 
  ArrowUpRight, ChevronLeft, Search, HelpCircle, MapPin, 
  ExternalLink, UserCheck, Terminal, Compass, Flame, Info
} from "lucide-react";

interface InternshipsViewProps {
  onBack?: () => void;
}

export default function InternshipsView({ onBack }: InternshipsViewProps) {
  const [selectedInternship, setSelectedInternship] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSegment, setActiveSegment] = useState<"all" | "high-stipend" | "faang">("all");

  const unstopInternships = [
    {
      id: 1,
      title: "Google Software Engineering Apprentice / Intern",
      company: "Google India",
      logo: "🔴🟢🔵",
      stipend: "₹50,000 - ₹65,000 / month",
      location: "Bangalore / Hyderabad (Hybrid)",
      duration: "6 Months",
      isFaang: true,
      eligibility: "Pre-final / Final Year B.Tech, M.Tech, MCA, or Equivalent CS students",
      unstopLink: "https://unstop.com/competitions/google-online-challenge-google-india-618492",
      description: "Participate in the legendary Google Online Challenge (GOC) hosted on platforms like Unstop and Google Careers. This pathway identifies premium problem solvers for apprentice assignments inside Google engineering teams.",
      badges: ["C++", "Java", "Python", "Data Structures", "Algorithms"],
      steps: [
        "Create/update your Unstop profile, matching your resume's technical credentials perfectly.",
        "Register for the Google Online Challenge (GOC) campaign on Unstop during open windows.",
        "Attend the Online Assessment (60 mins): Includes 2 algorithmic challenge questions ranging from Medium to Hard LeetCode style.",
        "Shortlisted profiles undergo a recruiter review. Keep your GitHub links and portfolio active.",
        "Face 2 rounds of Technical Video interviews focusing on real-time coding, design patterns, and complex complexity analysis."
      ],
      sampleQuestion: "Design an optimized stream processing algorithm with constant window average retrieval in O(1) time complexity."
    },
    {
      id: 2,
      title: "Flipkart Runway SDE Internship (Season 5)",
      company: "Flipkart Private Ltd",
      logo: "🟡🔵",
      stipend: "₹1,00,000 / month",
      location: "Bangalore, India",
      duration: "3 - 6 Months",
      isFaang: false,
      isHighStipend: true,
      eligibility: "Engineering students from all streams (Pre-final/Final women developers track)",
      unstopLink: "https://unstop.com/p/flipkart-runway-season-4-flipkart-895101",
      description: "Flipkart Runway is a flagship gender-inclusivity SDE internship pathway designed to support and recruit talented women engineers. High test scorers receive direct technical SDE interview calls.",
      badges: ["React / React Native", "Node.js", "System Design", "Problem Solving"],
      steps: [
        "Register on Unstop Flipkart Runway Hub, submitting your stream and academic GPA.",
        "Solve the Round 1 MCQ Assessment on Unstop (Tech Basics, OS, DBMS, Networks & Core CS).",
        "Participate in the Round 2 Online Coding Challenge: 2 competitive programming problems.",
        "Submit a brief structured project solution or video pitch detailing your technology framework.",
        "Complete the 1-on-1 virtual design & algorithmic interview with senior Flipkart Tech leads."
      ],
      sampleQuestion: "Develop a cache eviction policy supporting LRU characteristics under a concurrent thread scheduling pool."
    },
    {
      id: 3,
      title: "Reliance Jio Graduate SDE Intern (Code Arena)",
      company: "Reliance Jio Platforms",
      logo: "🔵🔴",
      stipend: "₹30,000 - ₹45,000 / month",
      location: "Navi Mumbai, India (On-site)",
      duration: "6 Months",
      isFaang: false,
      eligibility: "Pre-final Year CS, IT, ECE engineering graduates & MCA candidates",
      unstopLink: "https://unstop.com/hackathons/jio-code-arena-reliance-jio-platforms-749102",
      description: "Jio Code Arena is Jio's official mega recruitment hackathon hosted on Unstop. Successful participants land direct technical internship opportunities across Jio Cinema, Jio 5G Cloud, and Jio Mart projects.",
      badges: ["Java", "Spring Boot", "Data Structures", "REST APIs", "SQL"],
      steps: [
        "Enroll in Jio Code Arena on Unstop. Set up your language preferences (Java/Python/C++).",
        "Attempt the Code Arena Speed Test: Solve 3 algorithmic challenges within 90 minutes.",
        "Submit a prototype idea for Jio's digital ecosystem (e.g. Scalable Chat, Smart Streaming).",
        "Unstop proctored coding analytics report is sent directly to Jio SDE talent team.",
        "Attend the final assessment: 1 technical interview + 1 HR culture-fit round."
      ],
      sampleQuestion: "Write an API logic to partition database shards based on geolocation proximity records dynamically."
    },
    {
      id: 4,
      title: "Amazon WOW Software Development Intern",
      company: "Amazon India",
      logo: "🟠⚫",
      stipend: "₹1,10,000 / month",
      location: "Bangalore / Chennai / Delhi NCR",
      duration: "2 - 6 Months",
      isFaang: true,
      eligibility: "Female students or diverse talent pursuing Bachelor's, Master's or dual degrees in Engineering",
      unstopLink: "https://unstop.com/p/amazon-wow-internship-drive-amazon-881254",
      description: "Amazon WOW is a premier initiative partnering with Unstop. It features tech masterclasses, SDE coding assessment mock practices, and structured interview loops for full-semester internships.",
      badges: ["Data Structures", "Algorithms", "AWS basics", "System Architecture"],
      steps: [
        "Register on Amazon WOW recruitment tracker, synchronized with Unstop.",
        "Complete the proctored Amazon Online Assessment (OA): Coding Section (2 questions) + Work Style simulation.",
        "Ensure high scores in Amazon's leadership principles assessments.",
        "Undergo portfolio evaluation focusing on cloud system patterns or advanced web projects.",
        "Complete 2 back-to-back virtual whiteboard interviews (DSA, Code Optimization, and Big-O verification)."
      ],
      sampleQuestion: "Given a network of server dependency nodes, find the critical connections whose failure stops system packet delivery (Bridge/Tarjan's algorithm)."
    },
    {
      id: 5,
      title: "Wipro Elite National Talent SDE Intern",
      company: "Wipro Technologies",
      logo: "🔴🟡🟢",
      stipend: "₹22,000 - ₹28,000 / month",
      location: "Pan India (Remote / Hybrid)",
      duration: "6 Months",
      isFaang: false,
      eligibility: "B.Tech, B.E., MCA, M.Tech final year graduates (Open to all streams)",
      unstopLink: "https://unstop.com/competitions/wipro-elite-national-talent-hunt-wipro-692514",
      description: "The National Talent Hunt is Wipro’s primary portal campaign hosted on Unstop for wide-breadth selection. Excellent for engineering students looking to step directly into live enterprise software projects.",
      badges: ["SQL", "Web Basics", "Aptitude Coding", "Java / Python"],
      steps: [
        "Sign up for Wipro Elite NTH campaign on Unstop.",
        "Clear the Unstop Proctored Test: Section A (Aptitude, Logical, English) + Section B (2 code questions block).",
        "Earn the Wipro Elite Assessment Badge representing coding proficiency.",
        "Receive direct invitation for the Virtual Technical Interview Panel.",
        "Participate in the executive HR discussion to secure your global project placement."
      ],
      sampleQuestion: "Given an array of server transaction loads, balance them symmetrically with minimal transfer costs."
    }
  ];

  // Filtering logic
  const filteredInternships = unstopInternships.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.badges.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeSegment === "all") return matchesSearch;
    if (activeSegment === "high-stipend") return matchesSearch && (item.isHighStipend || item.id === 4 || item.id === 2);
    if (activeSegment === "faang") return matchesSearch && item.isFaang;
    return matchesSearch;
  });

  return (
    <div className="w-full text-left max-w-6xl mx-auto py-4 flex flex-col gap-6 font-sans select-none px-4">
      
      {/* Back to Dashboard rail */}
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-cyan-500 hover:text-white font-mono font-bold tracking-wider transition-all group bg-slate-900 border border-white/5 hover:border-cyan-500/30 px-4 py-2 rounded-xl cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>BACK TO DASHBOARD</span>
          </button>
        </div>
      )}

      {/* Hero Header panel */}
      <div className="relative glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 rounded-full bg-indigo-500/5 blur-[60px] pointer-events-none" />

        <div className="flex-1 z-10">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-cyan-600 dark:text-cyan-400 text-[10.5px] font-mono font-bold uppercase tracking-widest mb-4">
            <Flame className="h-3.5 w-3.5 text-orange-500 animate-pulse" /> UNSTOP ACTIVE TRACKS
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            Official Unstop <br />
            <span className="bg-gradient-to-r from-cyan-600 via-indigo-500 to-blue-500 dark:from-cyan-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
              Tech Internship Hub
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed mt-4 max-w-xl">
            Succeed in top competitive campus hiring events! We have curated 5 high-impact, verified SDE internships hosted on <span className="font-semibold text-cyan-600 dark:text-cyan-400">Unstop</span>. Review the exact assessment blueprint and start preparation.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 border-t border-slate-200 dark:border-white/5 pt-6 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> ₹30K - ₹1.1L Stipends</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Proctoring & Plagiarism Clean</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Direct Interview Links</span>
          </div>
        </div>

        {/* Dynamic Graphic Card */}
        <div className="w-full md:w-80 shrink-0 relative z-10">
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-5 shadow-2xl text-left font-mono">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5 text-cyan-400" /> code-assessment.sh</span>
              <span className="text-emerald-500">READY</span>
            </div>
            <div className="space-y-2 text-xs">
              <p className="text-slate-400"># Prepare for Unstop Proctoring</p>
              <p className="text-cyan-400">UNSTOP_SCORE_TARGET=100</p>
              <p className="text-slate-300">npm test --assessments</p>
              <p className="text-yellow-400 mt-2">Checking plagiarism policies...</p>
              <p className="text-emerald-400">&gt;&gt; Safe browser tab logs: PASS</p>
              <div className="bg-slate-900 border border-white/5 p-2 rounded-lg mt-3">
                <p className="text-[10px] text-slate-400 leading-normal">
                  <strong className="text-white">Tip:</strong> Do not split screens or switch tabs on Unstop, otherwise your exam triggers caution logs instantly!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO SECTIONS LAYOUT: Left is List and Filter, Right is full detailed Step-by-Step interactive screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Filters and Internship List */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Custom Search & Segment filter */}
          <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/20">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by company or tech skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-sans text-slate-900 dark:text-white tracking-wide"
              />
            </div>

            {/* Quick selectors segment */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/60 rounded-lg">
              <button
                onClick={() => setActiveSegment("all")}
                className={`flex-1 text-center py-1.5 rounded-md text-[10.5px] font-mono font-bold transition-all ${
                  activeSegment === "all"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All ({unstopInternships.length})
              </button>
              <button
                onClick={() => setActiveSegment("high-stipend")}
                className={`flex-1 text-center py-1.5 rounded-md text-[10.5px] font-mono font-bold transition-all ${
                  activeSegment === "high-stipend"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                High Stipend ₹
              </button>
              <button
                onClick={() => setActiveSegment("faang")}
                className={`flex-1 text-center py-1.5 rounded-md text-[10.5px] font-mono font-bold transition-all ${
                  activeSegment === "faang"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                FAANG
              </button>
            </div>
          </div>

          {/* Internships listing list */}
          <div className="flex flex-col gap-3.5 max-h-[600px] overflow-y-auto scrollbar">
            {filteredInternships.length > 0 ? (
              filteredInternships.map((intern, idx) => {
                const isSelected = selectedInternship === idx;
                return (
                  <div
                    key={intern.id}
                    onClick={() => setSelectedInternship(idx)}
                    className={`glass-panel p-4.5 rounded-xl border transition-all text-left cursor-pointer flex flex-col gap-2 relative overflow-hidden group ${
                      isSelected 
                        ? "border-cyan-500 ring-1 ring-cyan-500/20 bg-slate-50 dark:bg-slate-900/40 translate-x-1" 
                        : "border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-800"
                    }`}
                  >
                    {/* Background decoration */}
                    <div className="absolute right-0 top-0 text-3xl opacity-[0.08] pointer-events-none group-hover:scale-110 transition-transform">
                      {intern.logo}
                    </div>

                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm shrink-0">{intern.logo}</span>
                        <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                          {intern.company}
                        </span>
                      </div>
                      
                      {intern.isFaang && (
                        <span className="bg-pink-500/15 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-[8.5px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded">
                          FAANG Track
                        </span>
                      )}
                      {intern.isHighStipend && (
                        <span className="bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[8.5px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded">
                          Premium ₹
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-white font-sans mt-1 line-clamp-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {intern.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3 inline text-slate-400" /> {intern.location}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{intern.stipend}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {intern.badges.slice(0, 3).map((b) => (
                        <span key={b} className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-mono text-[9px] py-0.5 px-1.5 rounded">
                          {b}
                        </span>
                      ))}
                      {intern.badges.length > 3 && (
                        <span className="text-[9px] text-slate-400 font-mono py-0.5 px-1">
                          +{intern.badges.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 glass-panel border border-dashed rounded-xl text-slate-400 text-xs">
                No matching Unstop internships found.
              </div>
            )}
          </div>
          
        </div>

        {/* Right column: Dynamic interactive instruction display section */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {selectedInternship !== null ? (
            (() => {
              const item = filteredInternships[selectedInternship] || unstopInternships[0];
              return (
                <div className="glass-panel p-6 border border-cyan-500/25 rounded-2xl bg-white dark:bg-slate-950/80 shadow-2xl relative overflow-hidden flex flex-col gap-5 text-left transition-all">
                  
                  {/* Company background logo */}
                  <div className="absolute right-4 top-4 text-7xl opacity-[0.03] select-none pointer-events-none">
                    {item.logo}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xl">{item.logo}</span>
                      <span className="text-xs font-mono font-bold tracking-widest text-[#06b6d4] uppercase">
                        {item.company} Official Campaign
                      </span>
                    </div>

                    <h3 className="font-display font-black text-lg sm:text-2xl text-slate-900 dark:text-white mt-2 leading-snug">
                      {item.title}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-4 border-y border-slate-200 dark:border-white/5 py-4">
                      <div>
                        <span className="block text-[10px] uppercase font-mono text-slate-400">Monthly Stipend</span>
                        <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{item.stipend}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-mono text-slate-400">Duration</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-100 font-mono">{item.duration}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-mono text-slate-400">Job Type</span>
                        <span className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">Unstop Live SDE</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary of internship */}
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans mt-1">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 font-mono">Job Description:</h5>
                    <p>{item.description}</p>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 p-3.5 rounded-xl text-left">
                    <span className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Academic Eligibility Checklist:</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-normal">{item.eligibility}</p>
                  </div>

                  {/* STEP-BY-STEP APPLICATION ROADMAP WITH COMPLETE PROCESS */}
                  <div className="mt-2 text-left">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-white/5 pb-2">
                      <Compass className="h-4 w-4 text-cyan-500 animate-spin" />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Step-by-Step Application Blueprint Process:</h4>
                    </div>

                    <div className="space-y-4">
                      {item.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 items-start group">
                          <div className="w-5.5 h-5.5 rounded-full shrink-0 flex items-center justify-center text-[10.5px] font-mono font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample problem / assessment prep guideline block */}
                  <div className="border border-dashed border-cyan-500/20 bg-[#06b6d4]/5 p-4 rounded-xl text-left">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                      <Terminal className="h-4 w-4 shrink-0" />
                      <span>UNSTOP OA PREP SAMPLE CODING DRILL</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-white/5 leading-relaxed overflow-x-auto scrollbar">
                      {item.sampleQuestion}
                    </p>
                    <span className="block text-[9.5px] text-slate-400 font-sans mt-2.5">
                      <strong>TIP:</strong> Practice our interactive <strong>Vapor Compiler Playground Sandbox</strong> below to mock prepare for strict O(1) or O(N log N) time limit cases!
                    </span>
                  </div>

                  {/* CTA Active Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-4">
                    <a
                      href={item.unstopLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-sans font-extrabold text-xs sm:text-sm py-4.5 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg active:scale-95 cursor-pointer text-center"
                    >
                      <span>APPLY ON UNSTOP CAMPAIGN</span>
                      <ExternalLink className="h-4.5 w-4.5 shrink-0" />
                    </a>

                    <button
                      onClick={() => setSelectedInternship(null)}
                      className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 font-mono text-xs py-4 px-5 rounded-xl cursor-pointer transition-colors"
                    >
                      Close Details
                    </button>
                  </div>

                </div>
              );
            })()
          ) : (
            <div className="glass-panel p-8 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl bg-white/20 dark:bg-slate-950/10 text-center flex flex-col items-center justify-center py-20 min-h-[420px]">
              <Compass className="h-12 w-12 text-cyan-500/20 mb-4 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Unstop Roadmap Blueprint</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm leading-relaxed">
                Select any active corporate technology internship in the sidebar to review eligibility, detailed round processes, sample coding patterns, and real campaign directions.
              </p>
            </div>
          )}

          {/* GENERAL UNSTOP SELECTION PLAYBOOK GUIDE CARD */}
          <div className="glass-panel p-5 border border-indigo-500/10 rounded-2xl bg-slate-50 dark:bg-slate-950/40 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-indigo-500" />
              <h4 className="text-xs sm:text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest font-mono">UNSTOP TECHNICAL RECRUITMENT SECRETS PLAYBOOK</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2 text-slate-600 dark:text-slate-300">
              <div className="space-y-2">
                <span className="font-bold text-slate-800 dark:text-white block">1. 100% Core Profile Score</span>
                <p className="leading-relaxed">Keep your academic GPA, key programming languages (checked), and verified certifications in sync. Recruiters filter applications below a 7.5 CGPA immediately inside custom campaigns.</p>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-slate-800 dark:text-white block">2. Proctoring Warning Safeguards</span>
                <p className="leading-relaxed">Unstop uses secure tabs. Leaving the proctored screen twice, splitting tabs, resizing, or using external clipboards instantly flags a candidate for manual verification.</p>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-slate-800 dark:text-white block">3. Speed Over Pure Perfection</span>
                <p className="leading-relaxed">Aptitude and coding scores utilize speed score parameters. Solving 2 questions in 40 minutes scores significantly higher than 2 in 60 minutes.</p>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-slate-800 dark:text-white block">4. Integrated Resume Optimization</span>
                <p className="leading-relaxed">Embed live URLs pointing to verified project code repositories and cloud-hosted deployments. This establishes high credibility during technical screens.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
