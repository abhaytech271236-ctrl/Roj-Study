import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";

/**
 * ============================================================================
 * GOOGLE ADSENSE & CPM AD NETWORKS INTEGRATION CONFIGURATION
 * ============================================================================
 */
export const ADS_CONFIG = {
  ENABLE_ADS: false, // Turn off to completely remove/deactivate old script blocks.
  PUBLISHER_ID: "", 
  SLOTS: {
    TOP_BANNER: "",  
    IN_CONTENT: "",  
    SIDEBAR: "",     
    FOOTER: "",      
    MOBILE_STICKY: "" 
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

  if (isDismissed && type === "mobile-sticky") {
    return null;
  }

  let dimensionsLabel = "";
  let typeTitle = "";
  let cssHeight = "";
  let adSrcDoc = "";
  let frameWidth = "100%";
  let frameHeight = "100%";

  // Generate safe sandboxed HTML to run custom third-party ad scripts (preventing document.write from wiping the React host document body)
  switch (type) {
    case "top-banner":
      dimensionsLabel = "320 x 50 Banner";
      typeTitle = "Top Banner CPM Ad";
      cssHeight = "min-h-[70px]";
      frameWidth = "320px";
      frameHeight = "50px";
      adSrcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body, html { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '072429153316b6df95ea263e7fbea909',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/072429153316b6df95ea263e7fbea909/invoke.js"></script>
        </body>
        </html>
      `;
      break;

    case "mobile-sticky":
      dimensionsLabel = "320 x 50 Anchor";
      typeTitle = "Sticky Mobile Anchor Ad";
      cssHeight = "h-[50px]";
      frameWidth = "320px";
      frameHeight = "50px";
      adSrcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body, html { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '072429153316b6df95ea263e7fbea909',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/072429153316b6df95ea263e7fbea909/invoke.js"></script>
        </body>
        </html>
      `;
      break;

    case "in-content":
      dimensionsLabel = "300 x 250 Rectangle";
      typeTitle = "In-Content Interactive Ad";
      cssHeight = "min-h-[270px]";
      frameWidth = "300px";
      frameHeight = "250px";
      adSrcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body, html { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '016a4f25a7895ebac8dc02adf62c03a7',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/016a4f25a7895ebac8dc02adf62c03a7/invoke.js"></script>
        </body>
        </html>
      `;
      break;

    case "sidebar":
      dimensionsLabel = "300 x 250 Rectangle";
      typeTitle = "Sidebar Sponsored Space";
      cssHeight = "min-h-[270px]";
      frameWidth = "300px";
      frameHeight = "250px";
      adSrcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body, html { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '016a4f25a7895ebac8dc02adf62c03a7',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/016a4f25a7895ebac8dc02adf62c03a7/invoke.js"></script>
        </body>
        </html>
      `;
      break;

    case "footer":
      dimensionsLabel = "Responsive Native CPM";
      typeTitle = "Footer Sponsored Content";
      cssHeight = "min-h-[250px]";
      frameWidth = "100%";
      frameHeight = "250px";
      adSrcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body, html { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; }
            #container-be12e0f9d1cd8f82d6b4ec36c3cb675b { width: 100%; display: flex; justify-content: center; align-items: center; }
          </style>
        </head>
        <body>
          <div id="container-be12e0f9d1cd8f82d6b4ec36c3cb675b"></div>
          <script async="async" data-cfasync="false" src="https://pl30144504.effectivecpmnetwork.com/be12e0f9d1cd8f82d6b4ec36c3cb675b/invoke.js"></script>
        </body>
        </html>
      `;
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
          <span className="text-[7px] font-mono tracking-wider text-slate-400 uppercase font-bold select-none bg-slate-900 border border-white/5 py-0.5 px-1.5 rounded">
            Ad
          </span>

          <div className={`flex-1 flex justify-center items-center ${cssHeight} relative overflow-hidden bg-slate-950/45 rounded-lg border border-dashed border-white/10`}>
            {/* Safe, sandbox-isolated CPM banner iframe */}
            <iframe 
              title={`ad-${id}`}
              srcDoc={adSrcDoc}
              style={{ width: frameWidth, height: frameHeight, border: "none" }}
              scrolling="no"
              className="relative z-10"
            />
            
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none">
              <span className="text-[9px] font-mono text-slate-500 font-medium">
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
      {/* Live sandboxed custom ad script iframe */}
      <div className="absolute inset-0 w-full h-full p-2 flex items-center justify-center pointer-events-auto">
        <iframe 
          title={`ad-${id}`}
          srcDoc={adSrcDoc}
          style={{ width: frameWidth, height: frameHeight, border: "none" }}
          scrolling="no"
          className="relative z-10"
        />
      </div>

      {/* Elegant, clean fallback placeholder labeled as "Advertisement" */}
      <div className="flex flex-col items-center justify-center text-center relative z-0 pointer-events-none select-none opacity-40 group-hover:opacity-10 transition-opacity">
        <span className="text-[8.5px] font-mono tracking-[0.2em] text-slate-500 uppercase font-semibold">
          Sponsored
        </span>
        <span className="text-[10px] text-slate-600 font-mono mt-1 lowercase">
          {typeTitle}
        </span>
      </div>
    </div>
  );
}

