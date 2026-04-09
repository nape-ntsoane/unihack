export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Slow-panning gradient */}
      <div
        className="absolute inset-0 animate-bg-pan"
        style={{
          backgroundSize: "300% 300%",
          backgroundImage:
            "linear-gradient(135deg, #fff1eb 0%, #fce4ec 25%, #ede7f6 50%, #fce4ec 75%, #fff1eb 100%)",
        }}
      />
      {/* Glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-orange-300/20 blur-3xl animate-float" />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-300/20 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-[40%] left-[50%] w-[30vw] h-[30vw] -translate-x-1/2 rounded-full bg-rose-300/15 blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />
    </div>
  );
}
