import React from "react";

export const ADS_CONFIG = {
  ENABLE_ADS: false,
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
  // Completely disabled ad component to maintain clean layout without external redirects or popups
  return null;
}


