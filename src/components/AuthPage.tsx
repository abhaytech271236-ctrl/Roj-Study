import React, { useState, useEffect } from "react";
import { Mail, Lock, User, Sparkles, AlertCircle, ArrowLeft, GraduationCap } from "lucide-react";
import { rzAuth } from "../lib/firebase";

interface AuthPageProps {
  initialMode: "LOGIN" | "SIGNUP" | "FORGOT";
  onLoginSuccess: (name: string, email: string, avatar?: string) => void;
  onNavigate: (view: string) => void;
}

export default function AuthPage({ initialMode, onLoginSuccess, onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<"LOGIN" | "SIGNUP" | "FORGOT">(initialMode);
  
  // Update internal mode state if parent prop shifts
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Input fields state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessInfo("");
    setIsLoading(true);

    try {
      if (mode === "LOGIN") {
        if (!email || !password) {
          setErrorMsg("Please fill in all email and password credentials.");
          setIsLoading(false);
          return;
        }
        const user = await rzAuth.loginWithEmail(email, password);
        onLoginSuccess(user.name, user.email, user.photoURL);
      } else if (mode === "SIGNUP") {
        if (!name || !email || !password) {
          setErrorMsg("All student registration inputs are required!");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg("Password security standard check: Minimum 6 characters required.");
          setIsLoading(false);
          return;
        }
        const user = await rzAuth.registerWithEmail(email, password, name);
        onLoginSuccess(user.name, user.email, user.photoURL);
      } else {
        // Forgot password dispatch
        if (!email) {
          setErrorMsg("Provide a valid registered email to dispatch reset credentials.");
          setIsLoading(false);
          return;
        }
        await rzAuth.resetPasswordEmail(email);
        setSuccessInfo("Password reset dispatch link issued successfully! Check inbox. 🚀");
        setEmail("");
      }
    } catch (err: any) {
      console.error("Auth Page Error:", err);
      let errMsg = "An unexpected server authorization error occurred.";
      if (err.code === "auth/invalid-credential" || err.message?.includes("wrong-password") || err.message?.includes("wrong")) {
        errMsg = "Authentication error: Incorrect password pattern or invalid student email.";
      } else if (err.code === "auth/email-already-in-use" || err.message?.includes("email-already-in-use")) {
        errMsg = "Registration warning: Email already associated with Roz Study. Please Log In.";
      } else if (err.code === "auth/user-not-found" || err.message?.includes("user-not-found")) {
        errMsg = "Account warning: Email not registered. Click Register to create profile.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Credential check failed: Please offer a valid format email address.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Password security warning: Choose a safer, stronger password.";
      } else if (err.message) {
        errMsg = err.message;
      }
      setErrorMsg(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleConnect = async () => {
    setErrorMsg("");
    setSuccessInfo("");
    setIsLoading(true);
    try {
      const user = await rzAuth.loginWithGooglePopup();
      onLoginSuccess(user.name, user.email, user.photoURL);
    } catch (err: any) {
      const isPopupClosed = err.code === "auth/popup-closed-by-user" || 
                            err.message?.includes("popup-closed-by-user") || 
                            err.message?.includes("closed-by-user");

      if (isPopupClosed) {
        console.warn("Google sign-in popup was cancelled by user.");
      } else {
        console.error("Auth Page Google Connection Error:", err);
      }

      let errMsg = "Failed to initiate secure Google Sign-in transaction.";
      if (isPopupClosed) {
        errMsg = "Google login popup window was closed before completing authorization. TIP: If popups are blocked or failing, you can also use standard Email & Password registration to sign under a completely fresh account!";
      } else if (err.message) {
        errMsg = err.message;
      }
      setErrorMsg(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center min-h-[75vh]" id="auth-page-root">
      
      {/* Decorative Blur Background Highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

      {/* Main Container Layout Cards */}
      <div className="w-full max-w-md bg-[#0f0f1c]/90 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all">
        
        {/* Glow vector stripe */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 animate-pulse" />

        <button 
          onClick={() => onNavigate("landing")}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-all mb-6 group cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-cyan-400" />
          <span>BACK TO ROZ STUDY WEB</span>
        </button>

        {/* Headings structure */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-3.5">
            <GraduationCap className="h-4 w-4 animate-bounce" /> ROZ STUDY ACADEMY PORTAL
          </div>
          
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
            {mode === "LOGIN" && "Secure Student Sign In"}
            {mode === "SIGNUP" && "Create Student Profile"}
            {mode === "FORGOT" && "Account Recovery Center"}
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
            {mode === "LOGIN" && "Sign in to compile HTML, CSS, JS live inside the web sandbox and claim verified course certificates."}
            {mode === "SIGNUP" && "Unlock all interactive study modules, practice code questions, and track developer streaks today."}
            {mode === "FORGOT" && "Enter your email registration details to recover student classroom progress indices."}
          </p>
        </div>

        {/* Forms layout */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          
          {mode === "SIGNUP" && (
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5 font-bold">Full Student Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="e.g. Abhay Dev"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131124] border border-white/10 hover:border-white/20 rounded-xl py-3 pl-11 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1.5 font-bold">Student Email Contact</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
              <input 
                type="email" 
                placeholder="student@rozstudy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131124] border border-white/10 hover:border-white/20 rounded-xl py-3 pl-11 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                required
              />
            </div>
          </div>

          {mode !== "FORGOT" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Security Password</label>
                {mode === "LOGIN" && (
                  <button 
                    type="button"
                    onClick={() => setMode("FORGOT")}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131124] border border-white/10 hover:border-white/20 rounded-xl py-3 pl-11 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  required
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/40 border border-red-800/20 text-red-400 text-xs p-3.5 rounded-xl flex items-start gap-2 leading-relaxed animate-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successInfo && (
            <div className="bg-emerald-950/40 border border-emerald-800/20 text-emerald-400 text-xs p-3.5 rounded-xl flex items-start gap-2 leading-relaxed animate-in slide-in-from-top-1 duration-200">
              <Sparkles className="h-4.5 w-4.5 shrink-0 text-emerald-400 mt-0.5 animate-pulse" />
              <span>{successInfo}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-white font-semibold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-950/40 active:scale-95 text-center cursor-pointer mt-2 disabled:opacity-55"
          >
            {isLoading ? "Authenticating Securely..." : (
              <>
                {mode === "LOGIN" && "EXECUTE LOG IN ACCESS"}
                {mode === "SIGNUP" && "CREATE MEMBER SCHOLAR ACCOUNT"}
                {mode === "FORGOT" && "DISPATCH RESET CREDENTIALS"}
              </>
            )}
          </button>
        </form>

        {/* Third-Party Google Core Access Row */}
        {mode !== "FORGOT" && (
          <div className="mt-8 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="w-full border-t border-white/5" />
              <span className="text-[10px] font-mono text-slate-500 uppercase px-3.5 whitespace-nowrap tracking-widest">SECURE CREDENTIAL GATE</span>
              <span className="w-full border-t border-white/5" />
            </div>

            <button 
              type="button"
              disabled={isLoading}
              onClick={handleGoogleConnect}
              className="bg-[#131124] hover:bg-slate-900 border border-white/10 hover:border-cyan-500/35 rounded-xl py-3 px-4 transition-all text-xs text-slate-200 font-semibold flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google Secure Sign In</span>
            </button>
          </div>
        )}

        {/* Footer Navigation mode switch togglers */}
        <div className="border-t border-white/5 pt-5 mt-6 flex items-center justify-center text-xs text-slate-400">
          {mode === "LOGIN" && (
            <span>
              New student to Roz Study?{" "}
              <button onClick={() => setMode("SIGNUP")} className="text-cyan-400 font-bold hover:underline cursor-pointer">Register Profile Free</button>
            </span>
          )}
          {mode === "SIGNUP" && (
            <span>
              Already registered?{" "}
              <button onClick={() => setMode("LOGIN")} className="text-cyan-400 font-bold hover:underline cursor-pointer">Sign In Access</button>
            </span>
          )}
          {mode === "FORGOT" && (
            <button 
              onClick={() => setMode("LOGIN")}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>Back to Secure Login</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
