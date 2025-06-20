"use client";
import React from "react";
import config from "../config/whatsappButtonConfig";

const whatsappLink = `https://wa.me/57${config.number}${config.prefilledMessage ? `?text=${encodeURIComponent(config.prefilledMessage)}` : ""}`;

const WhatsappButton = () => (
  <a
    href={whatsappLink}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      position: "fixed",
      ...config.position,
      zIndex: 1000,
      backgroundColor: config.color,
      borderRadius: "50%",
      width: `${config.size}px`,
      height: `${config.size}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      cursor: "pointer",
      border: config.border,
      transition: "transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s",
      animation: "whatsapp-pulse 1.5s infinite cubic-bezier(.66,0,0,1)",
    }}
    aria-label="Contactar por WhatsApp"
    onMouseOver={e => {
      e.currentTarget.style.transform = 'scale(1.12)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.30)';
    }}
    onMouseOut={e => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
    }}
  >
    <style>{`
      @keyframes whatsapp-pulse {
        0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.7); }
        70% { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
        100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
      }
    `}</style>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={config.size - 26}
      height={config.size - 26}
      viewBox="0 0 32 32"
      fill="white"
    >
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.65.87 5.1 2.36 7.09L4 29l7.18-2.32A12.93 12.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.8c-2.13 0-4.19-.62-5.93-1.8l-.42-.26-4.25 1.38 1.39-4.13-.27-.43A10.77 10.77 0 015.2 15c0-5.96 4.84-10.8 10.8-10.8S26.8 9.04 26.8 15 21.96 25.8 16 25.8zm5.44-7.13c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.5-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.36.71.24 1.26.38 1.69.48.71.15 1.36.13 1.87.08.57-.06 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35z"/>
    </svg>
  </a>
);

export default WhatsappButton; 