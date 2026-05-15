import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        bob: "bob 2.8s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        talkBounce: "talkBounce 0.45s ease-in-out infinite",
        laughTilt: "laughTilt 0.9s ease-in-out infinite",
        thinkFloat: "thinkFloat 1.8s ease-in-out infinite",
        hypeShake: "hypeShake 0.6s ease-in-out infinite"
      },
      boxShadow: {
        neon: "0 0 40px rgba(56, 189, 248, 0.3)"
      },
      keyframes: {
        bob: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseGlow: {
          "0%, 100%": { filter: "drop-shadow(0 0 0.6rem rgba(34, 211, 238, 0.15))" },
          "50%": { filter: "drop-shadow(0 0 1.5rem rgba(251, 113, 133, 0.35))" }
        },
        talkBounce: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-4px) scale(1.02)" }
        },
        laughTilt: {
          "0%, 100%": { transform: "rotate(-2deg) scale(1)" },
          "50%": { transform: "rotate(2deg) scale(1.03)" }
        },
        thinkFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        hypeShake: {
          "0%, 100%": { transform: "translateX(0px) rotate(0deg)" },
          "25%": { transform: "translateX(-2px) rotate(-1deg)" },
          "75%": { transform: "translateX(2px) rotate(1deg)" }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
