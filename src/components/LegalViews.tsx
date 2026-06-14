import React, { useState, useEffect } from "react";
import { ArrowLeft, ShieldCheck, FileText, Mail, Phone, MapPin, Info, Globe, Send, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface LegalViewsProps {
  currentSubView: string;
  onNavigate: (view: string) => void;
}

export default function LegalViews({ currentSubView, onNavigate }: LegalViewsProps) {
  const [activeTab, setActiveTab] = useState<string>(currentSubView);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  useEffect(() => {
    setActiveTab(currentSubView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSubView]);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    
    // Simulate interactive submission
    setIsSubmitSuccess(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setIsSubmitSuccess(false);
    }, 4000);
  };

  const tabs = [
    { id: "about", name: "About Us", icon: Info },
    { id: "privacy", name: "Privacy Policy", icon: ShieldCheck },
    { id: "terms", name: "Terms of Service", icon: FileText },
    { id: "disclaimer", name: "Disclaimer", icon: Globe },
    { id: "contact", name: "Contact Us", icon: Mail },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fadeIn">
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate("landing")}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest cursor-pointer bg-slate-900/60 hover:bg-slate-900 border border-white/5 px-4 py-2.5 rounded-xl text-center"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 mb-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 font-mono">
              Academy Portal
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Legal statements & contact channels required for Search Console verification & Google AdSense certification.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-xs text-left cursor-pointer font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border-cyan-500/40 text-cyan-400 font-bold shadow-lg shadow-cyan-950/20"
                      : "bg-slate-900/20 hover:bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="lg:col-span-3 bg-slate-900/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden flex flex-col gap-6">
          {/* subtle decorative background glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Render ABOUT US */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Organization Roadmap
                </span>
                <h1 className="text-2xl font-bold font-display text-white mt-3 tracking-tight">
                  About Roj Study Academy
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">Last Updated: June 2026</p>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed font-sans space-y-4">
                <p>
                  <strong>Roj Study Interactive Academy</strong> is a premier avant-garde ed-tech platform designed to eliminate the standard gaps between pure classroom theories and real-world system engineering execution.
                </p>
                <p>
                  We enable aspiring software engineers, competitive programmers, and designers worldwide to learn modern technical domains in a cohesive, sandbox-driven atmosphere. Our platform provides pre-loaded step-by-step masterclasses directly connected with:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
                  <li>
                    <strong className="text-slate-200">Interactive Code Compilers:</strong> Complete real-time playground testing for C, C++, Java, and Python.
                  </li>
                  <li>
                    <strong className="text-slate-200">DSA Competitive Track:</strong> 70+ meticulously ordered algorithmic deep dives designed to tackle FAANG-level questions.
                  </li>
                  <li>
                    <strong className="text-slate-200">Core Stack Internships:</strong> Multi-tiered frontend and backend practice syllabi complete with live API serving.
                  </li>
                  <li>
                    <strong className="text-slate-200">Vetted Certification Engine:</strong> Verification IDs written permanently to responsive digital degrees on path completion.
                  </li>
                </ul>
                <p>
                  Roj Study remains completely free of charge, with optional integration setups designed to allow students to construct beautiful standalone sandbox databases and leverage modern cloud tools recursively.
                </p>
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 mt-4">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 font-mono">Our Founding Principles</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We believe modern application development and algorithmic reasoning are muscle skills that cannot be acquired simply by reading documentation. Continuous coding repetition, live sandboxes, immediate compiler responses, and realistic certification gates constitute our core blueprint for successful engineering education.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Render PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  GDPR & AdSense Compliant
                </span>
                <h1 className="text-2xl font-bold font-display text-white mt-3 tracking-tight">
                  Privacy Policy & Cookie Consent
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">Last Updated: June 14, 2026</p>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-4 font-sans">
                <p>
                  At Roj Study, accessible from <strong>https://www.rojstudy.com</strong>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Roj Study and how we use it.
                </p>
                <p>
                  If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>starroj12367@gmail.com</strong>.
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">Log Files & Analytics</h3>
                <p>
                  Roj Study follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">Google DoubleClick DART Cookies</h3>
                <p>
                  Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.rojstudy.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">https://policies.google.com/technologies/ads</a>
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">Advertising Partners Privacy Policies</h3>
                <p>
                  You may consult this list to find the Privacy Policy for each of the advertising partners of Roj Study. Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Roj Study, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                </p>
                <p>
                  Note that Roj Study has no access to or control over these cookies that are used by third-party advertisers.
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">Student Session & Profile Security</h3>
                <p>
                  Roj Study integrates secure authentication platforms (Firebase Auth) and database engines (Firestore). Personalized data such as compiler code snippets, watch states, current streaks, and certificate files are protected against unauthorized modification. No student email, login credential, or progress index matches are shared, sold, or distributed to third-party institutions.
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">Consent</h3>
                <p>
                  By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                </p>
              </div>
            </div>
          )}

          {/* Render TERMS OF SERVICE */}
          {activeTab === "terms" && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Academic Guidelines
                </span>
                <h1 className="text-2xl font-bold font-display text-white mt-3 tracking-tight">
                  Terms and Conditions of Use
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">Last Updated: June 14, 2026</p>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-4 font-sans">
                <p>
                  Welcome to Roj Study! These terms and conditions outline the rules and regulations for the use of Roj Study's Interactive Platform, located at <strong>https://www.rojstudy.com</strong>.
                </p>
                <p>
                  By accessing this website, we assume you accept these terms and conditions. Do not continue to use Roj Study if you do not agree to take all of the terms and conditions stated on this page.
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">1. Interactive Sandbox & Compiler Abuse</h3>
                <p>
                  Roj Study grants users non-exclusive, revocable, non-transferable access to utilize client-side and server-side sandboxed compilers (web playpens) for learning C, C++, Java, and Python. You must not utilize the compiler sandbox to execute repetitive payload operations, process mining vectors, or attack server-side container orchestration gates. Standard sandbox limits apply to secure CPU cycles.
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">2. Digital Certificate Accuracy</h3>
                <p>
                  Roj Study outputs digitally generated, seal-stamped completion certificates to students upon finishing course lecture watch sessions. Certification credentials are tied directly to the Student Name written by the participant. Participants are solely responsible for ensuring the accuracy of names and represent that all curriculum track watch logs were fully analyzed in good faith. Certificates are educational accomplishments and represent platform proficiency.
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">3. License & Intellectual Property</h3>
                <p>
                  Unless otherwise stated, Roj Study owns the intellectual property rights for all educational material, questions, code sandboxes, and curriculum patterns on Roj Study. All intellectual property rights are reserved. You must not republish, sell, rent, or sub-license material from Roj Study without explicit consent.
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">4. User Content Conduct</h3>
                <p>
                  The community chat portals and note features are designed for student study collaborations only. System modifications, repetitive spam, advertisement placements, or harassing messages are strictly prohibited and will lead to instant termination of security sessions.
                </p>
              </div>
            </div>
          )}

          {/* Render DISCLAIMER */}
          {activeTab === "disclaimer" && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Academic Liability
                </span>
                <h1 className="text-2xl font-bold font-display text-white mt-3 tracking-tight">
                  Academic & Technical Disclaimer
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">Last Updated: June 14, 2026</p>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-4 font-sans">
                <p>
                  The information provided by Roj Study ("we," "us," or "our") on <strong>https://www.rojstudy.com</strong> is for general educational, programming practice, and conceptual career-readiness purposes only.
                </p>
                <p>
                  All educational curriculums, video logs, compilers, test questions, and resume frameworks are provided in good faith. However, we make no representation or warranty of any kind, express or implied, regarding the absolute completeness, accuracy, validity, reliability, or availability of any lecture guides or toolkits on the site.
                </p>

                <div className="bg-red-950/10 border border-red-900/20 p-4 rounded-xl text-slate-400 leading-relaxed font-mono">
                  🚨 Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any study courses. Your use of the platform and your reliance on educational materials is solely at your own discretion.
                </div>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">Educational Recognition & FAANG Interviews</h3>
                <p>
                  Roj Study compiles FAANG-level curriculum content and certification markers. Completion of DSA lectures, internship paths, or mock assessments does not guarantee direct physical employment, recruitment outcomes, or internship contracts with third-party tech institutions (such as Google, Microsoft, Amazon, Unstop, or Flipkart).
                </p>

                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider pt-2">External Content & Video References</h3>
                <p>
                  This e-learning workspace indexes educational public playlists and YouTube streams hosted by various expert software engineering creators. All credits belong to the original creative authors. If you find a broken embed, video unavailability, or incorrect lecture sync, please submit an immediate note so our developer group can update the backend mappings dynamically.
                </p>
              </div>
            </div>
          )}

          {/* Render CONTACT US */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Direct Inquiries
                </span>
                <h1 className="text-2xl font-bold font-display text-white mt-3 tracking-tight">
                  Contact Roj Study Support Group
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-1">Direct verification response within 24 hours.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Contact Coordinates */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-widest font-mono">
                    Official Contact Coordinates
                  </h3>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white">Email Address</h4>
                        <p className="text-slate-400 mt-1">starroj12367@gmail.com</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Primary channel for technical support and partnership requests.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-white/5 pt-3">
                      <Phone className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white">Direct Telephone Support</h4>
                        <p className="text-slate-400 mt-1">+91 8393815941</p>
                        <p className="text-slate-400">+91 9634968459</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Operating hours: Mon-Fri 09:00 AM - 06:00 PM IST.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-white/5 pt-3">
                      <MapPin className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white">Institutional Registration Location</h4>
                        <p className="text-slate-400 mt-1">Chhata, Mathura, Delhi highway, India</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Main administration branch.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Portal */}
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-widest font-mono mb-4">
                    Send An Immediate Message
                  </h3>

                  {isSubmitSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="bg-emerald-950/20 border border-emerald-800/30 rounded-xl p-5 text-center flex flex-col items-center gap-2"
                    >
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Message Transmitted!</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Thank you for reaching out. Your academic verification request has been cataloged. Our developer group will follow up shortly at your email.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmitContact} className="space-y-4 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Abhay Dev"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Your Active Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. abhay@domain.com"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Your Inquiries / Messages</label>
                        <textarea
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Type details about course requests, broken YouTube links, or certificates validation coordinates..."
                          className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono py-3 px-4 rounded-xl uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Message</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
