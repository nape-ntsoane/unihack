// Rose Dusk Design System Tokens
const theme = {
  colors: {
    bg: "#1A0A14",
    surface: "#2D0A28",
    surfaceRaised: "#3D1038",
    primary: "#FB7185",
    primaryDark: "#E11D48",
    accent: "#F9A8D4",
    warm: "#FDBA74",
    success: "#6EE7B7",
    textPrimary: "#FFF0F5",
    textSecondary: "#FBCFE8",
    textMuted: "#F472B6",
  },
  gradients: {
    hero: "linear-gradient(135deg, #1A0A14 0%, #2D0A28 50%, #1A1A0A 100%)",
    card: "linear-gradient(135deg, #2D0A28 0%, #1A1A0A 100%)",
    button: "linear-gradient(135deg, #FB7185 0%, #F9A8D4 100%)",
    warm: "linear-gradient(135deg, #FDBA74 0%, #FB7185 100%)",
  },
  glow: "rgba(251,113,133,0.3)",
  spacing: (val: number) => `${val * 4}px`,
};

export default theme;
export type Theme = typeof theme;
