import React, { useState } from "react";
import { X, Mail, Lock, User, Github, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { rzAuth } from "../lib/firebase";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (name: string, email: string, avatar?: string) => void;
  initialMode?: "LOGIN" | "SIGNUP" | "FORGOT";
}

export default function AuthModal({ onClose, onLoginSuccess, initialMode = "LOGIN" }: AuthModalProps) {
  const [mode, setMode] = useState<"LOGIN" | "SIGNUP" | "FORGOT">(initialMode);
  
  // Form input states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
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
          setErrorMsg("Please fill in all core credentials!");
          setIsLoading(false);
          return;
        }
        const user = await rzAuth.loginWithEmail(email, password);
        onLoginSuccess(user.name, user.email, user.photoURL);
      } else if (mode === "SIGNUP") {
        if (!name || !email || !password) {
          setErrorMsg("All registration input fields are required!");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg("Password must contain at least 6 characters.");
          setIsLoading(false);
          return;
        }
        const user = await rzAuth.registerWithEmail(email, password, name);
        onLoginSuccess(user.name, user.email, user.photoURL);
      } else {
        // Forgot Password flow
        if (!email) {
          setErrorMsg("Please offer a valid email register link!");
          setIsLoading(false);
          return;
        }
        await rzAuth.resetPasswordEmail(email);
        setSuccessInfo("Password reset instructions dispatched to your inbox! Check email or console logs. 🚀");
        setEmail("");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let errMsg = "An unexpected error occurred during operation.";
      if (err.code === "auth/invalid-credential" || err.message?.includes("wrong-password") || err.message?.includes("wrong")) {
        errMsg = "Incorrect password or account credentials. Please double check.";
      } else if (err.code === "auth/email-already-in-use" || err.message?.includes("email-already-in-use")) {
        errMsg = "This email is already registered. Please login instead.";
      } else if (err.code === "auth/user-not-found" || err.message?.includes("user-not-found")) {
        errMsg = "No account found with this email. Please register.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Invalid email formatting. Please input a correct address.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Security warning: Choose a stronger password (min 6 characters).";
      } else if (err.code === "auth/unauthorized-domain" || err.message?.includes("unauthorized-domain")) {
        errMsg = "Firebase Auth Error: The domain 'roj-study.vercel.app' is not registered as an Authorized Domain in your Firebase Console. Please add 'roj-study.vercel.app' to your Firebase Console under Authentication > Settings > Authorized Domains.";
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
        console.warn("Google Sign-In popup closed by user.");
      } else {
        console.error("Google Auth error:", err);
      }

      let errMsg = "Failed to complete Google Sign In popup.";
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
    <div className="fixed inset-0 z-50 bg-[#06060c]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0f0f1c]/95 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Glow vector ring */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-[50px]"></div>

        {/* Close Button Anchor */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white hover:bg-white/5 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand headers */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-[11px] font-mono text-cyan-400 font-semibold tracking-wide mb-3">
            <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} /> SECURED GATEWAY
          </div>
          
          <h2 className="font-display font-bold text-2xl text-white">
            {mode === "LOGIN" && "Welcome Back"}
            {mode === "SIGNUP" && "Join Roj Study"}
            {mode === "FORGOT" && "Recover Account"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === "LOGIN" && "Sign in to access built-in compilers & certificate trackers."}
            {mode === "SIGNUP" && "Design, code, and earn verified credentials completely free."}
            {mode === "FORGOT" && "Reset your credential pass inside interactive sandbox."}
          </p>
        </div>

        {/* Forms layout */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {mode === "SIGNUP" && (
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Full Student Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#131323] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Credential Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="email" 
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131323] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>
          </div>

          {mode !== "FORGOT" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Security Password</label>
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
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131323] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>
          )}

          {/* Remember me toggle */}
          {mode === "LOGIN" && (
            <div className="flex items-center justify-between text-xs mt-1 select-none">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded border-slate-700 bg-slate-900 focus:ring-cyan-500 rounded-sm"
                />
                <span>Remember me</span>
              </label>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/40 border border-red-800/20 text-red-400 text-xs p-3 rounded-xl flex items-start gap-2 leading-relaxed">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successInfo && (
            <div className="bg-emerald-950/40 border border-emerald-800/20 text-emerald-400 text-xs p-3 rounded-xl flex items-start gap-2 leading-relaxed">
              <Sparkles className="h-4.5 w-4.5 shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-lg shadow-cyan-950/30 active:scale-95 text-center cursor-pointer mt-2 disabled:opacity-50"
          >
            {isLoading ? "Authenticating Securely..." : (
              <>
                {mode === "LOGIN" && "Execute Sign In"}
                {mode === "SIGNUP" && "Create Student Profile"}
                {mode === "FORGOT" && "Reset Password"}
              </>
            )}
          </button>
        </form>

        {/* Split separator with social connections */}
        {mode !== "FORGOT" && (
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="w-full border-t border-white/5"></span>
              <span className="text-[10px] font-mono text-slate-500 uppercase px-3 whitespace-nowrap">Secure single sign-on</span>
              <span className="w-full border-t border-white/5"></span>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-3">
              <button 
                type="button"
                disabled={isLoading}
                onClick={handleGoogleConnect}
                className="col-span-2 bg-[#131323] hover:bg-slate-900 border border-white/10 hover:border-slate-800 rounded-xl py-2.5 px-4 transition-all text-xs text-slate-300 font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Continue with Google Secure Sign In
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation mode switch togglers */}
        <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-center text-xs text-slate-400">
          {mode === "LOGIN" && (
            <span>
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("SIGNUP")} className="text-cyan-400 font-semibold hover:underline cursor-pointer">Register Free</button>
            </span>
          )}
          {mode === "SIGNUP" && (
            <span>
              Already registered?{" "}
              <button onClick={() => setMode("LOGIN")} className="text-cyan-400 font-semibold hover:underline cursor-pointer">Sign In Access</button>
            </span>
          )}
          {mode === "FORGOT" && (
            <button 
              onClick={() => setMode("LOGIN")}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-cyan-400" />
              <span>Back to Login Access</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
