import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";

/**
 * ============================================================================
 * GOOGLE ADSENSE INTEGRATION CONFIGURATION
 * ============================================================================
 * To implement Google AdSense:
 * 1. Set ENABLE_ADS to true.
 * 2. Replace PUBLISHER_ID with your organic Google AdSense publisher ID (e.g., "ca-pub-1234567890123456").
 * 3. Fill the SLOTS object below with corresponding ad slot IDs from your AdSense Console.
 */
export const ADS_CONFIG = {
  ENABLE_ADS: true, // Turn on to show ad placeholders / active ads. Turn off to keep completely hidden.
  PUBLISHER_ID: "ca-pub-8311821551045497", // Your real Google AdSense Publisher ID
  SLOTS: {
    TOP_BANNER: "8812940251",  // AdSense Leaderboard Slot ID
    IN_CONTENT: "1138409257",  // AdSense In-Content / Article Slot ID
    SIDEBAR: "4820194850",     // AdSense Sidebar / Tower Slot ID
    FOOTER: "5591024823",      // AdSense Footer Link / Banner Slot ID
    MOBILE_STICKY: "2209184561" // AdSense Mobile Anchor Slot ID
  }
};

interface AdsProps {
  id: string;
  type: "top-banner" | "in-content" | "sidebar" | "footer" | "mobile-sticky";
  className?: string;
}

export default function Ads({ id, type, className = "" }: AdsProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Keep these sections completely hidden if no ad integration is enabled/configured
  if (!ADS_CONFIG.ENABLE_ADS) {
    return null;
  }

  // Load Google AdSense library dynamically once ads are enabled
  useEffect(() => {
    if (!ADS_CONFIG.PUBLISHER_ID || ADS_CONFIG.PUBLISHER_ID.includes("XXXX")) {
      return;
    }
    
    // Inject the main Google AdSense script loader
    const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.PUBLISHER_ID}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    // Try to trigger AdSense layout queue
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Graceful fail when using local development / mock publisher IDs
    }
  }, []);

  if (isDismissed && type === "mobile-sticky") {
    return null;
  }

  let slotId = "";
  let dimensionsLabel = "";
  let typeTitle = "";
  let cssHeight = "";

  switch (type) {
    case "top-banner":
      slotId = ADS_CONFIG.SLOTS.TOP_BANNER;
      dimensionsLabel = "728 x 90 (Leaderboard)";
      typeTitle = "Top Banner Ad Space";
      cssHeight = "min-h-[90px] sm:min-h-[110px]";
      break;
    case "in-content":
      slotId = ADS_CONFIG.SLOTS.IN_CONTENT;
      dimensionsLabel = "Fluid In-Article Ad";
      typeTitle = "In-Content Ad Space";
      cssHeight = "min-h-[150px]";
      break;
    case "sidebar":
      slotId = ADS_CONFIG.SLOTS.SIDEBAR;
      dimensionsLabel = "300 x 250 / 300 x 600 (Tower)";
      typeTitle = "Sidebar Ad Space";
      cssHeight = "min-h-[250px] lg:min-h-[400px]";
      break;
    case "footer":
      slotId = ADS_CONFIG.SLOTS.FOOTER;
      dimensionsLabel = "Fluid Responsive Link Block";
      typeTitle = "Footer Ad Space";
      cssHeight = "min-h-[85px]";
      break;
    case "mobile-sticky":
      slotId = ADS_CONFIG.SLOTS.MOBILE_STICKY;
      dimensionsLabel = "320 x 50 / 320 x 100 Mobile Anchor";
      typeTitle = "Sticky Mobile Anchor Ad Space";
      cssHeight = "h-[65px] sm:h-[95px]";
      break;
  }

  // Mobile bottom sticky anchor unit
  if (type === "mobile-sticky") {
    return (
      <div 
        id={id}
        className="fixed bottom-0 left-0 right-0 z-50 w-full bg-[#07070d]/95 backdrop-blur border-t border-white/10 py-1.5 px-4 shadow-2xl flex items-center justify-between lg:hidden"
      >
        <div className="w-full flex items-center justify-between max-w-md mx-auto gap-3">
          <span className="text-[7.5px] font-mono tracking-wider text-slate-400 uppercase font-bold select-none bg-slate-900 border border-white/5 py-0.5 px-1.5 rounded">
            Advertisement
          </span>

          <div className={`flex-1 flex justify-center items-center ${cssHeight} relative overflow-hidden bg-slate-950/45 rounded-lg border border-dashed border-white/10`}>
            {/* Live Google AdSense container target */}
            <ins 
              className="adsbygoogle"
              style={{ display: "inline-block", width: "100%", height: "100%" }}
              data-ad-client={ADS_CONFIG.PUBLISHER_ID}
              data-ad-slot={slotId}
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
            
            {/* Beautiful, minimal centered placeholder label */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none">
              <span className="text-[10px] font-mono text-slate-500 font-medium lowercase">
                [{dimensionsLabel}]
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsDismissed(true)}
            className="text-[10px] font-mono text-slate-500 hover:text-white transition-colors cursor-pointer p-1 uppercase"
            aria-label="Close Ad"
          >
            Hide
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={id} 
      className={`relative w-full rounded-2xl border border-dashed border-white/10 hover:border-white/15 bg-slate-950/20 ${cssHeight} flex flex-col justify-center items-center p-4 transition-all duration-300 group overflow-hidden ${className}`}
    >
      {/* Live Google AdSense Container inside empty placeholder space */}
      <div className="absolute inset-0 w-full h-full p-2 flex items-center justify-center pointer-events-auto">
        <ins 
          className="adsbygoogle"
          style={{ display: "block", width: "150%", height: "150%" }}
          data-ad-client={ADS_CONFIG.PUBLISHER_ID}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* Elegant, clean fallback placeholder labeled as "Advertisement" */}
      <div className="flex flex-col items-center justify-center text-center relative z-10 pointer-events-none select-none">
        <span className="text-[8.5px] font-mono tracking-[0.2em] text-slate-500 uppercase font-semibold">
          Advertisement
        </span>
        <span className="text-[10px] text-slate-600 font-mono mt-1 lowercase">
          {typeTitle} ({dimensionsLabel})
        </span>
      </div>

      {/* Super easy instruction helper to copy-paste custom ad blocks in the future */}
      <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-75 transition-opacity duration-300 flex items-center gap-1">
        <Info className="h-3 w-3 text-slate-500" />
        <span className="text-[8px] font-mono text-slate-500">
          Paste AdSense Code inside /src/components/Ads.tsx
        </span>
      </div>
    </div>
  );
}

