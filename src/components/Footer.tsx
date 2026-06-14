import React from "react";
import { GraduationCap, Mail, Phone, MapPin, Youtube, Github, Twitter, Award } from "lucide-react";
import Ads, { ADS_CONFIG } from "./Ads";

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#07070d] border-t border-white/5 pt-16 pb-8 px-4 sm:px-8 mt-auto">
      {/* Local Simulation Mode Badge */}
      {typeof window !== "undefined" && window.localStorage.getItem("rojstudy_local_simulation_mode") === "true" && (
        <div className="max-w-7xl mx-auto mb-8 bg-cyan-950/20 border border-cyan-800/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg animate-pulse" style={{ animationDuration: '4s' }}>
          <p className="text-slate-300 font-sans leading-relaxed text-center sm:text-left">
            🔌 <strong>Simulation Mode Active:</strong> You are browsing the interactive platform in Developer Sandbox Mode, bypassing Firebase auth-domain setup restrictions. Enjoy uninhibited compilers & lecture logs!
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("rojstudy_local_simulation_mode");
              window.location.reload();
            }}
            className="shrink-0 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-[10px] font-bold py-2 px-4 rounded-xl uppercase tracking-widest cursor-pointer shadow-lg"
          >
            Switch to Cloud Mode
          </button>
        </div>
      )}

      {/* Footer Google AdSense Unit */}
      {ADS_CONFIG.ENABLE_ADS && (
        <div className="max-w-7xl mx-auto mb-10">
          <Ads 
            id="adsense-footer"
            type="footer"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Information */}
        <div className="md:col-span-1.5 flex flex-col gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("landing")}>
            <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2 rounded-xl">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Roj <span className="text-cyan-400">Study</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Roj Study is an interactive, futuristic online learning platform crafted to bridge the gap between educational theory and real-world implementation. Learn, practice, and graduate.
          </p>
          <div className="flex items-center gap-3 mt-2 text-slate-400">
            <a href="#" className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-cyan-400 transition-all"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-[#ff0000] transition-all"><Youtube className="h-4 w-4" /></a>
            <a href="#" className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 hover:text-white transition-all"><Github className="h-4 w-4" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-widest mb-4 font-display">Popular Tracks</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
            <li><button onClick={() => onNavigate("dashboard")} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Frontend Internship Path</button></li>
            <li><button onClick={() => onNavigate("dashboard")} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Advanced Backend Concepts</button></li>
            <li><button onClick={() => onNavigate("dashboard")} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">DSA Competitive Coding Track</button></li>
            <li><button onClick={() => onNavigate("dashboard")} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Generative AI Essentials</button></li>
            <li><button onClick={() => onNavigate("dashboard")} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">Blender 3D Modeling</button></li>
          </ul>
        </div>

        {/* Learning Badges */}
        <div>
          <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-widest mb-4 font-display">Global Recognition</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
              <Award className="h-4.5 w-4.5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[11px] font-semibold text-white">ISO 9001:2015</h5>
                <p className="text-[10px] text-slate-400">Certified interactive digital courseware & progress tracking architectures.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
              <GraduationCap className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[11px] font-semibold text-white">Verified Certificate Engine</h5>
                <p className="text-[10px] text-slate-400">Get authentic industry-vetted digital certificates in PDF instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact/Support */}
        <div>
          <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-widest mb-4 font-display">Support Portal</h4>
          <ul className="flex flex-col gap-3 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-cyan-400" />
              <span>starroj12367@gmail.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Chhata, Mathura, Delhi highway, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-emerald-400" />
              <span>+91 8393815941 </span>
              <span>+91 9634968459 </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
        <span>© 2026 Roj Study Interactive Academy. All Rights Reserved.</span>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <button onClick={() => onNavigate("about")} className="hover:text-slate-300 cursor-pointer text-left transition-colors font-mono uppercase tracking-wider text-[10px]">About Us</button>
          <button onClick={() => onNavigate("contact")} className="hover:text-slate-300 cursor-pointer text-left transition-colors font-mono uppercase tracking-wider text-[10px]">Contact Us</button>
          <button onClick={() => onNavigate("terms")} className="hover:text-slate-300 cursor-pointer text-left transition-colors font-mono uppercase tracking-wider text-[10px]">Terms of Service</button>
          <button onClick={() => onNavigate("privacy")} className="hover:text-slate-300 cursor-pointer text-left transition-colors font-mono uppercase tracking-wider text-[10px]">Privacy Policy</button>
          <button onClick={() => onNavigate("disclaimer")} className="hover:text-slate-300 cursor-pointer text-left transition-colors font-mono uppercase tracking-wider text-[10px]">Disclaimer</button>
        </div>
      </div>
    </footer>
  );
}
