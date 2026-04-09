import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "card-enter": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "tab-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "tab-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "label-up": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "bg-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-cycle": {
          "0%, 100%": { opacity: "0", transform: "translateY(6px)" },
          "15%, 85%": { opacity: "1", transform: "translateY(0)" },
        },
        "zoom-fade-out": {
          "0%": { opacity: "1", transform: "scale(1)", filter: "blur(0px)" },
          "100%": { opacity: "0", transform: "scale(1.06)", filter: "blur(6px)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "card-enter": "card-enter 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "tab-in-right": "tab-in-right 0.25s cubic-bezier(0.16,1,0.3,1) both",
        "tab-in-left": "tab-in-left 0.25s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2.4s linear infinite",
        "label-up": "label-up 0.2s ease both",
        float: "float 4s ease-in-out infinite",
        "bg-pan": "bg-pan 12s ease infinite",
        "fade-cycle": "fade-cycle 4s ease-in-out infinite",
        "zoom-fade-out": "zoom-fade-out 0.7s cubic-bezier(0.4,0,0.2,1) forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
